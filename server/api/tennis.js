const router = require('express').Router()
const axios = require('axios')

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

module.exports = router
