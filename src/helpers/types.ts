export type TCurrency = {
  id: number
  code: string
  name: string
  subtype: string
  type: string
  priority: number
  localization: { [key: string]: string }
}

export type Protocol = 'bep20' | 'trc20'

export type TExchangePlatform = {
  id: number
  name: string
  is_visible: boolean
}

export type Localization = {
  [key: string]: string
}
export type TPaymentSystemPairs = {
  payment_system_from_id: number
  currency_from_id: number
  payment_system_to_id: number
  currency_to_id: number
}

export type TPaymentSystem = {
  currency_id_list: number[]
  id: number
  name: string
  global_default_priority: number | null
  group_name: string | null
  subtype_name_list: string[]
  type_name_list: string[]
  country_priority: { [key: string]: number }
  search_alias_list: string[]
  localization: Localization
}

export type Country = {
  code: string
  code_alpha3: string
  localization: Localization
  official_currency: string
}

export type PaymentMethod = {
  payment_system_id: number
  currency_id: number
  city_id: number | null
  protocol: string | null
}

export type Offer = {
  min: number
  max: number
  reserve: number
  exchange_rate: number
  profit: number
  payment_method_from: PaymentMethod
  payment_method_to: PaymentMethod
  search_id: string
  tag_list: any[]
  commission_list: any[]
  additional_data: any
  source_id: number
  title: string
  source_type_id: number
}

export type RequestParameters = {
  from_currency_id: number
  to_currency_id: number
  request_type: string
  country_code: string
  query_fields: {
    only_wo_tags: boolean
    fmin: [number, number]
    from_filter: [number, number | null, number | null][]
  }
}

export type PaginationData = {
  page: number
  pages_total: number
  limit: number
  offset: number
}

export type OrderData = {
  offers: Offer[][]
  request_id: string
  pure_result_count: number
  pure_group_count: number
  filtered_result_count: number
  filtered_group_count: number
  request_parameters: RequestParameters
  pagination_data: PaginationData
  message_ru: string
  message_en: string
}

export type TPairOffers = {
  fromOffer: Offer
  toOffer: Offer
  platformFees: {
    fees: number
    platformForBuy: string
    platformForSell: string
  }
}
