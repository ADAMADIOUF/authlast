import jwt from 'jsonwebtoken'

/**
 * Generates a JWT token and sets it as a cookie in the response.
 * @param {string} userId - The user ID (or other unique identifier).
 * @param {Object} res - The Express response object.
 * @returns {string} - The generated JWT token.
 */
const generateToken = (userId, res = null) => {
  // Generate JWT token with a payload that includes the user ID
  const token = jwt.sign(
    { userId },
    process.env.AUTH_DEV, // Secret key for signing the token
    { expiresIn: '30d' } // Set the token to expire in 30 days
  )

  if (res) {
    // If the response object is provided, set the JWT token as an HTTP-only cookie
    res.cookie('jwt', token, {
      httpOnly: true, // Makes the cookie inaccessible to JavaScript
      secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
      sameSite: 'strict', // Helps prevent CSRF attacks
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    })
  }

  return token // Return the token (if needed, for use in headers or other places)
}
export default generateToken
