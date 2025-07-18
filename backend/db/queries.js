const pool = require('./pool.js');

async function registerUser(username, password) {
  await pool.query("INSERT INTO player (username, password) VALUES ($1, $2)", [username, password]);
}

async function getUser(username) {
  const { rows } = await pool.query("SELECT * FROM player WHERE username = $1", [username]);
  return rows[0];
}

async function getPlayerUsername(id) {
  const { rows } = await pool.query("SELECT username FROM player WHERE id = $1", [id]);
  if (rows.length === 0) {
    return null; // No user found with the given ID
  }
  return rows[0].username; // Return the username of the found user
}

module.exports = { 
    registerUser,
    getUser,
    getPlayerUsername,
}