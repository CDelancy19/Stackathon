const router = require('express').Router()
const axios = require('axios')
const fs = require('fs')
const path = require('path')

const cachePath = path.join(__dirname, '..', 'cache', 'homeData.json')

// Helper to fetch tournaments currently being played
const fetchCurrentTournaments = async () => {
  if (!process.env.RAPIDAPI_KEY) return []

  const options = {
    method: 'GET',
    url: 'https://tennis-api-atp-wta-itf.p.rapidapi.com/tennis/current/tournaments',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'tennis-api-atp-wta-itf.p.rapidapi.com',
    },
  }

  const { data } = await axios.request(options)
  return data?.data || []
}

// Helper to fetch top ranked players for a tour
const fetchTopPlayers = async (tour) => {
  if (!process.env.RAPIDAPI_KEY) return []

  const options = {
    method: 'GET',
    url: `https://tennis-api-atp-wta-itf.p.rapidapi.com/tennis/rankings/${tour}`,
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'tennis-api-atp-wta-itf.p.rapidapi.com',
    },
  }

  const { data } = await axios.request(options)
  const rankings = data?.data || []
  return rankings.slice(0, 10)
}

// Search tennis data via RapidAPI
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query
    const options = {
      method: 'GET',
      url: 'https://tennis-api-atp-wta-itf.p.rapidapi.com/tennis/v2/search',
      params: { search: q || 'ABC' },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'tennis-api-atp-wta-itf.p.rapidapi.com',
      },
    }

    const { data } = await axios.request(options)
    res.json(data)
  } catch (err) {
    next(err)
  }
})

// Return cached daily home page data
router.get('/home', async (req, res, next) => {
  try {
    let cache = {
      lastUpdated: 0,
      tournaments: [],
      atpTop: [],
      wtaTop: [],
    }

    if (fs.existsSync(cachePath)) {
      cache = JSON.parse(fs.readFileSync(cachePath))
    }

    const oneDay = 24 * 60 * 60 * 1000
    const now = Date.now()

    if (now - cache.lastUpdated > oneDay) {
      const [tournaments, atpTop, wtaTop] = await Promise.all([
        fetchCurrentTournaments(),
        fetchTopPlayers('atp'),
        fetchTopPlayers('wta'),
      ])

      cache = { lastUpdated: now, tournaments, atpTop, wtaTop }
      fs.writeFileSync(cachePath, JSON.stringify(cache))
    }

    res.json(cache)
  } catch (err) {
    next(err)
  }
})

module.exports = router
