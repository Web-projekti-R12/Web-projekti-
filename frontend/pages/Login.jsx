import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        console.log('Yritykset:');
        console.log('Käyttäjätunnus:', username);
        console.log('Salasana:', password);
    }



    return (
        <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            required
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
          />
        </div>

        <button type="submit">Login</button>
      </form>
        <p classname="registration-link">
            Don't have an account yet? <Link to="/registration">Register here</Link>

        </p>
        </div>
    )
}