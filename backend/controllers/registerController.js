const db = require("../db/queries");
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
  console.log("registerUser called", req.body); // Add this line
  const { username, password } = req.body;
  console.log("Username:", username, "Password:", password); // Log the received data

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await db.registerUser(username, hashedPassword);

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  registerUser,
};