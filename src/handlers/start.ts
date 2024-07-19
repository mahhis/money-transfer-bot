import getI18nKeyboard from '@/menus/custom/default'

import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export default async function handleStart(ctx: Context) {
  ctx.dbuser.step = 'start'
  await ctx.dbuser.save()
  return ctx.replyWithLocalization('start', {
    ...sendOptions(ctx),
    reply_markup: getI18nKeyboard(ctx.dbuser.language, 'start'),
  })
}
