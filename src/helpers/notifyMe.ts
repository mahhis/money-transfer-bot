import axios from 'axios'
import env from '@/helpers/env'

export default async function notifyMe(message: any) {
  try {
    const apiUrl = `https://api.telegram.org/bot${env.TOKEN_NOTIFY}/sendMessage`

    await axios.post(apiUrl, {
      chat_id: env.CHAT_ID,
      text: message,
    })
  } catch (error) {
    console.error('Error sending message to Telegram:')
  }
}
