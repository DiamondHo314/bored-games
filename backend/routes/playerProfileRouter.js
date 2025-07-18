const express = require('express');
const playerProfileController = require('../controllers/playerProfileController');
const playerProfileRouter = express.Router();

playerProfileRouter.get('/', playerProfileController.getPlayerProfile);

module.exports = playerProfileRouter;