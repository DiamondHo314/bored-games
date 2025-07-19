const express = require('express');
const authController = require('../controllers/authController');
const loginRouter = express.Router();

loginRouter.post('/', authController.logIn);

loginRouter.get('/checkAuth', authController.checkAuth);

loginRouter.get('/logout', authController.logOut);

module.exports = loginRouter;