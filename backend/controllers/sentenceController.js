const fs = require('fs');
const path = require('path');
const sentencesFilePath = path.join(__dirname, '../sentences.txt');
const db = require('../db/queries'); 

const getSentences = (req, res) => {
  try {
    const data = fs.readFileSync(sentencesFilePath, 'utf8');

    const lines =  data.split('\n').filter(sentence => sentence.trim() !== '');
    //console.log(lines[12])
    res.json(lines); //the sentences are sent as an array, 
    // the length of this array is however many lines there are in the file
  } catch (error) {
    console.error("Error reading sentences file:", error);
    return [];
  }
}

//posting wrong words to the database
const postWrongWords = async (req, res) => {
  const { wrongWords } = req.body;
  const playerId = req.user.id; //req.user is populated by the authentication middleware
  console.log("postWrongWords called with body:", req.body);
  try {
    await db.addWrongWords(playerId, wrongWords);
    res.status(201).json({ message: 'Wrong words added successfully' });
  } catch (error) {
    console.error("Error adding wrong words:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getWrongWords = async (req, res) => {
  const playerId = req.user.id; //req.user is populated by the authentication middleware
  console.log("getWrongWords called with playerId:", playerId);
  try {
    const wrongWords = await db.getWrongWords(playerId);
    console.log("Retrieved wrong words:", wrongWords);
    res.status(200).json(wrongWords);
  } catch (error) {
    console.error("Error retrieving wrong words:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getSentences,
  getWrongWords,
  postWrongWords,
};