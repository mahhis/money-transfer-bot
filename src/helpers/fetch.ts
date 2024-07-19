import {
  Country,
  Offer,
  OrderData,
  TCurrency,
  TExchangePlatform,
} from '@/helpers/types'
import { TPaymentSystem } from '@/helpers/types'
import {
  countries_monetoryDOTio,
  currency_monetoryDOTio,
  link_to_order,
  payment_system_monetoryDOTio,
  search_by_currencies,
  source_types,
} from '@/helpers/api'
import fetch from 'node-fetch'

export async function fetchCurrency() {
  const currencyResponse = await fetch(currency_monetoryDOTio)
  if (!currencyResponse.ok) {
    throw new Error('Failed to fetch currency')
  }
  const currencyData: TCurrency[] = await currencyResponse.json()

  return currencyData
}

export async function fetchCountries() {
  const countriesResponse = await fetch(countries_monetoryDOTio)

  if (!countriesResponse.ok) {
    throw new Error('Failed to fetch countries')
  }
  const countriesData: Country[] = await countriesResponse.json()

  return countriesData
}

export async function fetchPaymentSystem() {
  const paymentSystemResponse = await fetch(payment_system_monetoryDOTio)

  if (!paymentSystemResponse.ok) {
    throw new Error('Failed to fetch payment system')
  }
  const paymentSystemData: TPaymentSystem[] = await paymentSystemResponse.json()

  return paymentSystemData
}

export async function fetchSourceType() {
  const sourceTypesResponse = await fetch(source_types)

  if (!sourceTypesResponse.ok) {
    throw new Error('Failed to fetch source type')
  }
  const sourceTypesData: TExchangePlatform[] = await sourceTypesResponse.json()

  return sourceTypesData
}

export async function fetchOrders(
  currencyFromID: number | undefined,
  currencyToID: number | undefined,
  amount: number | undefined,
  paymentSystemsIDS: number[] | undefined,
  type: string
) {
  const fromFilter = paymentSystemsIDS!.map((id) => [id, null, null])

  const fromFilterString = JSON.stringify(fromFilter)

  const encodedFromFilter = encodeURIComponent(fromFilterString)

  const url = `${search_by_currencies}?from=${currencyFromID}&to=${currencyToID}&request_id=08de93c6d51040bdb88bda924712a50f&only_wo_tags=true&country_code=RU&fmax=%5B%22${amount}%22%2C${currencyFromID}%5D&${type}_filter=${encodedFromFilter}`

  const ordersResponse = await fetch(url)

  if (!ordersResponse.ok) {
    console.log(ordersResponse)
  }
  const ordersData: OrderData = await ordersResponse.json()

  const orders: Offer[] = ordersData.offers.flat()

  return orders
}

// export async function fetchPaymentSystemByID(ps1: number) {
//   const paymentSystemResponse = await fetch(payment_system_monetoryDOTio)

//   if (!paymentSystemResponse.ok) {
//     throw new Error('Failed to fetch payment system')
//   }
//   const paymentSystemData: TPaymentSystem[] = await paymentSystemResponse.json()

//   const res = paymentSystemData.find((ps: any) => ps.id === ps1)

//   console.log(res)
// }

export async function fetchLinkToOrder(search_id: string) {
  const url = `${link_to_order}?search_id=${search_id}&country_code=PL&locale=ru-RU`
  const linkResponse = await fetch(url)

  if (!linkResponse.ok) {
    throw new Error('Failed to fetch source type')
  }

  const linkData: { referral_link: string } = await linkResponse.json()

  return linkData.referral_link
}
