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
  const [loading, setLoading] = useState(false)

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    if (!username || !password) {
      setError('Anna käyttäjätunnus ja salasana.')
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(API_URL, { username, password })
      console.log('Rekisteröinti onnistui:', response.data)

      //siirrytään kirjautumissivulle
      navigate('/login')
    } catch (err) {
      console.error(
        'Rekisteröintivirhe:',
        err.response ? err.response.data : err.message
      )
      const errorMessage =
        err.response?.data?.msg ||
        'Rekisteröinti epäonnistui. Tarkista tietosi ja palvelimen tila.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="form-card">
        <h2 className="form-title">Rekisteröidy</h2>

        {error && (
          <div className="error-message" role="alert">
            <p className="error-text">Virhe: {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Käyttäjätunnus (sähköposti):</label>
            <input
              type="email"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              required
              className="form-input"
              disabled={loading}
              placeholder="Anna sähköpostiosoitteesi"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Salasana:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
              className="form-input"
              disabled={loading}
              placeholder="Anna salasanasi"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Rekisteröidään...' : 'Rekisteröidy'}
          </button>
        </form>

        <p className="registration-link-wrapper">
          Onko sinulla jo tili?{' '}
          <Link to="/login" className="registration-link">
            Kirjaudu täältä sisään
          </Link>
        </p>
      </div>
    </div>
  )
}
