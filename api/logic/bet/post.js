const shortid = require('shortid')
const initDb = require('../../database')

module.exports = async (req, res) => {
  // TODO error handling
  const {
    name,
    plannedBirthDate,
    betOptions,
    betAmount,
  } = req.body
  const { collection, client } = await initDb()

  const _id = shortid.generate()
  const adminId = shortid.generate()

  await collection.insertOne({
    _id,
    adminId,
    name,
    plannedBirthDate,
    betOptions,
    betAmount,
    bets: [],
  })
  client.close()

  res.send({
    id: _id,
    adminId,
  })
}
