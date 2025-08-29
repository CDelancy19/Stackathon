const jwt = require('jsonwebtoken');
const { query } = require('./db');

exports.handler = async (event) => {
  try {
    const token = event.headers.authorization?.split(' ')[1];
    const user = jwt.decode(token);
    const { matchId } = JSON.parse(event.body);

    await query(
      'INSERT INTO user_subscriptions (user_id, match_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [user.sub, matchId]
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

