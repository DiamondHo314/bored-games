const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const app = express();
const cors = require('cors'); 

const registerRouter = require('./routes/registerRouter');
const playerProfileRouter = require('./routes/playerProfileRouter');
const loginRouter = require('./routes/loginRouter');
const scoreRouter = require('./routes/scoreRouter');

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173', // need cors to allow frontend to access backend server
  credentials: true, // Allow credentials to be sent
}));
app.use(express.static('public')); // Serve static files from the "public" folder

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.session());

app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Bored Games API" });
});
app.use('/register', registerRouter)
app.use('/profile', playerProfileRouter)
app.use('/login', loginRouter)
app.use('/scores', scoreRouter)

app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});