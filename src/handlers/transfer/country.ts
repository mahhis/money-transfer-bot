import { type Message } from '@grammyjs/types'

import { Country } from '@/helpers/types'
import {
  createFromPaymentSystemsMenu,
  createToPaymentSystemsMenu,
} from '@/menus/inline/paymentSystems'
import { fetchCountries } from '@/helpers/fetch'
import { findLastAddedOrder } from '@/models/OrderTransferProc'
import { flagCountryMap } from '@/helpers/defaultValue'
import getI18nKeyboard from '@/menus/custom/default'

import {
  setPaymentSystemFrom,
  setPaymentSystemTo,
} from '@/helpers/setPaymentSystem'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export async function handleTransferFrom(ctx: Context, msg: Message) {
  const flagKey = msg.text as keyof typeof flagCountryMap
  if (
    flagKey &&
    Object.prototype.propertyIsEnumerable.call(flagCountryMap, flagKey)
  ) {
    const country = flagCountryMap[flagKey].code

    const countryData: Country[] = await fetchCountries()

    const countryInData = countryData.find(
      (countryObj) => countryObj.code === country
    )

    if (countryInData) {
      const currency = countryInData?.official_currency

      ctx.dbuser.step = 'enter_payment_system_from'
      await ctx.dbuser.save()
      const order = await findLastAddedOrder(ctx.dbuser)
      if (order) {
        order.countryFrom = country
        order.currencyFrom = currency
        await order.save()
      }
      await setPaymentSystemFrom(ctx, order)

      const paymentSystemsMenu = createFromPaymentSystemsMenu(order, ctx)

      await ctx.replyWithLocalization('finish', {
        ...sendOptions(ctx),
        reply_markup: getI18nKeyboard(ctx.dbuser.language, 'finish'),
      })

      return ctx.replyWithLocalization('payment_system_from', {
        ...sendOptions(ctx),
        reply_markup: paymentSystemsMenu,
      })
    } else {
      await ctx.replyWithLocalization('not_fi', {
        ...sendOptions(ctx),
        reply_markup: getI18nKeyboard(ctx.dbuser.language, 'cancel'),
      })
    }
  }
}

export async function handleTransferTo(ctx: Context, msg: Message) {
  const flagKey = msg.text as keyof typeof flagCountryMap
  if (
    flagKey &&
    Object.prototype.propertyIsEnumerable.call(flagCountryMap, flagKey)
  ) {
    const country = flagCountryMap[flagKey].code

    const countryData: Country[] = await fetchCountries()

    const countryInData = countryData.find(
      (countryObj) => countryObj.code === country
    )

    if (countryInData) {
      const currency = countryInData?.official_currency

      ctx.dbuser.step = 'enter_payment_system_to'
      await ctx.dbuser.save()
      const order = await findLastAddedOrder(ctx.dbuser)
      if (order) {
        order.countryTo = country
        order.currencyTo = currency
        await order.save()
      }
      await setPaymentSystemTo(ctx, order)

      const paymentSystemsMenu = createToPaymentSystemsMenu(order, ctx)

      await ctx.replyWithLocalization('finish', {
        ...sendOptions(ctx),
        reply_markup: getI18nKeyboard(ctx.dbuser.language, 'finish'),
      })

      return ctx.replyWithLocalization('payment_system_to', {
        ...sendOptions(ctx),
        reply_markup: paymentSystemsMenu,
      })
    } else {
      await ctx.replyWithLocalization('not_fi', {
        ...sendOptions(ctx),
        reply_markup: getI18nKeyboard(ctx.dbuser.language, 'cancel'),
      })
    }
  }
}
