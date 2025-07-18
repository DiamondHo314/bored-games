const db = require("../db/queries");

async function getPlayerProfile(req, res) {
  const userId = req.user.id;
  console.log('req user for player profile:', req.user);
  console.log("Fetching player profile for user ID:", userId);
  try {
    const username = await db.getPlayerUsername(userId);
    if (!username) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ username });
  } catch (error) {
    console.error("Error fetching player profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getPlayerProfile,
};