import axios from 'axios'
import env from '@/helpers/env'

export default async function notifyMe(message: any) {
  try {
    const apiUrl = `https://api.telegram.org/bot${env.TOKEN}/sendMessage`

    await axios.post(apiUrl, {
      chat_id: 478204200,
      text: message,
    })
  } catch (error) {
    console.error('Error sending message to Telegram:')
  }
}
