import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../slices/authSlice'
import { useLogoutMutation } from '../slices/userApiSlice'

const Navbar = () => {
  const [isGoogleLogin, setIsGoogleLogin] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Get the user info from Redux state
  const { userInfo } = useSelector((state) => state.auth)

  // Use the logout mutation from userApiSlice
  const [logoutApiCall] = useLogoutMutation()

  // Check if the user is authenticated and if they logged in with Google
  useEffect(() => {
    if (userInfo?.provider === 'google') {
      setIsGoogleLogin(true)
    } else if (userInfo?.email) {
      setIsGoogleLogin(false)
    }
  }, [userInfo]) // Dependency on userInfo to update

  // Handle logout
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap() // Call logout API
      dispatch(logout()) // Dispatch the logout action
      navigate('/') // Redirect to login page
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <Link to='/' style={styles.link}>
            Home
          </Link>
        </li>
        {!userInfo ? (
          <>
            <li style={styles.navItem}>
              <Link to='/login' style={styles.link}>
                Login
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link to='/register' style={styles.link}>
                Register
              </Link>
            </li>
          </>
        ) : (
          <>
            <li style={styles.navItem}>
              <Link to='/profile' style={styles.link}>
                Profile
              </Link>
            </li>
            <li style={styles.navItem}>
              <button onClick={logoutHandler} style={styles.link}>
                Logout {isGoogleLogin ? '(Google)' : ''}
              </button>
            </li>
          </>
        )}
      </ul>
      {userInfo?.provider === 'google' && (
        <div style={styles.userInfo}>
          <img
            src={userInfo?.photo || 'https://via.placeholder.com/150'}
            alt='User Profile'
            style={styles.userImage}
          />
          <p style={styles.userName}>
            {userInfo?.displayName || userInfo?.name}
          </p>
        </div>
      )}
    </nav>
  )
}

const styles = {
  navbar: {
    backgroundColor: '#333',
    padding: '10px',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  navList: { listStyleType: 'none', display: 'flex', margin: 0, padding: 0 },
  navItem: { margin: '0 10px' },
  link: { color: '#fff', textDecoration: 'none', fontSize: '18px' },
  userInfo: {
    marginTop: '10px',
    textAlign: 'center',
  },
  userImage: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginBottom: '5px',
  },
  userName: {
    color: '#fff',
    fontSize: '16px',
    margin: '0',
  },
}

export default Navbar
