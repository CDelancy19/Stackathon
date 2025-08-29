const jwt = require('jsonwebtoken');
const { query } = require('./db');

exports.handler = async (event) => {
  try {
    const token = event.headers.authorization?.split(' ')[1];
    const user = jwt.decode(token);

    const favorites = await query(
      'SELECT p.* FROM user_favorites uf JOIN players p ON uf.player_id = p.id WHERE uf.user_id = $1',
      [user.sub]
    );

    return {
      statusCode: 200,
      body: JSON.stringify(favorites),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.message,
    };
  }
};

