import 'module-alias/register'
import 'reflect-metadata'
import 'source-map-support/register'

import { bot } from '@/helpers/bot'
import { ignoreOld, sequentialize } from 'grammy-middlewares'
import { run } from '@grammyjs/runner'
import attachUser from '@/middlewares/attachUser'
import configureI18n from '@/middlewares/configureI18n'
import handleLanguage from '@/handlers/language'
import i18n from '@/helpers/i18n'
import languageMenu from '@/menus/language'
import selectStep from '@/handlers/selectStep'
import sendGuarantees from '@/handlers/guarantees'
import sendStart from '@/handlers/start'
import startMongo from '@/helpers/startMongo'
import { selectOrder } from './menus/selection'
import { selectUserOrder } from './menus/showUserOrders'

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
  bot.callbackQuery(
    [
      'previous',
      'next',
    ], selectOrder)
bot.callbackQuery(
  [
    'previous_my',
    'next_my',
    'delete'
  ], selectUserOrder)
  // Errors
  bot.catch(console.error)
  // Start bot
  await bot.init()
  run(bot)
  console.info(`Bot ${bot.botInfo.username} is up and running`)
}

void runApp()
