import getI18nKeyboard from '@/menus/custom/default'

import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export default async function handleStartTinder(ctx: Context) {
  ctx.dbuser.step = 'tinder'
  await ctx.dbuser.save()
  return ctx.replyWithLocalization('start_tinder', {
    ...sendOptions(ctx),
    reply_markup: getI18nKeyboard(ctx.dbuser.language, 'tinder'),
  })
}
