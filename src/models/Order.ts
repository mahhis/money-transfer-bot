import { Ref, modelOptions, prop } from '@typegoose/typegoose'
import { User } from '@/models/User'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Order {
  @prop({ index: true, ref: () => User })
  public user?: Ref<User>
  @prop({ required: true })
  id!: number
  @prop()
  countryFrom?: string
  @prop()
  countryTo?: string
  @prop()
  currency?: string
  @prop()
  amount?: number
  @prop()
  contact?: string
  @prop({ default: false })
  ready?: boolean
}
