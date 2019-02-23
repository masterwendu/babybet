const mongoClient = require("mongodb").MongoClient

const initDb = async () => {
  let user = process.env.MONGO_USER
  let password = process.env.MONGO_PASSWORD
  let server = process.env.MONGO_SERVER
  let dbName = process.env.MONGO_DB_NAME

  if (process.env.NODE_ENV !== 'production') {
    const secrets = require('./now-secrets.json')

    user = secrets['@babybet-mongodb-user']
    password = secrets['@babybet-mongodb-password']
    server = secrets['@babybet-mongodb-server']
    dbName = secrets['@babybet-mongodb-database-name']
  }
  try {
    const connectionString = `mongodb+srv://${user}:${password}@${server}/${dbName}/?ssl=true&retryWrites=true`

    const client = await mongoClient.connect(connectionString, { useNewUrlParser: true })
    const db = client.db(dbName)
    const collection = db.collection('bets')
    return { collection, client }
  } catch (e) {
    throw e
  }
}

module.exports = initDb