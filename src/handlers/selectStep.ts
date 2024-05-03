import { type Message } from '@grammyjs/types'
import {
  handleAnotherWayToContact,
  handleCheckNick,
  handleEnterContact,
} from '@/handlers/contact'
import { handleCountry, handleCountryTo } from '@/handlers/country'
import { sendUserOrders } from '@/handlers/orders'
import Context from '@/models/Context'
import handleAmount from '@/handlers/amount'
import handleCancel from '@/handlers/cancel'
import handleCurrency from '@/handlers/currency'
import handlePostOrder from '@/handlers/post'
import handleSendMoney from '@/handlers/sendMoney'
import i18n from '@/helpers/i18n'
import sendOptions from '@/helpers/sendOptions'

export default async function selectStep(ctx: Context) {
  const message = ctx.msg!

  if (isCancel(ctx, message) && ctx.dbuser.step !== 'start') {
    return handleCancel(ctx)
  }

  switch (ctx.dbuser.step) {
    case 'start':
      if (isSendMoney(ctx, message)) {
        return await handleSendMoney(ctx)
      } else if (isMyOrders(ctx, message)) {
        return await sendUserOrders(ctx)
      } else {
        return await ctx.replyWithLocalization('bad_start', sendOptions(ctx))
      }

    case 'select_country_from':
      if (isCountry(ctx, message)) {
        return await handleCountryTo(ctx, message)
      } else {
        return await ctx.replyWithLocalization('bad_country', sendOptions(ctx))
      }
    case 'select_country_to':
      if (isCountry(ctx, message)) {
        return await handleCountry(ctx, message)
      } else {
        return await ctx.replyWithLocalization('bad_country', sendOptions(ctx))
      }
    case 'select_currency':
      if (isCurrency(ctx, message)) {
        return await handleCurrency(ctx, message)
      } else {
        return await ctx.replyWithLocalization('bad_currency', sendOptions(ctx))
      }
    case 'enter_amount':
      if (isAmount(ctx, message)) {
        return await handleAmount(ctx, message)
      } else {
        return await ctx.replyWithLocalization('bad_amount', sendOptions(ctx))
      }
    case 'select_order':
      if (isAmount(ctx, message)) {
        return await handleAmount(ctx, message)
      } else {
        return await ctx.replyWithLocalization('bad_amount', sendOptions(ctx))
      }
    case 'select_contact':
      if (isCheckNick(ctx, message)) {
        return await handleCheckNick(ctx, message)
      } else if (isAnotherWayToContact(ctx, message)) {
        return await handleAnotherWayToContact(ctx, message)
      } else {
        return await ctx.replyWithLocalization('contact', sendOptions(ctx))
      }
    case 'enter_another_way_to_contact':
      return await handleEnterContact(ctx, message)
    case 'check_order':
      if (isPostOrder(ctx, message)) {
        return await handlePostOrder(ctx, message)
      } else {
        return await ctx.replyWithLocalization(
          'bad_post_order',
          sendOptions(ctx)
        )
      }
  }
}

function isCountry(ctx: Context, message: Message) {
  return (
    message.text == i18n.t(ctx.dbuser.language, 'pl') ||
    message.text == i18n.t(ctx.dbuser.language, 'by')
  )
}
function isPostOrder(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'post')
}

function isCheckNick(ctx: Context, message: Message) {
  return (
    message.text == i18n.t(ctx.dbuser.language, 'check_nick') &&
    ctx.dbuser.username != null
  )
}

function isAnotherWayToContact(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'another_way_to_contact')
}

function isCurrency(ctx: Context, message: Message) {
  return (
    message.text == i18n.t(ctx.dbuser.language, 'eur') ||
    message.text == i18n.t(ctx.dbuser.language, 'usd') ||
    message.text == i18n.t(ctx.dbuser.language, 'byn') ||
    message.text == i18n.t(ctx.dbuser.language, 'pln') ||
    message.text == i18n.t(ctx.dbuser.language, 'blnt') ||
    message.text == i18n.t(ctx.dbuser.language, 'g')
  )
}

function isCancel(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'cancel')
}
function isMyOrders(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'my_orders')
}

function isSendMoney(ctx: Context, message: Message) {
  return message.text == i18n.t(ctx.dbuser.language, 'send')
}
function isAmount(ctx: Context, message: Message) {
  const amount = parseFloat(message.text!)
  return !isNaN(amount) && amount > 1 && amount < 10000
}
