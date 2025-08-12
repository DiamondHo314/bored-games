const db = require('../db/queries');

const addChimpGameScore = async (req, res) => {
  const { score } = req.body;
  const playerId = req.user.id; //req.user is populated by the authentication middleware
  console.log("addChimpGameScore called with body:", req.body); // Log the request body
  console.log("addChimpGameScore called with user:", req.user); // Log the request body
  console.log("addChimpGameScore called with playerId:", playerId, "and score:", score);
  
  try {
    await db.addChimpGameScore(playerId, score);
    res.status(201).json({ message: 'Score added successfully' });
  } catch (error) {
    console.error("Error adding chimp game score:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getChimpGameScores = async (req, res) => {
  const playerId = req.user.id; 
  console.log("getChimpGameScores called with playerId:", playerId);

  try {
    const scores = await db.getChimpGameScores(playerId);
    console.log("Retrieved scores:", scores);
    res.status(200).json(scores);
  } catch (error) {
    console.error("Error retrieving chimp game scores:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getTypingGameScores = async (req, res) => {
  const playerId = req.user.id;
  try{
    const scores = await db.getTypingGameScores(playerId);
    if (!scores) {
      return res.status(404).json({ error: "No scores found for this player" });
    }
    console.log("Retrieved typing game scores:", scores);
    res.status(200).json(scores);
  } catch (error) {
    console.error("Error retrieving typing game scores:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const postTypingGameScore = async (req, res) => {
  const { timerOption, wpm, acc } = req.body;
  const playerId = req.user.id; //req.user is populated by the authentication middleware
  console.log("postTypingGameScore called with body:", req.body);
  try {
    await db.addTypingGameScore(playerId, timerOption, wpm, acc);
    res.status(201).json({ message: 'Typing game score added successfully' });
  } catch (error) {
    console.error("Error adding typing game score:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


module.exports = {
  addChimpGameScore,
  getChimpGameScores,
  postTypingGameScore,
  getTypingGameScores,
};