import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Ensure name is defined
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId // Password is required only if googleId is not set
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Ensures that null or undefined values are not considered in uniqueness checks
    },
    displayName: {
      type: String, // Optional for email-password users
    },
    profileImage: {
      type: String,
      default: '/images/default-avatar.png',
    },
  },
  {
    timestamps: true,
  }
)

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Match user-entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User
