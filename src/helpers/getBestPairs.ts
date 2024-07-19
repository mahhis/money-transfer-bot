import {
  BeAnObject,
  IObjectWithTypegooseFunction,
} from '@typegoose/typegoose/lib/types'
import { Document, Types } from 'mongoose'
import {
  Offer,
  Protocol,
  TExchangePlatform,
  TPairOffers,
} from '@/helpers/types'
import { OrderTransfer } from '@/models/OrderTransfer'
import { exchangePlatformFees } from '@/helpers/defaultValue'
import { fetchOrders, fetchSourceType } from '@/helpers/fetch'

export default async function getBestPairs(
  order:
    | (Document<any, BeAnObject, OrderTransfer> &
        OrderTransfer &
        IObjectWithTypegooseFunction & { _id: Types.ObjectId })
    | null
): Promise<TPairOffers[]> {
  const sourceTypes: TExchangePlatform[] = await fetchSourceType()
  let fromOffer: Offer[] = []
  let toOffer: Offer[] = []

  if (order) {
    fromOffer = await fetchOrders(
      order?.currencyFromID,
      204,
      order?.amount,
      order?.currentSelectFromPaymentSystemIDS,
      'from'
    )
    const upperLimitAmount = fromOffer[0].exchange_rate * order.amount

    toOffer = await fetchOrders(
      204,
      order?.currencyToID,
      upperLimitAmount,
      order?.currentSelectToPaymentSystemIDS,
      'to'
    )
  }
  const pairOffers: TPairOffers[] = []
  const bestMatchingPairs: { fromOffer: Offer; toOffer: Offer }[] =
    findBestMatchingPairs(fromOffer, toOffer)

  for (let i = 0; i < bestMatchingPairs.length && i < 10; i++) {
    const tempOffer = {
      fromOffer: bestMatchingPairs[i].fromOffer,
      toOffer: bestMatchingPairs[i].toOffer,
      platformFees: getFees(sourceTypes, bestMatchingPairs[i]),
    }
    pairOffers.push(tempOffer)
  }

  return pairOffers
}

function findBestMatchingPairs(
  fromOffers: Offer[],
  toOffers: Offer[]
): { fromOffer: Offer; toOffer: Offer }[] {
  const matchingPairs: { fromOffer: Offer; toOffer: Offer }[] = []

  const uniqueFromOffers = new Set<string>()
  const uniqueToOffers = new Set<string>()

  for (const fromOffer of fromOffers) {
    for (const toOffer of toOffers) {
      if (
        fromOffer.payment_method_to.protocol ===
          toOffer.payment_method_from.protocol &&
        (fromOffer.payment_method_to.protocol == 'trc20' ||
          fromOffer.payment_method_to.protocol == 'bep20')
      ) {
        const fromOfferId = `${fromOffer.title}-${fromOffer.payment_method_to.protocol}-${fromOffer.source_id}-${fromOffer.source_type_id}-${fromOffer.exchange_rate}`
        const toOfferId = `${toOffer.title}-${toOffer.payment_method_from.protocol}-${toOffer.source_id}-${toOffer.source_type_id}-${toOffer.exchange_rate}`

        if (
          !uniqueFromOffers.has(fromOfferId) &&
          !uniqueToOffers.has(toOfferId)
        ) {
          matchingPairs.push({ fromOffer, toOffer })
          uniqueFromOffers.add(fromOfferId)
          uniqueToOffers.add(toOfferId)
        }
      }
    }
  }

  return matchingPairs.sort(
    (a, b) =>
      b.fromOffer.profit +
      b.toOffer.profit -
      (a.fromOffer.profit + a.toOffer.profit)
  )
}

function getFees(
  sourceTypes: TExchangePlatform[],
  bestMatchingPairs: { fromOffer: Offer; toOffer: Offer }
): { fees: number; platformForBuy: string; platformForSell: string } {
  const sourceTypeFrom: TExchangePlatform | undefined = sourceTypes.find(
    (sourceType: TExchangePlatform) =>
      sourceType.id === bestMatchingPairs.fromOffer.source_type_id
  )

  const sourceTypeTo: TExchangePlatform | undefined = sourceTypes.find(
    (sourceType: TExchangePlatform) =>
      sourceType.id === bestMatchingPairs.toOffer.source_type_id
  )

  if (sourceTypeFrom?.id == sourceTypeTo?.id) {
    return {
      fees: 0,
      platformForBuy: sourceTypeFrom!.name,
      platformForSell: sourceTypeTo!.name,
    }
  } else {
    const feesByProtocol =
      exchangePlatformFees[
        sourceTypeFrom!.name as keyof typeof exchangePlatformFees
      ]
    const protocol = bestMatchingPairs.fromOffer.payment_method_to
      .protocol as Protocol

    if (feesByProtocol && protocol in feesByProtocol) {
      const fee: { min: number; fee: number } | null =
        feesByProtocol[protocol as keyof typeof feesByProtocol]
      if (fee) {
        return {
          fees: fee.fee,
          platformForBuy: sourceTypeFrom!.name,
          platformForSell: sourceTypeTo!.name,
        }
      }
    }
  }
  return {
    fees: 0,
    platformForBuy: sourceTypeFrom!.name,
    platformForSell: sourceTypeTo!.name,
  }
}
