import {
  FlagCountryMapKey,
  handleStartTransfer,
} from '@/handlers/transfer/startTransfer'
import { type Message } from '@grammyjs/types'
import { flagCountryMap } from '@/helpers/defaultValue'
import {
  handleAnotherWayToContact,
  handleCheckNick,
  handleEnterContact,
} from '@/handlers/tinder/contact'
import { handleCountryFrom, handleCountryTo } from '@/handlers/tinder/country'
import {
  handleFromFinishPaymentSystem,
  handleToFinishPaymentSystem,
} from '@/handlers/transfer/paymentSystem'
import { handleMethodFrom, handleMethodTo } from '@/handlers/tinder/method'
import { handleOtherOrders, sendUserOrders } from '@/handlers/tinder/order'
import {
  handleTransferFrom,
  handleTransferTo,
} from '@/handlers/transfer/country'
import Context from '@/models/Context'
import handleAddToWaitList from '@/handlers/transfer/addToWaitList'
import handleAmount from '@/handlers/tinder/amount'
import handleAmountTransfer from '@/handlers/transfer/amount'
import handleCancel from '@/handlers/cancel'
import handleCurrency from '@/handlers/tinder/currency'
import handlePostOrder from '@/handlers/tinder/post'
import handleSendMoney from '@/handlers/transfer/order'
import handleStartTinder from '@/handlers/tinder/startTinder'
import i18n from '@/helpers/i18n'
import sendOptions from '@/helpers/sendOptions'

export default async function selectStep(ctx: Context) {
  const message = ctx.msg!

  if (isCancel(ctx, message) && ctx.dbuser.step !== 'start') {
    return handleCancel(ctx)
  }

  switch (ctx.dbuser.step) {
    case 'start':
      if (isTinder(ctx, message)) {
        return await handleStartTinder(ctx)
      } else if (isTransfer(ctx, message)) {
        return await handleStartTransfer(ctx)
      } else {
        return await ctx.replyWithLocalization('bad_start', sendOptions(ctx))
      }
    case 'tinder':
      if (isOtherOrders(ctx, message)) {
        return await handleOtherOrders(ctx)
      } else if (isMyOrders(ctx, message)) {
        return await sendUserOrders(ctx)
      } else {
        return await ctx.replyWithLocalization(
          'bad_start_tinder',
          sendOptions(ctx)
        )
      }
    case 'transfer':
      if (isSendMoney(ctx, message)) {
        return await handleSendMoney(ctx)
      } else {
        return await ctx.replyWithLocalization(
          'bad_start_transfer',
          sendOptions(ctx)
        )
      }
    case 'enter_country_from_transfer':
      if (isFlag(ctx, message)) {
        return await handleTransferFrom(ctx, message)
      } else {
        return await ctx.replyWithLocalization('bad_req', sendOptions(ctx))
      }
    case 'enter_payment_system_from':
      if (isFinish(ctx, message)) {
        return await handleFromFinishPaymentSystem(ctx)
      } else {
        return await ctx.replyWithLocalization('bad_req', sendOptions(ctx))
      }
    case 'enter_amount_transfer':
      if (isAmount(ctx, message)) {
        return await handleAmountTransfer(ctx, message)
      } else {
        return await ctx.replyWithLocalization('bad_req', sendOptions(ctx))
      }
    case 'enter_country_to_transfer':
      if (isFlag(ctx, message)) {
        return await handleTransferTo(ctx, message)
      } else {
        return await ctx.replyWithLocalization('bad_req', sendOptions(ctx))
      }
    case 'enter_payment_system_to':
      if (isFinish(ctx, message)) {
        return await handleToFinishPaymentSystem(ctx)
      } else {
        return await ctx.replyWithLocalization('bad_req', sendOptions(ctx))
      }
    case 'waiting_list':
      if (isAdd(ctx, message)) {
        return await handleAddToWaitList(ctx)
      } else {
        return await ctx.replyWithLocalization('bad_req', sendOptions(ctx))
      }
    case 'select_country_from':
      if (isFlag(ctx, message)) {
        return await handleCountryFrom(ctx, message)
      } else {
        return await ctx.replyWithLocalization('bad_req', sendOptions(ctx))
      }
    case 'select_method_from':
      return await handleMethodFrom(ctx, message)
    case 'select_country_to':
      if (isFlag(ctx, message)) {
        return await handleCountryTo(ctx, message)
      } else {
        return await ctx.replyWithLocalization('bad_req', sendOptions(ctx))
      }
    case 'select_method_to':
      return await handleMethodTo(ctx, message)
    case 'select_currency':
      return await handleCurrency(ctx, message)
    case 'enter_amount':
      if (isAmount(ctx, message)) {
        return await handleAmount(ctx, message)
      } else {
        return await ctx.replyWithLocalization('bad_amount', sendOptions(ctx))
      }
    case 'select_order':
      if (isAmount(ctx, message)) {
        return await handleAmount(ctx, message)
      } else {
        return await ctx.replyWithLocalization('bad_req', sendOptions(ctx))
      }
    case 'select_offers':
      if (isFinish(ctx, message)) {
        return await handleCancel(ctx)
      } else {
        return await ctx.replyWithLocalization('bad_req', sendOptions(ctx))
      }
    case 'select_contact':
      if (isCheckNick(ctx, message)) {
        return await handleCheckNick(ctx, message)
      } else if (isAnotherWayToContact(ctx, message)) {
        return await handleAnotherWayToContact(ctx)
      } else {
        return await ctx.replyWithLocalization('contact', sendOptions(ctx))
      }
    case 'enter_another_way_to_contact':
      return await handleEnterContact(ctx)
    case 'check_order':
      if (isPostOrder(ctx, message)) {
        return await handlePostOrder(ctx)
      } else {
        return await ctx.replyWithLocalization(
          'bad_post_order',
          sendOptions(ctx)
        )
      }
  }
}

function isPostOrder(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'post')
}

function isCheckNick(ctx: Context, message: Message) {
  return (
    message.text == i18n.t(ctx.dbuser.language, 'check_nick') &&
    ctx.dbuser.username != null
  )
}

function isAnotherWayToContact(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'another_way_to_contact')
}

function isCurrency(ctx: Context, message: Message) {
  return (
    message.text == i18n.t(ctx.dbuser.language, 'eur') ||
    message.text == i18n.t(ctx.dbuser.language, 'usd') ||
    message.text == i18n.t(ctx.dbuser.language, 'byn') ||
    message.text == i18n.t(ctx.dbuser.language, 'pln') ||
    message.text == i18n.t(ctx.dbuser.language, 'rus') ||
    message.text == i18n.t(ctx.dbuser.language, 'uah')
  )
}

function isCancel(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'cancel')
}
function isMyOrders(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'my_orders')
}

function isOtherOrders(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'other_orders')
}

function isSendMoney(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'send_money')
}

function isAmount(ctx: Context, message: Message) {
  const amount = parseFloat(message.text!)
  return !isNaN(amount) && amount > 1
}

function isTinder(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'tinder')
}
function isTransfer(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'transfer')
}

function isAdd(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'add')
}
function isFinish(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'finish_btn')
}

function isFlag(ctx: Context, message: Message) {
  const flagKeys = Object.keys(flagCountryMap) as FlagCountryMapKey[]
  return (
    message.text?.length === 4 &&
    flagKeys.includes(message.text as FlagCountryMapKey)
  )
}
