import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Register() {

  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {

    e.preventDefault()

    setMessage('')
    setError('')
    setLoading(true)

    try {

      const response = await api.post('/api/users', {
        name: name,
        email: email,
        password: password,
        role: 'USER'
      })

      console.log('REGISTER:', response.data)

      setMessage('Registration successful!')

      setName('')
      setEmail('')
      setPassword('')

      setTimeout(() => {
        navigate('/login')
      }, 1000)

    } catch (error) {

      console.error('REGISTER ERROR:', error)

      if (error.response) {

        setError(
          error.response.data?.message ||
          'Registration failed.'
        )

      } else {

        setError('Cannot connect to backend.')

      }

    } finally {

      setLoading(false)

    }
  }

  return (

    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-header">

          <div className="auth-icon">
            👤
          </div>

          <h1>Create Account</h1>

          <p>
            Start managing your expenses today
          </p>

        </div>

        <form onSubmit={handleRegister}>

          <div className="form-group">

            <label>Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />

          </div>

          <div className="form-group">

            <label>Email Address</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

          </div>

          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />

          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >

            {loading ? 'Creating Account...' : 'Create Account'}

          </button>

        </form>

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <div className="auth-footer">

          <p>
            Already have an account?
          </p>

          <button
            className="link-button"
            onClick={() => navigate('/login')}
          >
            Login
          </button>

        </div>

      </div>

    </div>

  )
}

export default Register