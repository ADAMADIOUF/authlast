import User from '../models/User.js'
import asyncHandler from '../middleware/asyncHandler.js'
import generateToken from '../utils/generateToken.js' // This is used to generate JWT tokens
const generateNumericCode = (length) => {
  let code = ''
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10)
  }
  return code
}
// Register a new user
export const registerUser = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body

  // Check if the user already exists
  const userExist = await User.findOne({ email })
  if (userExist) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Generate verification code (for email verification purposes)
  const verificationCode = generateNumericCode(6)

  // Create a new user in the database
  const user = await User.create({
    name,
    email,
    password,
    verificationToken: verificationCode,
    verificationExpiresAt: Date.now() + 3600000, // Token expires in 1 hour
  })

  if (user) {
    // Generate a JWT token and set it as a cookie (assuming generateToken handles the cookie part)
    generateToken(user._id, res) // Set JWT cookie

    // Return user information along with the token in the response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage || '/images/default-avatar.png', // Fallback image
    })
  } else {
    res.status(400)
    throw new Error('User not created')
  }
})
// Login a user with email and password
// Login a user with email and password
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Find the user by email
  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    // Generate a JWT token for the user
    generateToken(user._id, res) // This will generate the token and set it as a cookie

    // Send user info along with JWT token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage || '/images/default-avatar.png',
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})
// Google authentication callback (existing)



export const googleAuthCallback = async (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  try {
    console.log(profile)

    if (!profile.id || !profile.emails || !profile.emails[0]?.value) {
      return done(new Error('Invalid Google profile structure'), null)
    }

    // Check if user already exists in database by Google ID or email
    let user = await User.findOne({
      $or: [{ googleId: profile.id }, { email: profile.emails[0]?.value }],
    })

    // If user doesn't exist, create a new user
    if (!user) {
      user = new User({
        googleId: profile.id,
        name: `${profile.name.givenName} ${profile.name.familyName}`,
        email: profile.emails[0]?.value,
        profileImage:
          profile.photos?.[0]?.value || '/images/default-avatar.png',
      })
      await user.save()
    }

    // Generate a JWT token (without setting the cookie here)
    const token = generateToken(user._id) // Generate token but do not set cookie here

    // Redirect the user to a new route where the cookie will be set
    done(null, user, { message: 'Google Auth Success', token }) // Pass the token as part of the user object
  } catch (err) {
    console.error('Google Auth Error:', err)
    done(err, null)
  }
}

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id) // Assuming `req.user` contains the authenticated user

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email, // email is always present for regular login
      profileImage: user.profileImage || '/images/default-avatar.png', // Default avatar if no profile image
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})
// Update user profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, profileImage } = req.body;
  
  // Find the user by their ID (authenticated user)
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update user fields
  if (name) user.name = name;
  if (email) user.email = email;
  if (profileImage) user.profileImage = profileImage;

  // Save the updated user information
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage || '/images/default-avatar.png',
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  })
  res.status(200).json({ message: 'logout successfully' })
})
