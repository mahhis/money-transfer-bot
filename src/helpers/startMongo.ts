import mongoose, { connect } from 'mongoose'
import env from '@/helpers/env'

function startMongo() {
  mongoose.set('strictQuery', false);
  return connect(env.MONGO)
}

export default startMongo
