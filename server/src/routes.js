const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const {
  registerUser,
  loginUser,
  getUserDetails,
} = require("./controllers/userController") // Import user controller
const {
  authenticateJWT,
  authorizeAdmin,
} = require("./middleware/authMiddleware") // Import middleware

const router = express.Router()

// User Registration Route
router.post(
  "/auth/register",
  authenticateJWT,
  authorizeAdmin,
  async (req, res) => {
    const { username, password, email, firstName, lastName } = req.body
    try {
      await registerUser(username, password, email, firstName, lastName)
      res.status(201).send("User registered")
    } catch (err) {
      res.status(400).send("Error registering user")
    }
  }
)

// User Login Route
router.post("/auth/login", async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await loginUser(username, password)
    const token = jwt.sign(
      { username: user.username, admin: user.admin },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    )
    res.json({ token })
  } catch (err) {
    res.status(401).send(err.message)
  }
})

// Get User Details Route
router.get("/auth/user/:username", authenticateJWT, async (req, res) => {
  const { username } = req.params
  try {
    const userDetails = await getUserDetails(username)
    res.json(userDetails)
  } catch (err) {
    res.status(404).send(err.message)
  }
})

// Protected Route Example
router.get("/auth/protected", authenticateJWT, (req, res) => {
  res.send("This is a protected route")
})

// Export the router
module.exports = router
