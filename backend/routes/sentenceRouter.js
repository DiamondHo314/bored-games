const express = require('express');
const sentenceController = require('../controllers/sentenceController');
const sentenceRouter = express.Router();

sentenceRouter.get('/', sentenceController.getSentences);
sentenceRouter.get('/wrong', sentenceController.getWrongWords);
sentenceRouter.post('/wrong', sentenceController.postWrongWords);

module.exports = sentenceRouter;