const express = require("express")
const app = express()
const routes = require("./routes") // Import the consolidated routes
const { initializeDatabase } = require("./db/dbInit") // Import the database initialization module
require("dotenv").config() // Load environment variables

// Middleware
app.use(express.json())

// Use API routes
app.use("/api", routes) // Use the consolidated API routes

// Start the server
const startServer = async () => {
  try {
    await initializeDatabase() // Initialize the database
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error("Error during startup:", err)
  }
}

// Call the function to start the server
startServer()
