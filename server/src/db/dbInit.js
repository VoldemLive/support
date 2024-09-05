const { Sequelize, DataTypes } = require("sequelize")
require("dotenv").config() // Ensure this is at the top
const bcrypt = require("bcryptjs") // Import bcrypt
const { createAdminUser } = require("../controllers/userController") // Import specific function

// Construct the database URL using the new environment variables
const DATABASE_URL = `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER}:5432/${process.env.DB_NAME}`

// Log the connection string for debugging
console.log("Connecting to database with URL:", DATABASE_URL)

// Connect to PostgreSQL
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
})

// Define User model
const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  operator: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})

// Function to create the database if it doesn't exist
const createDatabaseIfNotExists = async () => {
  const dbExists = await sequelize
    .query(`SELECT 1 FROM pg_database WHERE datname='${process.env.DB_NAME}'`)
    .then((res) => res[0].length > 0)
    .catch(() => false)

  if (!dbExists) {
    await sequelize.query(`CREATE DATABASE "${process.env.DB_NAME}"`)
    console.log(`Database ${process.env.DB_NAME} created successfully.`)
  } else {
    console.log(`Database ${process.env.DB_NAME} already exists.`)
  }
}

// Function to sync the database and create the admin user
const initializeDatabase = async () => {
  await createDatabaseIfNotExists()
  await sequelize.sync() // Sync the model with the database

  // Create the admin user if it doesn't exist
  await createAdminUser
}

// Export the initialize function and User model
module.exports = { initializeDatabase, User }
