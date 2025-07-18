const express = require('express');
const authController = require('../controllers/authController');
const loginRouter = express.Router();

loginRouter.post('/', authController.logIn);

module.exports = loginRouter;