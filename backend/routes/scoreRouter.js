const express = require('express');
const scoreController = require('../controllers/scoresController');
const scoreRouter = express.Router();

scoreRouter.post('/chimp', scoreController.addChimpGameScore);
scoreRouter.get('/chimp', scoreController.getChimpGameScores);

module.exports = scoreRouter;