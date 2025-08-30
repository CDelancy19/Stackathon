const router = require('express').Router()
const axios = require('axios')
const fs = require('fs')
const path = require('path')

const cachePath = path.join(__dirname, '..', 'cache', 'homeData.json')
// Ultimate Tennis API host
const API_HOST = 'ultimate-tennis1.p.rapidapi.com'

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
        // Ultimate Tennis API uses the /v1/tournaments endpoint with query params
        const url = `https://${API_HOST}/v1/tournaments?type=${tour.toUpperCase()}&year=${year}`
        const { data } = await axios.get(url, { headers })
        const events = data?.tournaments || data?.data || []

        events.forEach((evt) => {
          // Try a variety of field names for robustness
          const startRaw =
            evt.start || evt.start_date || evt.startDate || evt.date || evt.begin
          const endRaw =
            evt.end || evt.end_date || evt.endDate || evt.finish || evt.finish_date
          const start = startRaw ? new Date(startRaw) : null
          const end = endRaw ? new Date(endRaw) : null

          // Consider tournaments currently in progress
          if (start && end && today >= start && today <= end) {
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

    const gender = tour === 'atp' ? 'men' : 'women'
    // Use rankings endpoint; request top 10 singles players
    const url = `https://${API_HOST}/v1/rankings?gender=${gender}&type=singles&top=10`
    const { data } = await axios.get(url, { headers })
    const ranks = data?.rankings || data?.data || []

    return ranks.slice(0, 10).map((r) => ({
      id: r.player_id || r.player?.id || r.id,
      name: r.player_name || r.player?.name || r.name,
      position: r.rank || r.position,
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
    // The Ultimate Tennis API does not expose a direct search endpoint,
    // but the players endpoint supports name filtering via the `name` query.
    const options = {
      method: 'GET',
      url: `https://${API_HOST}/v1/players`,
      params: { name: q || 'Novak Djokovic' },
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
