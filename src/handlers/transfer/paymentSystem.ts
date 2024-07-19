import { findLastAddedOrder } from '@/models/OrderTransferProc'
import getI18nKeyboard from '@/menus/custom/default'

import { TPairOffers } from '@/helpers/types'
import { createSelectOrderTransferSelectionMenu } from '@/menus/inline/showTransferOrders'
import { fetchLinkToOrder } from '@/helpers/fetch'
import Context from '@/models/Context'
import getBestPairs from '@/helpers/getBestPairs'
import sendOptions from '@/helpers/sendOptions'

export async function handleFromFinishPaymentSystem(ctx: Context) {
  ctx.dbuser.step = 'enter_amount_transfer'
  await ctx.dbuser.save()
  const order = await findLastAddedOrder(ctx.dbuser)
  order!.currentAvailableFromPaymentSystem = []
  await order?.save()

  return ctx.replyWithLocalization('amount_transfer', {
    ...sendOptions(ctx, {
      currency: order!.currencyFrom,
    }),
    reply_markup: getI18nKeyboard(ctx.dbuser.language, 'cancel'),
  })
}

export async function handleToFinishPaymentSystem(ctx: Context) {
  const order = await findLastAddedOrder(ctx.dbuser)
  order!.currentAvailableToPaymentSystem = []
  await order?.save()
  const pairOffers: TPairOffers[] = await getBestPairs(order)

  ctx.dbuser.step = 'select_offers'
  ctx.dbuser.currentTransferOrdersRequest = pairOffers
  ctx.dbuser.currentOrderIndex = 0
  await ctx.dbuser.save()

  const index = 0

  const menu = createSelectOrderTransferSelectionMenu(
    ctx,
    ctx.dbuser.currentOrderIndex!,
    pairOffers.length
  )

  const dataForMessage = await preparationMessage(pairOffers, index, order)
  return await ctx.replyWithLocalization('offer_for_trnafer', {
    ...sendOptions(ctx, dataForMessage),
    reply_markup: menu,
  })
}

export async function preparationMessage(
  pairOffers: TPairOffers[],
  index: number,
  order: any
) {
  const platformForBuy = pairOffers[index].platformFees.platformForBuy
  const linkFrom = await fetchLinkToOrder(pairOffers[index].fromOffer.search_id)
  const nameSeller = pairOffers[index].fromOffer.title
  const protocol = pairOffers[index].fromOffer.payment_method_to.protocol

  const notRoundedexchangeRateBuy =
    1 / pairOffers[index].fromOffer.exchange_rate
  const exchangeRateBuy = Math.floor(notRoundedexchangeRateBuy * 1000) / 1000

  const platformForSale = pairOffers[index].platformFees.platformForSell
  const fees = pairOffers[index].platformFees.fees

  const linkTo = await fetchLinkToOrder(pairOffers[index].toOffer.search_id)

  const nameBuyer = pairOffers[index].toOffer.title

  const exchangeRateSell = pairOffers[index].toOffer.exchange_rate

  const sumBuy = order!.amount / exchangeRateBuy - fees
  const notRoundedSumSell = sumBuy * exchangeRateSell
  const sum = Math.floor(notRoundedSumSell * 1000) / 1000

  const res = {
    amount: order.amount,
    index: index + 1,
    length: pairOffers.length,
    platformForBuy: platformForBuy,
    linkFrom: linkFrom,
    nameSeller: nameSeller,
    currencyBuy: order!.currencyFrom,
    protocol: protocol,
    exchangeRateBuy: exchangeRateBuy,
    platformForSale: platformForSale,
    fees: fees,
    linkTo: linkTo,
    nameBuyer: nameBuyer,
    currencySell: order!.currencyTo,
    exchangeRateSell: exchangeRateSell,
    sum: sum.toFixed(2),
  }

  return res
}

/*

offer_for_trnafer: |
 <a href="${data.linkFrom}">Покупаете</a> 
 Ник продовца: ${data.nameSeller}
 Сеть: ${data.protocol}
 Курс за 1 USDT: ${data.exchangeRateBuy}

 Переводите на ${data.platformForSale}
 Комиссия сети + биржи за вывод: ${data.fees}

 <a href="${data.linkTo}">Продаете</a> 
 Ник покупателя: ${data.nameBuyer}
 Сеть: ${data.protocol}
 Курс за 1 USDT: ${data.exchangeRateSell}

 Финальная сумма: ${data.sum}


*/

/*
BESTCHANGE,
HODLHODL,
BINANCE,
SIGEN,
OKEX,
HUOBI,
BYBIT, 
GARANTEX, 
BITPAPA, 
GATE_IO, 
EMCD, 
POLONIEX, 
MEXC, 
TG_WALLET.
 */

/*
BYBIT      - BEP20:  min - 10,  fee 1.3
           - TRC20:  min - 2.6, fee 1.3
BINANCE    - BEP20:  min - 5,   fee 0.33
           - TRC20:  min - 4,   fee 1
SIGEN      - BEP20:  min - 10,  fee 3
           - TRC20:  do not support
OKEX       - BEP20:  do not support
           - TRC20:  min - 3,   fee 1
HUOBI      - BEP20:  do not support
           - TRC20:  min - 2,   fee 1 
GARANTEX   - BEP20:  min - 1,   fee 1 
           - TRC20:  min - 0.5, fee 2.5
BITPAPA    - BEP20:  do not support 
           - TRC20:  min - 2,   fee 1
GATE_IO    - BEP20:  min - 1.5, fee 0.5  
           - TRC20:  min - 2,   fee 1
EMCD       - BEP20:  min - 1,   fee 1  
           - TRC20:  min - 1,   fee 1
POLONIEX   - BEP20:  do not support   
           - TRC20:  min - 3,   fee 2
MEXC       - BEP20:  min - 1.1, fee 0.5   
           - TRC20:  min - 3,   fee 1
TG_WALLET  - BEP20:  do not support   
           - TRC20:  min - 1,   fee 2                                                                                                                       
HODLHODL   - only Bitcoin





*/
