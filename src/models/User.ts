import { Order } from '@/models/Order'
import { Ref, Severity, modelOptions, prop } from '@typegoose/typegoose'
import { TPairOffers } from '@/helpers/types'

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
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
  @prop()
  currentTransferOrdersRequest?: TPairOffers[]
  @prop({ default: 0 })
  currentOrderIndex?: number
  @prop({ required: true, default: 'ADDED' }) // NOT, WAITING, ADDED
  inWaitList!: string
}
