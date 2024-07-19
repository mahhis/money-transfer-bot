import { type Message } from '@grammyjs/types'
import { findLastAddedOrder } from '@/models/OrderProc'
import { flagCountryMap } from '@/helpers/defaultValue'

import Context from '@/models/Context'
import getI18nKeyboard from '@/menus/custom/default'
import sendOptions from '@/helpers/sendOptions'

export async function handleCountryFrom(ctx: Context, msg: Message) {
  const flagKey = msg.text as keyof typeof flagCountryMap
  if (
    flagKey &&
    Object.prototype.propertyIsEnumerable.call(flagCountryMap, flagKey)
  ) {
    const country = flagCountryMap[flagKey].name

    ctx.dbuser.step = 'select_method_from'
    await ctx.dbuser.save()

    const order = await findLastAddedOrder(ctx.dbuser)
    if (order) {
      const countryName = country + flagKey
      order!.countryFrom = countryName
      await order.save()
    }

    return ctx.replyWithLocalization('fromMethod', {
      ...sendOptions(ctx),
      reply_markup: getI18nKeyboard(ctx.dbuser.language, 'cancel'),
    })
  } else {
    await ctx.replyWithLocalization('not_fi', {
      ...sendOptions(ctx),
      reply_markup: getI18nKeyboard(ctx.dbuser.language, 'cancel'),
    })
  }
}

export async function handleCountryTo(ctx: Context, msg: Message) {
  const flagKey = msg.text as keyof typeof flagCountryMap
  if (
    flagKey &&
    Object.prototype.propertyIsEnumerable.call(flagCountryMap, flagKey)
  ) {
    const country = flagCountryMap[flagKey].name

    ctx.dbuser.step = 'select_method_to'
    await ctx.dbuser.save()

    const order = await findLastAddedOrder(ctx.dbuser)
    if (order) {
      const countryName = country + flagKey
      order!.countryTo = countryName
      await order.save()
    }

    return ctx.replyWithLocalization('toMethod', {
      ...sendOptions(ctx),
      reply_markup: getI18nKeyboard(ctx.dbuser.language, 'cancel'),
    })
  } else {
    await ctx.replyWithLocalization('not_fi', {
      ...sendOptions(ctx),
      reply_markup: getI18nKeyboard(ctx.dbuser.language, 'cancel'),
    })
  }
}
