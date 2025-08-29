const Sequelize = require('sequelize')
const path = require('path')
const pkg = require('../../package.json')

const databaseName = pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '')

const config = {
  logging: false,
}

if (process.env.LOGGING === 'true') {
  delete config.logging
}

if (process.env.DATABASE_URL) {
  config.dialectOptions = {
    ssl: {
      rejectUnauthorized: false,
    },
  }
}

const db = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, config)
  : new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, `${databaseName}.sqlite`),
      logging: false,
    })

module.exports = db
