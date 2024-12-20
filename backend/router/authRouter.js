import express from 'express'
import passport from 'passport'
import {
  loginUser,
  registerUser,
  getProfile,
  logoutUser,
  updateProfile,
} from '../controller/authController.js'
import { admin, protect } from '../middleware/authMiddleware.js'
import generateToken from '../utils/generateToken.js'

const router = express.Router()

// Google OAuth Routes
router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
  }),
  (req, res) => {
    // Generate the token for the logged-in user
    const token = generateToken(req.user._id, res) // Pass the response object

    // Optionally log the token or send it in the response body (for API use)
    // console.log(token); // Token could also be sent in response if not using cookies

    // Redirect to profile page or send the response to the client
    res.redirect('http://localhost:3000/profile')
  }
)
// Register route (email and password)
router.post('/register', registerUser)

// Login route (email and password)
router.post('/login', loginUser)

// Protect profile and update routes for regular login (using `protect` middleware)
router.route('/profile').get(protect, getProfile) // Protected for regular users
router.route('/profile').put(protect, updateProfile) // Protected for regular users

// Logout route
router.post('/logout', logoutUser)

export default router
