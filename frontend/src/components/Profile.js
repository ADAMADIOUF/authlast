import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  useProfileQuery,
  useUpdateProfileMutation,
} from '../slices/userApiSlice'
import { logout, setCredentials } from '../slices/authSlice'

const Profile = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { data: user, isLoading, isError, error } = useProfileQuery() // Fetch user profile using RTK query
  const [updateProfile] = useUpdateProfileMutation() // Mutation for updating profile
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
    }
  }, [user])

  const handleUpdate = async (e) => {
    e.preventDefault()
    const updatedData = { name, email, password }

    try {
      const updatedUser = await updateProfile(updatedData).unwrap() // Call the mutation
      dispatch(setCredentials(updatedUser)) // Update user info in Redux
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error(error?.message || 'Failed to update profile')
    }
  }

  const handleLogout = () => {
    dispatch(logout()) // Clear user data in Redux
    navigate('/') // Redirect to login page
    toast.success('Logged out successfully!')
  }

  if (isLoading) {
    return <p>Loading profile...</p>
  }

  if (isError) {
    toast.error(error?.message || 'Failed to fetch profile')
    navigate('/login')
    return null
  }

  return (
    <div style={styles.container}>
      {user ? (
        <>
          <h2>Welcome, {user.name || user.email}</h2>
          <div style={styles.profileInfo}>
            <form onSubmit={handleUpdate} style={styles.form}>
              <label htmlFor='name'>Name:</label>
              <input
                type='text'
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                required
              />

              <label htmlFor='email'>Email:</label>
              <input
                type='email'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />

              <label htmlFor='password'>Password:</label>
              <input
                type='password'
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder='Leave empty to keep the same'
              />

              <button type='submit' style={styles.button}>
                Update Profile
              </button>
            </form>
          </div>

          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  profileInfo: {
    textAlign: 'left',
    marginTop: '20px',
    fontSize: '16px',
    lineHeight: '1.5',
  },
  form: {
    marginTop: '20px',
    textAlign: 'left',
  },
  input: {
    padding: '8px',
    margin: '10px 0',
    width: '100%',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  logoutButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px',
  },
}

export default Profile
