const fs = require('fs');
const path = require('path');
const sentencesFilePath = path.join(__dirname, '../sentences.txt');

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

module.exports = {
  getSentences,
};