import { InlineKeyboard } from 'grammy'
import { Order } from '@/models/Order'
import { OrderTransfer } from '@/models/OrderTransfer'
import { findLastAddedOrder } from '@/models/OrderTransferProc'
import { findOrderById } from '@/models/OrderProc'
import { preparationMessage } from '@/handlers/transfer/paymentSystem'
import Context from '@/models/Context'
import getBestPairs from '@/helpers/getBestPairs'
import getI18nKeyboard from '@/menus/custom/default'
import i18n from '@/helpers/i18n'
import notifyMe from '@/helpers/notifyMe'
import sendOptions from '@/helpers/sendOptions'

export const selectOrderTransfer = async (ctx: Context) => {
  const selection = ctx.callbackQuery?.data

  if (selection == 'previous_offers' && ctx.dbuser.currentOrderIndex! > 0) {
    ctx.dbuser.currentOrderIndex = ctx.dbuser.currentOrderIndex! - 1
    await ctx.dbuser.save()
  }

  if (
    selection == 'next_offers' &&
    ctx.dbuser.currentOrderIndex! <
      ctx.dbuser.currentTransferOrdersRequest!.length
  ) {
    ctx.dbuser.currentOrderIndex = ctx.dbuser.currentOrderIndex! + 1
    await ctx.dbuser.save()
  }
  const order = await findLastAddedOrder(ctx.dbuser)

  if (selection == 'update') {
    ctx.dbuser.currentOrderIndex = 0
    ctx.dbuser.currentTransferOrdersRequest = await getBestPairs(order)
    await ctx.dbuser.save()
  }

  const dataForMessage = await preparationMessage(
    ctx.dbuser.currentTransferOrdersRequest!,
    ctx.dbuser.currentOrderIndex!,
    order
  )

  if (selection == 'make_transfer') {
    ctx.dbuser.step = 'make_transfer'
    await ctx.dbuser.save()
    if (ctx.dbuser.username == null) {
      return ctx.replyWithLocalization('make_transfer_no_username', {
        ...sendOptions(ctx),
        reply_markup: getI18nKeyboard(ctx.dbuser.language, 'cancel'),
      })
    } else {
      await notifyMe({
        username: ctx.update.callback_query!.from.username,
        message: ctx.i18n.t('offer_for_trnafer', {
          ...sendOptions(ctx, dataForMessage),
        }),
      })
      return ctx.replyWithLocalization('make_transfer', {
        ...sendOptions(ctx),
        reply_markup: getI18nKeyboard(ctx.dbuser.language, 'cancel'),
      })
    }
  }

  const menu = createSelectOrderTransferSelectionMenu(
    ctx,
    ctx.dbuser.currentOrderIndex!,
    ctx.dbuser.currentTransferOrdersRequest!.length
  )

  if (
    order &&
    ctx.dbuser.currentOrderIndex! >= 0 &&
    ctx.dbuser.currentOrderIndex! <
      ctx.dbuser.currentTransferOrdersRequest!.length
  ) {
    const message = ctx.i18n.t('offer_for_trnafer', {
      ...sendOptions(ctx, dataForMessage),
    })

    await ctx.editMessageText(message, {
      parse_mode: 'HTML',
      reply_markup: menu,
    })
  }
}

export function createSelectOrderTransferSelectionMenu(
  ctx: Context,
  orderIndex: number,
  currentTransferOrdersRequestLength: number
) {
  const selectionMenu = new InlineKeyboard()

  let previousButtonText = '<<'
  let nextButtonText = '>>'

  if (orderIndex == 0) {
    previousButtonText = '⏹️'
    selectionMenu.text(previousButtonText, 'none')
  } else {
    selectionMenu.text(previousButtonText, 'previous_offers')
  }

  if (orderIndex + 1 == currentTransferOrdersRequestLength) {
    nextButtonText = '⏹️'
    selectionMenu.text(nextButtonText, 'none').row()
  } else {
    selectionMenu.text(nextButtonText, 'next_offers').row()
  }

  selectionMenu
    .text(i18n.t(ctx.dbuser.language, 'make_transfer_btn'), 'make_transfer')
    .row()

  return selectionMenu.text(
    i18n.t(ctx.dbuser.language, 'update_offers'),
    'update'
  )
}
