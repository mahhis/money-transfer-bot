import { NextFunction } from 'grammy'
import Context from '@/models/Context'
import { findOrCreateUser } from '@/models/UserProc'

export default async function attachUser(ctx: Context, next: NextFunction) {
  if (!ctx.from) {
    throw new Error('No from field found')
  }
  const user = await findOrCreateUser(ctx.from.id)
  user.username = ctx.from.username 

  if (!user) {
    throw new Error('User not found')
  }
  ctx.dbuser = user
  return next()
}
