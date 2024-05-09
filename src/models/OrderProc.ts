import { Order } from '@/models/Order'
import { User } from '@/models/User'
import { getModelForClass } from '@typegoose/typegoose'

export const OrderModel = getModelForClass(Order)

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

export async function deleteOrder(ordere: Order) {
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
    ready: true,
  })
}

export async function findOrderById(orderId: any) {
  return await OrderModel.findById(orderId).exec()
}

export async function getOrdersByUser(user: User) {
  return await OrderModel.find({
    user: user,
    ready: true,
  })
}
