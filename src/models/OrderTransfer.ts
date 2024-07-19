import { Ref, Severity, modelOptions, prop } from '@typegoose/typegoose'
import { TPaymentSystem } from '@/helpers/types'
import { User } from '@/models/User'

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
// eslint-disable-next-line import/prefer-default-export
export class OrderTransfer {
  @prop({ index: true, ref: () => User })
  public user?: Ref<User>
  @prop({ required: true })
  id!: number

  @prop()
  countryFrom!: string
  @prop()
  currencyFrom!: string
  @prop()
  currencyFromID!: number

  @prop()
  countryTo!: string
  @prop()
  currencyTo!: string
  @prop()
  currencyToID!: number

  @prop()
  amount!: number
  @prop({ default: 'progress' })
  status!: string

  @prop({ required: true, default: [], type: () => [Number] })
  currentSelectFromPaymentSystemIDS!: number[]

  @prop({ required: true, default: [], type: () => [String] })
  currentSelectFromPaymentSystemNames!: string[]

  @prop({ required: true, default: [], type: () => [Object] })
  currentAvailableFromPaymentSystem!: TPaymentSystem[]

  @prop({ required: true, default: [], type: () => [Number] })
  currentSelectToPaymentSystemIDS!: number[]

  @prop({ required: true, default: [], type: () => [String] })
  currentSelectToPaymentSystemNames!: string[]

  @prop({ required: true, default: [], type: () => [Object] })
  currentAvailableToPaymentSystem!: TPaymentSystem[]
}
