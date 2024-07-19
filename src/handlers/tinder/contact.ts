import { type Message } from '@grammyjs/types'
import { findLastAddedOrder } from '@/models/OrderProc'
import getI18nKeyboard from '@/menus/custom/default'

import { sendOrders } from '@/handlers/tinder/order'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export async function handleCheckNick(ctx: Context, msg: Message) {
  const order = await findLastAddedOrder(ctx.dbuser)

  if (ctx.dbuser.username == null && order!.contact == null) {
    ctx.dbuser.step = 'select_contact'
    await ctx.dbuser.save()
    return ctx.replyWithLocalization('contact', {
      ...sendOptions(ctx),
      reply_markup: getI18nKeyboard(ctx.dbuser.language, 'check_nick'),
    })
  } else {
    const order = await findLastAddedOrder(ctx.dbuser)
    if (order?.contact == null) {
      order!.contact = '@' + ctx.dbuser.username
    }
    await sendOrders(ctx)
  }
}

export async function handleAnotherWayToContact(ctx: Context) {
  ctx.dbuser.step = 'enter_another_way_to_contact'
  await ctx.dbuser.save()
  await ctx.replyWithLocalization('enter_another_way_to_contact', {
    ...sendOptions(ctx),
    reply_markup: getI18nKeyboard(ctx.dbuser.language, 'cancel'),
  })
}

export async function handleEnterContact(ctx: Context) {
  const order = await findLastAddedOrder(ctx.dbuser)
  order!.contact = ctx.msg?.text

  await sendOrders(ctx)
}
