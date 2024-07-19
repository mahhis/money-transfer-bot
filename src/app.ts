import 'module-alias/register'
import 'reflect-metadata'
import 'source-map-support/register'

import {
  getFromPaymentSystemsMenu,
  getToPaymentSystemsMenu,
} from '@/menus/inline/paymentSystems'
import { ignoreOld, sequentialize } from 'grammy-middlewares'
import { run } from '@grammyjs/runner'
import { selectOrder } from '@/menus/inline/selection'
import { selectOrderTransfer } from '@/menus/inline/showTransferOrders'
import { selectUserOrder } from '@/menus/inline/showUserOrders'
import attachUser from '@/middlewares/attachUser'
import bot from '@/helpers/bot'
import configureI18n from '@/middlewares/configureI18n'
import handleLanguage from '@/handlers/language'
import i18n from '@/helpers/i18n'
import languageMenu from '@/menus/inline/language'
import selectStep from '@/handlers/selectStep'
import sendGuarantees from '@/handlers/tinder/guarantees'
import sendStart from '@/handlers/start'
import startMongo from '@/helpers/startMongo'

async function runApp() {
  console.log('Starting app...')
  // Mongo
  await startMongo()
  console.log('Mongo connected')
  bot
    // Middlewares
    .use(sequentialize())
    .use(ignoreOld())
    .use(attachUser)
    .use(i18n.middleware())
    .use(configureI18n)
    // Menus
    .use(languageMenu)
  // Commands
  bot.command('guarantees', sendGuarantees)
  bot.command('start', sendStart)
  bot.command('language', handleLanguage)

  bot.on('message', selectStep)
  bot.callbackQuery(['previous', 'next'], selectOrder)
  bot.callbackQuery(
    ['previous_offers', 'next_offers', 'update', 'make_transfer'],
    async (ctx) => {
      await selectOrderTransfer(ctx)
      await ctx.answerCallbackQuery()
    }
  )
  bot.callbackQuery(['previous_my', 'next_my', 'delete'], selectUserOrder)

  bot.on('callback_query:data', async (ctx) => {
    if (ctx.dbuser.step === 'enter_payment_system_from') {
      await getFromPaymentSystemsMenu(ctx)
      await ctx.answerCallbackQuery()
    } else if (ctx.dbuser.step === 'enter_payment_system_to') {
      await getToPaymentSystemsMenu(ctx)
      await ctx.answerCallbackQuery()
    }
  })

  // Errors
  bot.catch(console.error)
  // Start bot
  await bot.init()
  run(bot)
  console.info(`Bot ${bot.botInfo.username} is up and running`)
}

void runApp()
