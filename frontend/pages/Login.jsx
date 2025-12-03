import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const API_URL = `${API_BASE_URL}/api/auth/login`

export default function Login() {
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
            const response = await axios.post(
                API_URL, 
                { username, password }
            )
            
            const token = response.data.token
            
            localStorage.setItem('authToken', token)
            console.log('Kirjautuminen onnistui. Token tallennettu.')
            navigate('/') 

        } catch (err) {
            console.error('Kirjautumisvirhe:', err.response ? err.response.data : err.message)
            const errorMessage = err.response?.data?.msg || 'Kirjautuminen epäonnistui. Tarkista tietosi ja palvelimen tila.';
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        // Käytetään luokkaa login-container keskittämiseen
        <div className="login-container">
            
            <div className="form-card">
                <h2 className="form-title">Login</h2>
                
                {/* Virheilmoituksen näyttö */}
                {error && (
                    <div className="error-message" role="alert">
                        <p className="error-text">Error: {error}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="login-form">

                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={handleUsernameChange}
                            required
                            className="form-input"
                            disabled={loading}
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                            className="form-input"
                            disabled={loading}
                            placeholder="Enter your password"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="submit-button"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
                <p className="registration-link-wrapper">
                    Don't you have an account? <Link to="/registration" className="registration-link">Register here</Link>
                </p>
            </div>
        </div>
    )
}