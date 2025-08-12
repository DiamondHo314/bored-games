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

async function addChimpGameScore(playerId, score){
  await pool.query("INSERT INTO chimp_game_score (player_id, score) VALUES ($1, $2)", [playerId, score]);
}

async function getChimpGameScores(playerId) {
  const { rows } = await pool.query("SELECT score FROM chimp_game_score WHERE player_id = $1 ORDER BY score ASC", [playerId]);
  if (rows.length === 0) {
    return []; // No scores found for the player
  }
  // Return an array of scores
  return rows;
}

async function addTypingGameScore(playerId, timerOption, wpm, acc) {
  const columnMap = {
    '15': ['fifteen_seconds_wpm', 'fifteen_seconds_acc'],
    '30': ['thirty_seconds_wpm', 'thirty_seconds_acc'],
    '60': ['sixty_seconds_wpm', 'sixty_seconds_acc']
  } // this is much cleaner, to use a map instead of a bunch of if elses
  const columns = columnMap[timerOption];
  await pool.query(`INSERT INTO typing_game_score (player_id, ${columns[0]}, ${columns[1]}) VALUES ($1, $2, $3)`, [playerId, wpm, acc]);
}

async function getTypingGameScores(playerId) {
  const fifteen = await pool.query("SELECT fifteen_seconds_wpm, fifteen_seconds_acc FROM typing_game_score WHERE player_id = $1 ORDER BY fifteen_seconds_wpm DESC", [playerId]);
  const thirty = await pool.query("SELECT thirty_seconds_wpm, thirty_seconds_acc FROM typing_game_score WHERE player_id = $1 ORDER BY thirty_seconds_wpm DESC", [playerId]);
  const sixty = await pool.query("SELECT sixty_seconds_wpm, sixty_seconds_acc FROM typing_game_score WHERE player_id = $1 ORDER BY sixty_seconds_wpm DESC", [playerId]);

  return {
    fifteen: fifteen.rows,
    thirty: thirty.rows,
    sixty: sixty.rows
  };
}

async function addWrongWords(playerId, wrongWords) {
  const query = "INSERT INTO wrong_words (player_id, word) VALUES ($1, $2)";
  for (const word of wrongWords) {
    await pool.query(query, [playerId, word]);
  }
}

async function getWrongWords(playerId) {
  const { rows } = await pool.query("SELECT word FROM wrong_words WHERE player_id = $1 order by id desc limit 30", [playerId]);
  return rows.map(row => row.word);
}

module.exports = { 
    registerUser,
    getUser,
    getPlayerUsername,
    addChimpGameScore,
    getChimpGameScores,
    addTypingGameScore,
    getTypingGameScores,
    addWrongWords,
    getWrongWords,
}