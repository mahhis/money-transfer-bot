import { Order } from '@/models/Order'
import { Ref, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
  @prop({ required: true, index: true, unique: true })
  id!: number
  @prop({})
  username?: string
  @prop({ required: true, default: 'ru' })
  language!: string
  @prop({ required: true, default: 'start' })
  step!: string
  @prop({ ref: () => Order })
  currentOrdersRequest?: Ref<Order>[]
  @prop({ default: 0 })
  currentOrderIndex?: number
}
