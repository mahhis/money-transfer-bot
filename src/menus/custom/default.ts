import { Keyboard } from 'grammy'
import i18n from '@/helpers/i18n'

export default function getI18nKeyboard(lng: string, type: string) {
  let keyboard: Keyboard

  switch (type) {
    case 'start':
      keyboard = new Keyboard()
        .text(i18n.t(lng, 'tinder'))
        .row()
        .text(i18n.t(lng, 'transfer'))
        .resized()
      return keyboard
    case 'tinder':
      keyboard = new Keyboard()
        .text(i18n.t(lng, 'my_orders'))
        .row()
        .text(i18n.t(lng, 'other_orders'))
        .row()
        .text(i18n.t(lng, 'cancel'))
        .resized()
      return keyboard
    case 'waiting_list':
      keyboard = new Keyboard()
        .text(i18n.t(lng, 'add'))
        .row()
        .text(i18n.t(lng, 'cancel'))
        .resized()
      return keyboard
    case 'finish':
      keyboard = new Keyboard()
        .text(i18n.t(lng, 'finish_btn'))
        .row()
        .text(i18n.t(lng, 'cancel'))
        .resized()
      return keyboard
    case 'transfer':
      keyboard = new Keyboard()
        .text(i18n.t(lng, 'send_money'))
        .row()
        .text(i18n.t(lng, 'cancel'))
        .resized()
      return keyboard
    case 'cancel':
      keyboard = new Keyboard().text(i18n.t(lng, 'cancel')).resized()
      return keyboard
    case 'countries':
      keyboard = new Keyboard()
        .text(i18n.t(lng, 'ua'))
        .text(i18n.t(lng, 'pl'))
        .row()
        .text(i18n.t(lng, 'by'))
        .text(i18n.t(lng, 'ru'))
        .row()
        .text(i18n.t(lng, 'cancel'))
        .resized()
      return keyboard
    case 'post':
      keyboard = new Keyboard()
        .text(i18n.t(lng, 'post'))
        .row()
        .text(i18n.t(lng, 'cancel'))
        .resized()

      return keyboard
    case 'currencies':
      keyboard = new Keyboard()
        .text('EUR')
        .text('USD')
        .row()
        .text('UAH')
        .text('PLN')
        .row()
        .text('BYN')
        .text('RUS')
        .row()
        .text(i18n.t(lng, 'cancel'))
        .resized()
      return keyboard
    case 'check_nick':
      keyboard = new Keyboard()
        .text(i18n.t(lng, 'check_nick'))
        .row()
        .text(i18n.t(lng, 'another_way_to_contact'))
        .row()
        .text(i18n.t(lng, 'cancel'))
        .resized()
      return keyboard
  }
}
