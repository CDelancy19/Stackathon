const router = require('express').Router()
const axios = require('axios')
const fs = require('fs')
const path = require('path')

const cachePath = path.join(__dirname, '..', 'cache', 'homeData.json')
const API_HOST = 'tennis-api-atp-wta-itf.p.rapidapi.com'

// Helper to fetch tournaments currently being played
const fetchCurrentTournaments = async () => {
  if (!process.env.RAPIDAPI_KEY) return []

  try {
    const year = new Date().getFullYear()
    const headers = {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': API_HOST,
    }

    const today = new Date()
    const tours = ['atp', 'wta']
    const results = []

    await Promise.all(
      tours.map(async (tour) => {
        const url = `https://${API_HOST}/tennis/v2/${tour}/tournament/calendar/${year}`
        const { data } = await axios.get(url, { headers })
        const events = data?.data || []

        events.forEach((evt) => {
          const start = evt.date ? new Date(evt.date) : null
          if (!start) return
          const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24))
          if (diffDays >= 0 && diffDays <= 7) {
            results.push({ id: evt.id, name: evt.name })
          }
        })
      })
    )

    return results
  } catch (err) {
    console.error(err)
    return []
  }
}

// Helper to fetch top ranked players for a tour
const fetchTopPlayers = async (tour) => {
  if (!process.env.RAPIDAPI_KEY) return []

  try {
    const headers = {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': API_HOST,
    }

    const url = `https://${API_HOST}/tennis/v2/${tour}/ranking/singles/`
    const { data } = await axios.get(url, { headers })
    const ranks = data?.data || []

    return ranks.slice(0, 10).map((r) => ({
      id: r.player?.id || r.id,
      name: r.player?.name || r.name || r.full_name,
      position: r.position,
    }))
  } catch (err) {
    console.error(err)
    return []
  }
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
        'x-rapidapi-host': API_HOST,
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

      if (tournaments.length || atpTop.length || wtaTop.length) {
        cache = { lastUpdated: now, tournaments, atpTop, wtaTop }
        fs.writeFileSync(cachePath, JSON.stringify(cache))
      }
    }

    const response = {
      ...cache,
      tournaments:
        cache.tournaments.length
          ? cache.tournaments
          : [{ id: 'none', name: 'No tournaments available' }],
      atpTop:
        cache.atpTop.length
          ? cache.atpTop
          : [{ id: 'none', name: 'No rankings available' }],
      wtaTop:
        cache.wtaTop.length
          ? cache.wtaTop
          : [{ id: 'none', name: 'No rankings available' }],
    }

    res.json(response)
  } catch (err) {
    next(err)
  }
})

module.exports = router
