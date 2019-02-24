const initDb = require('../../database')

module.exports = async (req, res) => {
  // TODO error handling

  const {
    id,
  } = req.params
  const { collection, client } = await initDb()

  const results = await collection.find(
    { adminId: id },
    {
      _id: true,
      adminId: true,
      name: true,
      plannedBirthDate: true,
      betAmount: true,
      bets: true,
      betOptions: true,
      closed: true,
      result: true,
      winners: true,
      winnersAmount: true,
    }
  ).limit(1).toArray()
  client.close()

  if (!results.length) {
    res.send({})
  } else {
    const bet = results[0]

    res.send({
      id: bet._id,
      adminId: bet.adminId,
      name: bet.name,
      plannedBirthDate: bet.plannedBirthDate,
      betAmount: bet.betAmount,
      numberOfBets: bet.bets.length,
      betOptions: bet.betOptions,
      closed: bet.closed,
      result: bet.result,
      winners: bet.winners,
      winnersAmount: bet.winnersAmount,
    })
  }
}