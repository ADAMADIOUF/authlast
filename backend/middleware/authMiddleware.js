import jwt from 'jsonwebtoken'
import asyncHandler from './asyncHandler.js'
import User from '../models/User.js' // Fixed typo from "mdels" to "models"

// Protect middleware to ensure the user is authenticated
const protect = asyncHandler(async (req, res, next) => {
  let token

  // Check for token in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }
  // Check for token in cookies
  else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt
  }

  // If no token, throw an error
  if (!token) {
    console.error('Authorization error: No token provided.')
    res.status(401).json({ message: 'Not authorized, no token' })
    return // Ensures no further processing happens
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.AUTH_DEV)

    // Attach user to the request after validating the token
    req.user = await User.findById(decoded.userId).select('-password')
    if (!req.user) {
      console.error('Authorization error: User not found in database.')
      res.status(401).json({ message: 'Not authorized, user not found' })
      return
    }

    // Successfully authenticated, proceed to the next middleware
    next()
  } catch (error) {
    console.error(`Authorization error: ${error.message}`)
    res.status(401).json({ message: 'Not authorized, token failed' })
  }
})

// Admin middleware to restrict access to admin users only
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    console.log(`User with ID: ${req.user._id} is admin`)
    next()
  } else {
    console.error(`User with ID: ${req.user?._id || 'unknown'} is not admin`)
    res.status(403).json({ message: 'Not authorized as Admin' }) // Forbidden instead of 401 for role restrictions
  }
}

export { admin, protect }
