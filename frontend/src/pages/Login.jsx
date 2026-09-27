import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {

    e.preventDefault()

    setMessage('')
    setLoading(true)

    try {

      const response = await api.post('/api/auth/login', {
        email: email,
        password: password
      })

      console.log(response.data)

      // Save JWT token
      localStorage.setItem('token', response.data.token)

      // Save user role
      localStorage.setItem('role', response.data.role)

      setMessage('Login successful!')

      setTimeout(() => {
        navigate('/')
      }, 500)

    } catch (error) {

      console.error('LOGIN ERROR:', error)

      if (error.response) {

        setMessage(
          `Error: ${error.response.status} - ${
            error.response.data?.message || 'Login failed'
          }`
        )

      } else {

        setMessage('Cannot connect to backend')

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
            💰
          </div>

          <h1>Welcome Back</h1>

          <p>
            Login to manage your expenses
          </p>

        </div>

        <form onSubmit={handleLogin}>

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
              placeholder="Enter your password"
              required
            />

          </div>

          <button
            className="auth-button"
            type="submit"
            disabled={loading}
          >

            {loading ? 'Logging in...' : 'Login'}

          </button>

        </form>

        {message && (
          <p
            className={
              message.includes('successful')
                ? 'success-message'
                : 'error-message'
            }
          >
            {message}
          </p>
        )}

        <div className="auth-footer">

          <p>
            Don't have an account?
          </p>

          <button
            className="link-button"
            onClick={() => navigate('/register')}
          >
            Create an account
          </button>

        </div>

      </div>

    </div>
  )
}

export default Login