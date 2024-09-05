const bcrypt = require("bcryptjs")
const { User } = require("../db/dbInit")

const registerUser = async (username, password, email, firstName, lastName) => {
  const hashedPassword = await bcrypt.hash(password, 10)
  return await User.create({
    username,
    password: hashedPassword,
    email,
    firstName,
    lastName,
  })
}

const findUserByUsername = async (username) => {
  return await User.findOne({ where: { username } })
}

const loginUser = async (username, password) => {
  const user = await findUserByUsername(username)
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials")
  }
  return user
}

const createAdminUser = async () => {
  const adminExists = await findUserByUsername("admin")
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("admin", 10)
    await User.create({
      username: "admin",
      password: hashedPassword,
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      admin: true,
    })
    console.log("Admin user created with username: admin and password: admin")
  } else {
    console.log("Admin user already exists.")
  }
}

const getUserDetails = async (username) => {
  const user = await findUserByUsername(username)
  if (!user) {
    throw new Error("User not found")
  }
  return {
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    operator: user.operator,
    admin: user.admin,
  }
}

module.exports = {
  registerUser,
  findUserByUsername,
  loginUser,
  createAdminUser,
  getUserDetails,
}
