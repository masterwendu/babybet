const initDb = require('../../database')

module.exports = async (req, res) => {
  // TODO error handling

  const {
    uniqueBrowserId,
  } = req.params
  const { collection, client } = await initDb()

  const results = await collection.find(
    {
      'bets.uniqueBrowserId': uniqueBrowserId,
    },
    {
      _id: true,
      name: true,
      plannedBirthDate: true,
      betAmount: true,
      bets: true,
      betOptions: true,
      closed: true,
      winners: true,
      winnersAmount: true,
    }
  ).toArray()
  client.close()

  res.send(results.map((bet) => ({
    ...bet,
    numberOfBets: bet.bets.length,
    closed: bet.closed,
    won: closed && winners.filter(({ uniqueBrowserId: winnerUniqueBrowserId }) => uniqueBrowserId === winnerUniqueBrowserId).length > 0,
    winnersAmount: bet.winnersAmount,
  })))
}