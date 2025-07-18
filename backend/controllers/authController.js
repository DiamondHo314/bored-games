const passport = require("../config/passport");

const logIn = (req, res, next) => {
  console.log("Attempting to log in user:", req.body.username);
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log("Error during authentication:", err);
      return next(err); // Pass errors to the error handler
    }
    if (!user) {
      console.log("Authentication failed:", info.message);
      return res.status(401).json({ success: false, message: info.message }); // Respond with 401 Unauthorized
    }
    req.logIn(user, (err) => {
      if (err) {
        console.log("Error during login:", err);
        return next(err); // Pass errors to the error handler
      }
      res.status(201).json({ message: 'login successful' });
    });
  })(req, res, next); // Invoke the middleware
};

const logOut = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err); // Pass errors to the error handler
    }
    return res.status(201).json({ message: 'successfully logged out' }); 
    });
}

const checkAuth = (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ authenticated: true, user: req.user });
  } else {
    return res.status(401).json({ authenticated: false });
  }
};

module.exports = {
  logIn,
  logOut,
  checkAuth,
}