import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import session from 'express-session'
import mongoose from 'mongoose'
import authRoutes from './router/authRouter.js'
import passportConfig from './passportConfig.js'

// Initialize environment variables
import connectDB from './config/db.js'
dotenv.config()
connectDB()
// Initialize Express app
const app = express()

// CORS configuration
app.use(
  cors({
    origin: 'http://localhost:3000', // Allow requests only from React app
    credentials: true, // Allow cookies to be sent with requests
  })
)


// Middleware setup

app.use(express.json()) // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded data
app.use(cookieParser()) // Parse cookies from incoming requests

// Session and Passport middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
)

// Initialize Passport and session handling
passportConfig(passport) // Configure Passport

app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/api/users', authRoutes)

// Start the server
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
