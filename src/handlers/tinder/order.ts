import { call } from '@/models/OrderCounter'
import { createSelectionMenu } from '@/menus/inline/selection'
import { createSelectionMenuForUser } from '@/menus/inline/showUserOrders'
import {
  findLastAddedOrder,
  getOrders,
  getOrdersByUser,
} from '@/models/OrderProc'
import { findOrCreateOrder } from '@/models/OrderProc'
import getI18nKeyboard from '@/menus/custom/default'

import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export async function handleOtherOrders(ctx: Context) {
  ctx.dbuser.step = 'select_country_from'
  await ctx.dbuser.save()
  await findOrCreateOrder(ctx.dbuser, (await call()).seq)

  await ctx.replyWithLocalization('setup_filters', {
    ...sendOptions(ctx),
    reply_markup: undefined,
  })

  return await ctx.replyWithLocalization('from', {
    ...sendOptions(ctx),
    reply_markup: getI18nKeyboard(ctx.dbuser.language, 'countries'),
  })
}

export async function sendOrders(ctx: Context) {
  const order = await findLastAddedOrder(ctx.dbuser)

  const orders = await getOrders(
    ctx.dbuser,
    order!.countryFrom,
    order!.countryTo
  )

  if (orders.length != 0) {
    ctx.dbuser.step = 'check_order'
    ctx.dbuser.currentOrdersRequest = orders
    await ctx.dbuser.save()

    await ctx.replyWithLocalization('if_post_order', {
      ...sendOptions(ctx),
      reply_markup: getI18nKeyboard(ctx.dbuser.language, 'post'),
    })

    return await ctx.replyWithLocalization('select_order', {
      ...sendOptions(ctx, {
        current: ctx.dbuser.currentOrderIndex! + 1,
        all: ctx.dbuser.currentOrdersRequest!.length,
        id: orders[0].id,
        from: orders[0].countryFrom,
        methodFrom: orders[0].methodFrom,
        to: orders[0].countryTo,
        methodTo: orders[0].methodTo,
        amount: orders[0].amount,
        currency: orders[0].currency,
        contact: orders[0].contact,
      }),
      reply_markup: createSelectionMenu(
        ctx,
        0,
        ctx.dbuser.currentOrdersRequest!.length
      ),
    })
  } else {
    await ctx.replyWithLocalization('no_orders', {
      ...sendOptions(ctx),
      reply_markup: undefined,
    })
    return await ctx.replyWithLocalization('order', {
      ...sendOptions(ctx, {
        id: order!.id,
        from: order!.countryFrom,
        methodFrom: order!.methodFrom,
        to: order!.countryTo,
        methodTo: order!.methodTo,
        amount: order!.amount,
        currency: order!.currency,
        contact: order!.contact,
      }),
      reply_markup: getI18nKeyboard(ctx.dbuser.language, 'post'),
    })
  }
}

export async function sendUserOrders(ctx: Context) {
  const orders = await getOrdersByUser(ctx.dbuser)

  if (orders.length == 0) {
    return await ctx.replyWithLocalization('not_orders_yet', {
      ...sendOptions(ctx),
      reply_markup: getI18nKeyboard(ctx.dbuser.language, 'tinder'),
    })
  } else {
    ctx.dbuser.currentOrdersRequest = orders
    ctx.dbuser.currentOrderIndex = 0
    await ctx.dbuser.save()
    return await ctx.replyWithLocalization('select_order', {
      ...sendOptions(ctx, {
        current: ctx.dbuser.currentOrderIndex! + 1,
        all: ctx.dbuser.currentOrdersRequest!.length,
        id: orders[0].id,
        from: orders[0].countryFrom,
        methodFrom: orders[0].methodFrom,
        to: orders[0].countryTo,
        methodTo: orders[0].methodTo,
        amount: orders[0].amount,
        currency: orders[0].currency,
        contact: orders[0].contact,
      }),
      reply_markup: createSelectionMenuForUser(
        ctx,
        0,
        ctx.dbuser.currentOrdersRequest!.length
      ),
    })
  }
}
