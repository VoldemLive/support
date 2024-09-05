const jwt = require("jsonwebtoken")

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]
  if (!token) return res.sendStatus(403)

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

// Middleware to check for admin role
const authorizeAdmin = (req, res, next) => {
  if (!req.user || !req.user.admin) {
    return res.status(403).send("Access denied. Admins only.")
  }
  next()
}

module.exports = { authenticateJWT, authorizeAdmin }
