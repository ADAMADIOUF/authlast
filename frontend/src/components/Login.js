import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useLoginMutation } from '../slices/userApiSlice'
import { setCredentials } from '../slices/authSlice'
import { toast } from 'react-toastify'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { userInfo } = useSelector((state) => state.auth)
  const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const redirect = sp.get('redirect') || '/profile'

  // Redirect user if already logged in
  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [userInfo, redirect, navigate])

  const [login, { isLoading }] = useLoginMutation()

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const res = await login({ email, password }).unwrap()

      // Dispatch credentials to Redux store
      dispatch(setCredentials(res)) // Assuming the response has the necessary user data

      // Redirect user after successful login
      navigate(redirect)
    } catch (error) {
      setError(error?.data?.message || error.error)
      toast.error(error?.data?.message || 'Login failed. Please try again.')
    }
  }

  // Google Login Handler
  const handleGoogleLogin = async () => {
    try {
      // Initiate Google login by redirecting to backend
      await fetch('http://localhost:5000/api/users/auth/google/init', {
        method: 'GET',
        credentials: 'include',
      })

      // Redirect the user to Google OAuth
      window.location.href = 'http://localhost:5000/api/users/auth/google'
    } catch (error) {
      console.error('Error initiating Google login:', error)
      toast.error('Failed to initiate Google login')
    }
  }

  // Callback handling after Google OAuth
  useEffect(() => {
    const handleGoogleCallback = async () => {
      const url = window.location.href
      if (url.includes('google')) {
        try {
          const res = await fetch(
            'http://localhost:5000/api/users/auth/google/success',
            {
              method: 'GET',
              credentials: 'include', // Ensure cookies are included
            }
          )

          if (res.ok) {
            const userData = await res.json()

            // Dispatch the user data to Redux
            dispatch(setCredentials(userData))

            // Redirect to the profile page after successful login
            navigate('/profile')
          } else {
            toast.error('Failed to fetch user data after Google login')
          }
        } catch (error) {
          toast.error('Error in Google callback, please try again.')
        }
      }
    }

    // Ensure we only run callback if we're on the correct URL after Google redirect
    if (window.location.href.includes('google')) {
      handleGoogleCallback()
    }
  }, [navigate, dispatch])

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={submitHandler} style={styles.form}>
        {error && <p style={styles.error}>{error}</p>}

        <label style={styles.label}>
          Email
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Password
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </label>

        <button type='submit' style={styles.button}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={styles.orText}>or</p>

      {/* Google login button */}
      <button onClick={handleGoogleLogin} style={styles.googleButton}>
        Login with Google
      </button>

      <p style={styles.signupText}>
        Don't have an account? <Link to='/register'>Sign up</Link>
      </p>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  label: {
    textAlign: 'left',
    fontWeight: 'bold',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  googleButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#db4437',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  orText: {
    margin: '20px 0',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
  signupText: {
    marginTop: '15px',
  },
}

export default Login
