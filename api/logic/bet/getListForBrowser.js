const initDb = require('../../database')

module.exports = async (req, res) => {
  // TODO error handling

  const {
    uniqueBrowserId,
  } = req.params
  const { collection, client } = await initDb()

  const results = await collection.find(
    {
      $or: [
        { 'bets.uniqueBrowserId': uniqueBrowserId },
        { 'adminBrowserId': uniqueBrowserId },
      ],
    },
    {
      _id: true,
      adminId: true,
      name: true,
      plannedBirthDate: true,
      betAmount: true,
      bets: true,
      betOptions: true,
      closed: true,
      winners: true,
      winnersAmount: true,
      adminBrowserId: true,
    }
  ).toArray()
  client.close()

  res.send(results.map((bet) => ({
    ...bet,
    numberOfBets: bet.bets.length,
    closed: bet.closed,
    won: bet.closed && bet.winners.filter(({ uniqueBrowserId: winnerUniqueBrowserId }) => uniqueBrowserId === winnerUniqueBrowserId).length > 0,
    winnersAmount: bet.winnersAmount,
    adminId: bet.adminBrowserId === uniqueBrowserId ? bet.adminId : undefined,
  })))
}