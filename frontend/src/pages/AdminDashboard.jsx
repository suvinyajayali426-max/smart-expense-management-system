import { useEffect, useState } from 'react'
import api from '../api/axios'
import { Link } from 'react-router-dom'

function AdminDashboard() {

  const [totalUsers, setTotalUsers] = useState(0)

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')


  const loadAdminDashboard = async () => {

    try {

      const response = await api.get(
        '/api/admin/dashboard'
      )

      console.log(
        'ADMIN DASHBOARD:',
        response.data
      )

      setTotalUsers(
        response.data.totalUsers
      )

      setError('')

    } catch (error) {

      console.error(
        'ADMIN DASHBOARD ERROR:',
        error
      )

      if (error.response?.status === 403) {

        setError(
          'You do not have permission to access this page.'
        )

      } else {

        setError(
          'Unable to load admin dashboard.'
        )

      }

    } finally {

      setLoading(false)

    }

  }


  useEffect(() => {

    loadAdminDashboard()

  }, [])


  if (loading) {

    return (
      <section className="admin-dashboard">

        <h1>Admin Dashboard</h1>

        <p>
          Loading...
        </p>

      </section>
    )

  }


  if (error) {

    return (
      <section className="admin-dashboard">

        <h1>Admin Dashboard</h1>

        <p className="error-message">
          {error}
        </p>

      </section>
    )

  }


  return (

    <section className="admin-dashboard">

      <div className="admin-header">

        <div>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Manage the Smart Expense system.
          </p>

        </div>

      </div>


      <div className="admin-summary-container">

        <div className="admin-summary-card">

          <h3>
            Total Users
          </h3>

          <p>
            {totalUsers}
          </p>

        </div>


        <div className="admin-summary-card">

          <h3>
            System Status
          </h3>

          <p className="status-text">
            Active
          </p>

        </div>

        <div className="admin-summary-card">

         <h3>
            Admin Access
        </h3>

        <p className="status-text">
           Authorized
       </p>

      </div>

      </div>

      <div className="admin-actions">

      <Link to="/admin/users">
       <button>
         Manage Users
      </button>
     </Link>

    </div>

    </section>

  )

}

export default AdminDashboard