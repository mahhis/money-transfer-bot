import { Ref, modelOptions, prop } from '@typegoose/typegoose'
import { User } from '@/models/User'

@modelOptions({ schemaOptions: { timestamps: true } })
// eslint-disable-next-line import/prefer-default-export
export class Order {
  @prop({ index: true, ref: () => User })
  public user?: Ref<User>
  @prop({ required: true })
  id!: number

  @prop()
  countryFrom?: string
  @prop()
  methodFrom?: string

  @prop()
  countryTo?: string
  @prop()
  methodTo?: string

  @prop()
  currency?: string
  @prop()
  amount?: number
  @prop()
  contact?: string
  @prop({ default: 'progress' })
  status?: string

  @prop()
  message?: string
}
