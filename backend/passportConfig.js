import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

import { googleAuthCallback } from './controller/authController.js' // Import the googleAuthCallback function
import User from './models/User.js'

export default function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/api/users/auth/google/callback',
      },
      googleAuthCallback
    )
  )

  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id)
      done(null, user)
    } catch (err) {
      done(err, null)
    }
  })
}