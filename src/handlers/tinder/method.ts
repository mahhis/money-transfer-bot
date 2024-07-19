import { type Message } from '@grammyjs/types'
import { findLastAddedOrder } from '@/models/OrderProc'
import { getDefaultCountryName } from '@/helpers/defaultValue'
import getI18nKeyboard from '@/menus/custom/default'

import { getRandomFlagObject } from '@/models/OrderTransferProc'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export async function handleMethodFrom(ctx: Context, msg: Message) {
  ctx.dbuser.step = 'select_country_to'
  await ctx.dbuser.save()

  const order = await findLastAddedOrder(ctx.dbuser)
  if (order) {
    order!.methodFrom = ctx.msg?.text
    await order.save()
  }

  const exampleCountryData = getRandomFlagObject()

  return ctx.replyWithLocalization('send_flag_to', {
    ...sendOptions(ctx, {
      flag: exampleCountryData.flag,
      country: exampleCountryData.country,
    }),
    reply_markup: getI18nKeyboard(ctx.dbuser.language, 'cancel'),
  })
}

export async function handleMethodTo(ctx: Context, msg: Message) {
  ctx.dbuser.step = 'select_currency'
  await ctx.dbuser.save()

  const order = await findLastAddedOrder(ctx.dbuser)
  if (order) {
    order!.methodTo = ctx.msg?.text
    await order.save()
  }

  return ctx.replyWithLocalization('currency', {
    ...sendOptions(ctx),
    reply_markup: getI18nKeyboard(ctx.dbuser.language, 'currencies'),
  })
}
