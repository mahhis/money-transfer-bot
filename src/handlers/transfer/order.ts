import { call } from '@/models/OrderCounter'
import {
  findOrCreateOrder,
  getRandomFlagObject,
} from '@/models/OrderTransferProc'
import getI18nKeyboard from '@/menus/custom/default'

import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export default async function handleSendMoney(ctx: Context) {
  ctx.dbuser.step = 'enter_country_from_transfer'
  await findOrCreateOrder(ctx.dbuser, (await call()).seq)
  await ctx.dbuser.save()

  const exampleCountryData = getRandomFlagObject()

  return ctx.replyWithLocalization('send_flag_from', {
    ...sendOptions(ctx, {
      flag: exampleCountryData.flag,
      country: exampleCountryData.country,
    }),
    reply_markup: getI18nKeyboard(ctx.dbuser.language, 'cancel'),
  })
}
