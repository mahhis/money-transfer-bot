import { flagCountryMap } from '@/helpers/defaultValue'
import getI18nKeyboard from '@/menus/custom/default'

import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export async function handleStartTransfer(ctx: Context) {
  if (ctx.dbuser.inWaitList == 'NOT') {
    ctx.dbuser.step = 'waiting_list'
    await ctx.dbuser.save()
    return ctx.replyWithLocalization('not_yet_on_waiting_list', {
      ...sendOptions(ctx),
      reply_markup: getI18nKeyboard(ctx.dbuser.language, 'waiting_list'),
    })
  }
  if (ctx.dbuser.inWaitList == 'WAITING') {
    return ctx.replyWithLocalization('already_on_waiting_list', {
      ...sendOptions(ctx),
      reply_markup: getI18nKeyboard(ctx.dbuser.language, 'start'),
    })
  }
  if (ctx.dbuser.inWaitList == 'ADDED') {
    ctx.dbuser.step = 'transfer'
    await ctx.dbuser.save()
    //const exampleCountryData = getRandomFlagObject()
    return ctx.replyWithLocalization('start_transfer', {
      ...sendOptions(ctx),
      reply_markup: getI18nKeyboard(ctx.dbuser.language, 'transfer'),
    })
  }
}
export type FlagCountryMap = typeof flagCountryMap
export type FlagCountryMapKey = keyof FlagCountryMap
