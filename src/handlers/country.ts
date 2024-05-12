import { type Message } from '@grammyjs/types'
import { findLastAddedOrder } from '@/models/OrderProc'
import { getDefaultCountryName } from '@/helpers/defaultValue'
import { getI18nKeyboard } from '@/helpers/bot'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export async function handleCountryFrom(ctx: Context, msg: Message) {
  ctx.dbuser.step = 'select_method_from'
  await ctx.dbuser.save()

  const order = await findLastAddedOrder(ctx.dbuser)
  if (order) {
    const countryName = getDefaultCountryName(ctx.dbuser.language, msg.text!)
    order.countryFrom = countryName
    await order.save()
  }

  return ctx.replyWithLocalization('fromMethod', {
    ...sendOptions(ctx),
    reply_markup: getI18nKeyboard(ctx.dbuser.language, 'cancel'),
  })
}

export async function handleCountryTo(ctx: Context, msg: Message) {
  ctx.dbuser.step = 'select_method_to'
  await ctx.dbuser.save()

  const order = await findLastAddedOrder(ctx.dbuser)
  if (order) {
    const countryName = getDefaultCountryName(ctx.dbuser.language, msg.text!)
    order.countryTo = countryName
    await order.save()
  }

  return ctx.replyWithLocalization('toMethod', {
    ...sendOptions(ctx),
    reply_markup: getI18nKeyboard(ctx.dbuser.language, 'cancel'),
  })
}
