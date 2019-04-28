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
    babyName,
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

  let nearestWeightDifference
  let nearestSizeDifference

  let result = b.bets.map(({
    uniqueBrowserId,
    name,
    bets: {
      sex: betSex,
      weight: betWeight,
      size: betSize,
      birthday: betBirthday,
      babyName: betBabyName,
    },
  }) => {
    let score = 0
    if (betSex === sex) {
      score++
    }
    const weightDifference = Math.abs(weight - betWeight)
    if (!nearestWeightDifference || weightDifference < nearestWeightDifference) {
      nearestWeightDifference = weightDifference
    }
    const sizeDifference = Math.abs(size - betSize)
    if (!nearestSizeDifference || sizeDifference < nearestSizeDifference) {
      nearestSizeDifference = sizeDifference
    }
    if (betBirthday === birthday) {
      score++
    }
    if (
      babyName &&
      betBabyName
        .toLowerCase()
        .replace(/ /g, '')
        .replace(/-/g, '') ===
      babyName
        .toLowerCase()
        .replace(/ /g, '')
        .replace(/-/g, '')
    ) {
      score++
    }

    return {
      uniqueBrowserId,
      name,
      score,
      weightDifference,
      sizeDifference,
    }
  })


  let result = result.map((bet) => {
    const {
      score,
      weightDifference,
      sizeDifference,
    } = bet
    let extraScore = 0

    if (weightDifference === nearestWeightDifference) {
      extraScore++
    }
    if (sizeDifference === nearestSizeDifference) {
      extraScore++
    }

    return {
      ...bet,
      score: score + extraScore,
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
          babyName,
        },
        winnersAmount,
        winners,
      },
    }
  )

  client.close()
  res.send(winners)
}
