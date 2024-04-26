import Context from '@/models/Context'
import { Order } from '@/models/Order'
import sendOptions from '@/helpers/sendOptions'
import { deleteOrder, findOrderById } from '@/models/OrderProc'
import { InlineKeyboard } from 'grammy'
import i18n from '@/helpers/i18n'
import { getI18nKeyboard } from '@/helpers/bot'


export const selectUserOrder = async (ctx: Context) => {

  const selection = ctx.callbackQuery?.data
  const currentOrdersRequest = ctx.dbuser.currentOrdersRequest!

  if(selection == 'previous_my' && (ctx.dbuser.currentOrderIndex! > 0)){
   ctx.dbuser.currentOrderIndex = ctx.dbuser.currentOrderIndex! - 1 
   await ctx.dbuser.save()
  }

  if(selection == 'next_my' && (ctx.dbuser.currentOrderIndex! < currentOrdersRequest.length)){
    ctx.dbuser.currentOrderIndex = ctx.dbuser.currentOrderIndex! + 1  
    await ctx.dbuser.save()
  }

  const orderIDs = currentOrdersRequest; 
  const orderID = orderIDs[ctx.dbuser.currentOrderIndex!];
  const order: Order | null = await findOrderById(orderID);

  if(selection == 'delete'){
    await deleteOrder(order!)

    await ctx.deleteMessage()
    return await ctx.replyWithLocalization('order_deleted', {
        ...sendOptions(ctx),
        reply_markup: getI18nKeyboard(ctx.dbuser.language, 'main'),
      })
  }

  const menu = createSelectionMenuForUser(ctx, ctx.dbuser.currentOrderIndex!, currentOrdersRequest.length)

  if (order && (ctx.dbuser.currentOrderIndex! >= 0) && (ctx.dbuser.currentOrderIndex! < currentOrdersRequest.length)) {
    const message = ctx.i18n.t('select_order', {
        ...sendOptions(ctx, {
          current: ctx.dbuser.currentOrderIndex!+1,
          all: currentOrdersRequest.length,
          id: order.id,
          from: order.countryFrom,
          to: order.countryTo,
          amount: order.amount,
          currency: order.currency,
          contact: order.contact,
        })
      })

     return await ctx.editMessageText(message, {
        parse_mode: 'HTML',
        reply_markup: menu,
      })
  }
}

export function createSelectionMenuForUser(ctx: Context, orderIndex:number,  currentOrdersRequestLenght:number) {
  
  
  const selectionMenu = new InlineKeyboard()

  let previousButtonText = '<<'
  let nextButtonText = '>>'

  if (orderIndex == 0) {
    previousButtonText = '⏹️'
    selectionMenu.text(previousButtonText, 'none')
  }else{
    selectionMenu.text(previousButtonText, 'previous_my')
  }
  if (orderIndex+1 == currentOrdersRequestLenght) {
    nextButtonText = '⏹️'
    selectionMenu.text(nextButtonText, 'none').row()
  }else{
    selectionMenu.text(nextButtonText, 'next_my').row()
  }

  return selectionMenu.text(i18n.t(ctx.dbuser.language, 'delete_order'), 'delete')
}