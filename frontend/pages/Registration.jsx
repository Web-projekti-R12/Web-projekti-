import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const API_URL = `${API_BASE_URL}/api/auth/register`

export default function Registration() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccessMessage('')
    setLoading(true)

    if (!username || !password) {
      setError('Enter your username and password!')
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(API_URL, { username, password })
      console.log('Register success', response.data)

      // Näytetään onnistumisviesti
      setSuccessMessage('Register success!')

      // Odotetaan 2 sekuntia ja siirrytään login-sivulle
      setTimeout(() => {
        navigate('/login')
      }, 2000)

    } catch (err) {
      console.error(
        'Registration error:',
        err.response ? err.response.data : err.message
      )
      const errorMessage =
        err.response?.data?.msg ||
        'Registration error'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="form-card">
        <h2 className="form-title">Register</h2>

        {error && (
          <div className="error-message">
            <p>error: {error}</p>
          </div>
        )}

        {successMessage && (
          <div className="success-message">
            <p>{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username (email)</label>
            <input
              type="email"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
              disabled={loading}
              placeholder="example@gmail.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              disabled={loading}
              placeholder="password"
            />
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="registration-link-wrapper">
          Do you already have an account?{' '}
          <Link to="/login" className="registration-link">
            Log in here!
          </Link>
        </p>
      </div>
    </div>
  )
}
