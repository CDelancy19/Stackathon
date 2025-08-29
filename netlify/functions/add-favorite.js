const jwt = require('jsonwebtoken');
const { query } = require('./db');

exports.handler = async (event) => {
  try {
    const token = event.headers.authorization?.split(' ')[1];
    const user = jwt.decode(token);
    const { playerId } = JSON.parse(event.body);

    await query(
      'INSERT INTO user_favorites (user_id, player_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [user.sub, playerId]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.message,
    };
  }
};

