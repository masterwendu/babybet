const shortid = require('shortid')
const initDb = require('../../database')

module.exports = async (req, res) => {
  // TODO error handling
  const {
    id: _id,
  } = req.params
  const { collection, client } = await initDb()

  await collection.update(
    {
      _id,
    },
    {$push: { bets: {
      ...req.body,
    }}}
  )

  client.close()
  res.send()
}
