const initDb = require('../../database')

module.exports = async (req, res) => {
  // TODO error handling
  const {
    id: adminId,
  } = req.params
  const { collection, client } = await initDb()

  await collection.updateOne(
    {
      adminId,
    },
    {
      $set: {
        ...req.body,
      },
    }
  )

  client.close()
  res.send()
}
