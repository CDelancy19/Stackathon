const router = require('express').Router()
const { models: { User }} = require('../db')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only non-sensitive fields
      attributes: ['id', 'name', 'email', 'phone']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})
