import { STATUS, deleteOrder, findLastAddedOrder } from '@/models/OrderProc'
import { getI18nKeyboard } from '@/helpers/bot'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export default async function (ctx: Context) {
  ctx.dbuser.step = 'start'
  ctx.dbuser.currentOrdersRequest = []
  ctx.dbuser.currentOrderIndex = 0
  await ctx.dbuser.save()
  const order = await findLastAddedOrder(ctx.dbuser)
  order!.status = STATUS.CANCEL
  await order!.save()
  return ctx.replyWithLocalization('cancel_selected', {
    ...sendOptions(ctx),
    reply_markup: getI18nKeyboard(ctx.dbuser.language, 'main'),
  })
}
