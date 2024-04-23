import Context from '@/models/Context'
import languageMenu from '@/menus/language'
import sendOptions from '@/helpers/sendOptions'
import { getI18nKeyboard } from '@/helpers/bot'

export default async function handleLanguage(ctx: Context) {
  ctx.dbuser.step = 'start'
  await ctx.dbuser.save()
  return ctx.replyWithLocalization('language', {
    ...sendOptions(ctx),
    reply_markup: languageMenu,
  })
}
