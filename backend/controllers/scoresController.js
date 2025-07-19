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

module.exports = {
  addChimpGameScore,
  getChimpGameScores,
};