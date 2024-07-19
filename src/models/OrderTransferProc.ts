import { OrderTransfer } from '@/models/OrderTransfer'
import { User } from '@/models/User'
import { flagCountryMap } from '@/helpers/defaultValue'
import { getModelForClass } from '@typegoose/typegoose'

export const OrderModel = getModelForClass(OrderTransfer)

export enum STATUS {
  ACTIVE = 'active',
  PROGRESS = 'progress',
  CANCEL = 'cancel',
  DELETE = 'delete',
}

export function findOrCreateOrder(user: User, id: number) {
  return OrderModel.findOneAndUpdate(
    { user, id },
    {},
    {
      upsert: true,
      new: true,
    }
  )
}

export async function findLastAddedOrder(user: User) {
  return await OrderModel.findOne({ user: user }).sort({
    createdAt: -1,
  })
}

export async function deleteOrder(ordere: OrderTransfer) {
  return await OrderModel.findOneAndDelete({ id: ordere.id })
}

export async function getOrders(
  user: User,
  countryFrom: string | undefined,
  countryTo: string | undefined
) {
  const tempCountry = countryFrom
  countryFrom = countryTo
  countryTo = tempCountry
  return await OrderModel.find({
    user: { $ne: user },
    countryFrom,
    countryTo,
    status: STATUS.ACTIVE,
  })
}

export async function findOrderById(orderId: any) {
  return await OrderModel.findOne({ _id: orderId })
}

export async function getOrdersByUser(user: User) {
  return await OrderModel.find({
    user: user,
    status: STATUS.ACTIVE,
  })
}

export type FlagCountryMap = typeof flagCountryMap
export type FlagCountryMapKey = keyof FlagCountryMap

export function getRandomFlagObject() {
  const keys = Object.keys(flagCountryMap) as FlagCountryMapKey[]
  const randomKey = keys[Math.floor(Math.random() * keys.length)]
  return { flag: randomKey, country: flagCountryMap[randomKey].name }
}
