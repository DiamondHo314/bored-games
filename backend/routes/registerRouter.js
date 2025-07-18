const express = require('express');
const registerRouter = express.Router();
const registerController = require('../controllers/registerController');

registerRouter.get('/', (req, res) => {
    res.json({ message: "Register endpoint" });
});
registerRouter.post('/', registerController.registerUser);

module.exports = registerRouter;