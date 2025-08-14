//you cannot mix commonjs and es6 imports
const { getWrongWords } = require('../db/queries'); // Importing the function to get wrong words
const { GoogleGenAI } = require('@google/genai'); // Importing the Google Gen


const ai = new GoogleGenAI({}); // created globally because if it is created inside the function, 
// it will create a new instance every time the function is called, which is not efficient.

async function generateSentencesAi(req, res) {
    const player_id = req.user.id;
    const wrongWords = await getWrongWords(player_id);
    console.log("Max 30 Wrong words retrieved:", wrongWords);
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            config: {
                thinkingConfig: {
                    thinkingBudget: 0, //thinking is disabled, saves time and resources
                }
            },
            contents: `${wrongWords} these are the words that the user got wrong. now based on the common letters in these wrong words, give me 20 sentences, where all the sentences have words containing those weak letters, and at least one random brainrot word. Make sure that the sentences do not contain any special characters or commas. The first sentence should mention users weak letters in the format "Your weak letters are: a b c d". MUST: Do not include any extra text, ONLY send the sentences. The sentences must be separated by commas.`
        });
        console.log(response.text);
        const generatedSentences = response.text.split(',').map(sentence => sentence.trim());
        console.log("Generated sentences:", generatedSentences);
        res.status(200).json(generatedSentences);
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

//generateSentencesAi()

module.exports = {
    generateSentencesAi,
};