import { TCurrency, TPaymentSystemPairs } from '@/helpers/types'
import { TPaymentSystem } from '@/helpers/types'
import { fetchCurrency, fetchPaymentSystem } from '@/helpers/fetch'
import Context from '@/models/Context'

export async function setPaymentSystemFrom(ctx: Context, order: any) {
  const currencyData: TCurrency[] = await fetchCurrency()
  const paymentSystemData: TPaymentSystem[] = await fetchPaymentSystem()

  const currencyFromData = currencyData.find(
    (currency: any) => currency.code === order.currencyFrom
  )
  if (!currencyFromData) {
    console.error('Currency from order not found in the currency list')
    return
  }

  const countryPriority = order.countryFrom

  const availablePaymentSystems: TPaymentSystem[] = paymentSystemData.filter(
    (paymentSystem: any) =>
      paymentSystem.currency_id_list.includes(currencyFromData.id) &&
      (paymentSystem.country_priority?.[countryPriority] === 100 ||
        paymentSystem.global_default_priority === 100)
  )

  order.currentAvailableFromPaymentSystem = availablePaymentSystems
  order.currencyFromID = currencyFromData.id
  await order.save()
}

export async function setPaymentSystemTo(ctx: Context, order: any) {
  const currencyData: TCurrency[] = await fetchCurrency()
  const paymentSystemData: TPaymentSystem[] = await fetchPaymentSystem()

  const currencyToData = currencyData.find(
    (currency: any) => currency.code === order.currencyTo
  )

  if (!currencyToData) {
    console.error('Currency from order not found in the currency list')
    return
  }

  const countryPriority = order.countryTo

  const availablePaymentSystems: TPaymentSystem[] = paymentSystemData.filter(
    (paymentSystem: any) =>
      paymentSystem.currency_id_list.includes(currencyToData.id) &&
      (paymentSystem.country_priority?.[countryPriority] === 100 ||
        paymentSystem.global_default_priority === 100)
  )

  order.currentAvailableToPaymentSystem = availablePaymentSystems
  order.currencyToID = currencyToData.id
  await order.save()
}
