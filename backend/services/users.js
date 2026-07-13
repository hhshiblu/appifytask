const { getUserByEmail, createUserQuery,updatePasswordQuery } = require("../dbquery/users")
const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid")
const jwt = require("jsonwebtoken")


const loginService = async (email, password, rememberMe = false) => {
    try {
        const user = await getUserByEmail(email)
        if (!user) {
            throw new Error("User not found")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            throw new Error("Invalid password")
        }
        const expiresIn = rememberMe ? "7d" : "1h"
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn })
        return { user, token }
    } catch (error) {
        throw new Error(error.message)
    }
}

const createUserService = async (first_name, last_name, email, password) => {
    try {
        const user = await getUserByEmail(email)
        if (user) {
            throw new Error("User already exists")
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const id = uuid()
        const result = await createUserQuery(id, first_name, last_name, email, hashedPassword)
        if (!result?.success) {
            throw new Error("Failed to create user")
        }
        const token = jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: "1h" })
        return { user: result, token }
    } catch (error) {
        throw new Error(error.message)
    }
}

const forgotPasswordService = async (email) => {
    try {
        const user = await getUserByEmail(email)
        if (!user) {
            throw new Error("User not found")
        }
        return { success: true }
    } catch (error) {
        throw new Error(error.message)
    }
}

const changePasswordService = async (email,newPassword) => {
    try {
        const user = await getUserByEmail(email)
        if (!user) {
            throw new Error("User not found")
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        const result = await updatePasswordQuery(email, hashedPassword)
        if (!result?.success) {
            throw new Error("Failed to update password")
        }
        return { success: true, message:"Password updated successfully" }
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = { loginService, createUserService, forgotPasswordService,changePasswordService }