const initDb = require('../../database')

module.exports = async (req, res) => {
  // TODO error handling

  const {
    id,
  } = req.params
  const { collection, client } = await initDb()

  const results = await collection.find(
    { _id: id },
    {
      _id: false,
      name: true,
      plannedBirthDate: true,
      betAmount: true,
      bets: true,
      betOptions: true,
    }
  ).limit(1).toArray()
  client.close()

  if (!results.length) {
    res.send({})
  } else {
    const bet = results[0]
    res.send({
      id,
      name: bet.name,
      plannedBirthDate: bet.plannedBirthDate,
      betAmount: bet.betAmount,
      numberOfBets: bet.bets.length,
      betOptions: bet.betOptions,
    })
  }
}