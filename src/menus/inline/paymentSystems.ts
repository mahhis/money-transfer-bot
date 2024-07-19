import { InlineKeyboard } from 'grammy'
import { TPaymentSystem } from '@/helpers/types'
import { findLastAddedOrder } from '@/models/OrderTransferProc'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

const getLocaleCode = (lng: string): string => {
  const localeMap: { [key: string]: string } = {
    en: 'en-US',
    ru: 'ru-RU',
  }
  return localeMap[lng] || lng
}

function getI18nPaymentSystemsNames(
  paymentSystems: any,
  lng: string
): string[] {
  const localeCode = getLocaleCode(lng)
  return paymentSystems.map(
    (system: TPaymentSystem) => system.localization[localeCode] || system.name
  )
}

export function createFromPaymentSystemsMenu(
  order: any,
  ctx: Context
): InlineKeyboard {
  const paymentSystemNamesLocalized = getI18nPaymentSystemsNames(
    order.currentAvailableFromPaymentSystem,
    ctx.dbuser.language
  )

  const paymentSystemNames: string[] =
    order.currentAvailableFromPaymentSystem.map(
      (system: TPaymentSystem) => system.name
    )

  const paymentSystemMenu = new InlineKeyboard()
  let indexEnter = 1
  paymentSystemNamesLocalized.forEach((paymentSystem, index) => {
    paymentSystemMenu.text(paymentSystem, paymentSystemNames[index])
    if (indexEnter % 2 === 0) {
      paymentSystemMenu.row()
    }
    if (
      paymentSystem.length > 12 ||
      (paymentSystemNamesLocalized.length > index + 1 &&
        paymentSystemNamesLocalized[index + 1].length > 12)
    ) {
      paymentSystemMenu.row()
      indexEnter = 0
    }
    indexEnter++
  })
  return paymentSystemMenu
}

export async function getFromPaymentSystemsMenu(ctx: Context) {
  const order = await findLastAddedOrder(ctx.dbuser)
  const paymentSystemNamesLocalized = getI18nPaymentSystemsNames(
    order!.currentAvailableFromPaymentSystem,
    ctx.dbuser.language
  )
  const paymentSystemNames: string[] =
    order!.currentAvailableFromPaymentSystem!.map((system: any) => system.name)
  const paymentSystemMenu = new InlineKeyboard()

  const selectedPaymentSystem = ctx.callbackQuery?.data

  const paymentSystemId = getPaymentSystemIdByName(
    order!.currentAvailableFromPaymentSystem!,
    selectedPaymentSystem!
  )

  if (
    selectedPaymentSystem &&
    !order!.currentSelectFromPaymentSystemNames.includes(selectedPaymentSystem!)
  ) {
    order!.currentSelectFromPaymentSystemNames.push(selectedPaymentSystem)
    order!.currentSelectFromPaymentSystemIDS.push(paymentSystemId!)
    await order!.save()
  } else if (
    order!.currentSelectFromPaymentSystemNames.includes(selectedPaymentSystem!)
  ) {
    order!.currentSelectFromPaymentSystemNames =
      order!.currentSelectFromPaymentSystemNames.filter(
        (paymentSystem) => paymentSystem !== selectedPaymentSystem!
      )

    order!.currentSelectFromPaymentSystemIDS =
      order!.currentSelectFromPaymentSystemIDS.filter(
        (paymentSystem) => paymentSystem !== paymentSystemId!
      )
    await order!.save()
  }

  let indexEnter = 1
  paymentSystemNamesLocalized.forEach((paymentSystem, index) => {
    if (
      order!.currentSelectFromPaymentSystemNames.includes(
        paymentSystemNames[index]
      )
    ) {
      paymentSystemMenu.text('✅' + paymentSystem, paymentSystemNames[index])
    } else {
      paymentSystemMenu.text(paymentSystem, paymentSystemNames[index])
    }
    if (indexEnter % 2 === 0) {
      paymentSystemMenu.row()
    }
    if (
      paymentSystem.length > 12 ||
      (paymentSystemNamesLocalized.length > index + 1 &&
        paymentSystemNamesLocalized[index + 1].length > 12)
    ) {
      paymentSystemMenu.row()
      indexEnter = 0
    }
    indexEnter++
  })

  await ctx.editMessageText(ctx.i18n.t('payment_system_from'), {
    ...sendOptions(ctx),
    reply_markup: paymentSystemMenu,
  })
}

export function createToPaymentSystemsMenu(
  order: any,
  ctx: Context
): InlineKeyboard {
  const paymentSystemNamesLocalized = getI18nPaymentSystemsNames(
    order.currentAvailableToPaymentSystem,
    ctx.dbuser.language
  )

  const paymentSystemNames: string[] =
    order.currentAvailableToPaymentSystem.map((system: any) => system.name)

  const paymentSystemMenu = new InlineKeyboard()
  let indexEnter = 1
  paymentSystemNamesLocalized.forEach((paymentSystem, index) => {
    paymentSystemMenu.text(paymentSystem, paymentSystemNames[index])
    if (indexEnter % 2 === 0) {
      paymentSystemMenu.row()
    }
    if (
      paymentSystem.length > 12 ||
      (paymentSystemNamesLocalized.length > index + 1 &&
        paymentSystemNamesLocalized[index + 1].length > 12)
    ) {
      paymentSystemMenu.row()
      indexEnter = 0
    }
    indexEnter++
  })
  return paymentSystemMenu
}

export async function getToPaymentSystemsMenu(ctx: Context) {
  const order = await findLastAddedOrder(ctx.dbuser)
  const paymentSystemNamesLocalized = getI18nPaymentSystemsNames(
    order!.currentAvailableToPaymentSystem,
    ctx.dbuser.language
  )
  const paymentSystemNames: string[] =
    order!.currentAvailableToPaymentSystem!.map((system: any) => system.name)
  const paymentSystemMenu = new InlineKeyboard()

  const selectedPaymentSystem = ctx.callbackQuery?.data

  const paymentSystemId = getPaymentSystemIdByName(
    order!.currentAvailableToPaymentSystem!,
    selectedPaymentSystem!
  )

  if (
    selectedPaymentSystem &&
    !order!.currentSelectToPaymentSystemNames.includes(selectedPaymentSystem!)
  ) {
    order!.currentSelectToPaymentSystemNames.push(selectedPaymentSystem)
    order!.currentSelectToPaymentSystemIDS.push(paymentSystemId!)

    await order!.save()
  } else if (
    order!.currentSelectToPaymentSystemNames.includes(selectedPaymentSystem!)
  ) {
    order!.currentSelectToPaymentSystemNames =
      order!.currentSelectToPaymentSystemNames.filter(
        (paymentSystem) => paymentSystem !== selectedPaymentSystem!
      )

    order!.currentSelectToPaymentSystemIDS =
      order!.currentSelectToPaymentSystemIDS.filter(
        (paymentSystem) => paymentSystem !== paymentSystemId!
      )
    await order!.save()
  }

  let indexEnter = 1
  paymentSystemNamesLocalized.forEach((paymentSystem, index) => {
    if (
      order!.currentSelectToPaymentSystemNames.includes(
        paymentSystemNames[index]
      )
    ) {
      paymentSystemMenu.text('✅' + paymentSystem, paymentSystemNames[index])
    } else {
      paymentSystemMenu.text(paymentSystem, paymentSystemNames[index])
    }
    if (indexEnter % 2 === 0) {
      paymentSystemMenu.row()
    }
    if (
      paymentSystem.length > 12 ||
      (paymentSystemNamesLocalized.length > index + 1 &&
        paymentSystemNamesLocalized[index + 1].length > 12)
    ) {
      paymentSystemMenu.row()
      indexEnter = 0
    }
    indexEnter++
  })

  await ctx.editMessageText(ctx.i18n.t('payment_system_to'), {
    ...sendOptions(ctx),
    reply_markup: paymentSystemMenu,
  })
}

function getPaymentSystemIdByName(
  paymentSystems: TPaymentSystem[],
  name: string
): number | undefined {
  const paymentSystem = paymentSystems.find((system) => system.name === name)
  return paymentSystem?.id
}
