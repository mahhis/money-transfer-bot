import { getI18nKeyboard } from '@/helpers/bot'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export default async function handleStartTransfer(ctx: Context) {
  ctx.dbuser.step = 'transfer'
  await ctx.dbuser.save()
  return ctx.replyWithLocalization('start_transfer', {
    ...sendOptions(ctx),
    reply_markup: getI18nKeyboard(ctx.dbuser.language, 'transfer'),
  })
}
