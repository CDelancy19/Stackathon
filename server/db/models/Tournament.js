const Sequelize = require('sequelize');
const db = require('../db');

const Tournament = db.define('tournament', {
  apiId: {
    type: Sequelize.STRING,
    unique: true,
  },
  name: Sequelize.STRING,
  location: Sequelize.STRING,
  startDate: Sequelize.DATE,
  endDate: Sequelize.DATE,
});

module.exports = Tournament;
