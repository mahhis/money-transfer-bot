import { type Message } from '@grammyjs/types'
import {
  findLastAddedOrder,
  getRandomFlagObject,
} from '@/models/OrderTransferProc'
import getI18nKeyboard from '@/menus/custom/default'

import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export default async function handleAmountTransfer(ctx: Context, msg: Message) {
  ctx.dbuser.step = 'enter_country_to_transfer'
  await ctx.dbuser.save()
  const order = await findLastAddedOrder(ctx.dbuser)
  if (order) {
    order.amount = parseFloat(msg.text!)
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
