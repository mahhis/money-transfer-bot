import { getI18nKeyboard } from '@/helpers/bot'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'
import { deleteOrder, findLastAddedOrder } from '@/models/OrderProc'

export default async function (ctx: Context) {
  ctx.dbuser.step = 'start'
  ctx.dbuser.currentOrdersRequest = []
  ctx.dbuser.currentOrderIndex = 0
  await ctx.dbuser.save()
  const order = await findLastAddedOrder(ctx.dbuser)
  await deleteOrder(order!)
  return ctx.replyWithLocalization('cancel_selected', {
    ...sendOptions(ctx),
    reply_markup: getI18nKeyboard(ctx.dbuser.language, 'main'),
  })
}
