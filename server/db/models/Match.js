const Sequelize = require('sequelize');
const db = require('../db');

const Match = db.define('match', {
  apiId: {
    type: Sequelize.STRING,
    unique: true,
  },
  round: Sequelize.STRING,
  date: Sequelize.DATE,
  player1: Sequelize.STRING,
  player2: Sequelize.STRING,
  score: Sequelize.STRING,
});

module.exports = Match;
