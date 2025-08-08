const express = require('express');
const sentenceController = require('../controllers/sentenceController');
const sentenceRouter = express.Router();

sentenceRouter.get('/', sentenceController.getSentences);

module.exports = sentenceRouter;