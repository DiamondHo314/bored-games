const express = require('express');
const geminiController = require('../controllers/geminiController');
const geminiRouter = express.Router();

geminiRouter.get('/', geminiController.generateSentencesAi);

module.exports = geminiRouter;