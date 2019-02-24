const initDb = require('../../database')

module.exports = async (req, res) => {
  // TODO error handling
  const {
    id: adminId,
  } = req.params
  const { collection, client } = await initDb()

  const {
    sex,
    weight,
    size,
    birthday,
  } = req.body

  const [b] = await collection.find(
    {
      adminId,
    },
    {
      bets: true,
      betAmount: true,
    }
  ).toArray()

  const result = b.bets.map(({
    uniqueBrowserId,
    name,
    bets: {
      sex: betSex,
      weight: betWeight,
      size: betSize,
      birthday: betBirthday,
    },
  }) => {
    let score = 0
    if (betSex === sex) {
      score++
    }
    if (betWeight === weight) {
      score++
    }
    if (betSize === size) {
      score++
    }
    if (betBirthday === birthday) {
      score++
    }

    return {
      uniqueBrowserId,
      name,
      score,
    }
  })

  result.sort(({ score: scoreA }, { score: scoreB }) => {
    if (scoreA < scoreB) {
      return 1
    } else if (scoreA > scoreB) {
      return -1
    }
    return 0
  })

  const maxScore = result[0].score
  let winnersAmount = 0
  let winners = []
  if (maxScore > 0) {
    winners = result.filter(({ score }) => score === maxScore)
    winnersAmount = (b.betAmount * b.bets.length) / winners.length
  }


  await collection.update(
    {
      adminId,
    },
    {
      $set: {
        closed: true,
        result: {
          sex,
          weight,
          size,
          birthday,
        },
        winnersAmount,
        winners,
      },
    }
  )

  client.close()
  res.send(winners)
}
