const router = require('express').Router()
const axios = require('axios')
const { Match, Tournament } = require('../db').models

// Fetches match and tournament data from an external API and stores it
router.get('/import', async (req, res, next) => {
  try {
    // Using open dataset from JeffSackmann/tennis_atp on GitHub
    const { data } = await axios.get('https://raw.githubusercontent.com/JeffSackmann/tennis_atp/master/atp_matches_2021.csv')
    const lines = data.split('\n').slice(1, 21) // limit for demo
    for (const line of lines) {
      if (!line) continue
      const cols = line.split(',')
      const tourney = {
        apiId: cols[0],
        name: cols[1],
        startDate: new Date(`${cols[5].slice(0,4)}-${cols[5].slice(4,6)}-${cols[5].slice(6,8)}`)
      }
      const [tournament] = await Tournament.findOrCreate({
        where: { apiId: tourney.apiId },
        defaults: tourney,
      })
      const match = {
        apiId: `${cols[0]}-${cols[6]}`,
        round: cols[25],
        date: tourney.startDate,
        player1: cols[10],
        player2: cols[18],
        score: cols[23],
        tournamentId: tournament.id,
      }
      await Match.findOrCreate({
        where: { apiId: match.apiId },
        defaults: match,
      })
    }
    const matches = await Match.findAll({ include: Tournament })
    res.json(matches)
  } catch (err) {
    next(err)
  }
})

// Returns stored matches
router.get('/', async (req, res, next) => {
  try {
    const matches = await Match.findAll({ include: Tournament })
    res.json(matches)
  } catch (err) {
    next(err)
  }
})

module.exports = router
