//this is the access point for all things database related!

const db = require('./db')

const User = require('./models/User')
const Tournament = require('./models/Tournament')
const Match = require('./models/Match')

//associations could go here!
Tournament.hasMany(Match)
Match.belongsTo(Tournament)

module.exports = {
  db,
  models: {
    User,
    Tournament,
    Match,
  },
}
