import { Link, useLocation, useNavigate } from 'react-router-dom'

function Navbar() {

  const location = useLocation()
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')

    navigate('/login')
  }

  const isActive = (path) => {
    return location.pathname === path
      ? 'nav-link active'
      : 'nav-link'
  }

  return (

    <nav className="navbar">

      {/* BRAND */}

      <Link
        to="/"
        className="navbar-brand"
      >
        <div className="brand-icon">
          💰
        </div>

        <div className="brand-text">
          <strong>Smart Expense</strong>
          <span>Personal Finance</span>
        </div>
      </Link>


      {/* NAVIGATION */}

      {token && (

        <div className="navbar-links">

          <Link
            to="/"
            className={isActive('/')}
          >
            <span>▣</span>
            Dashboard
          </Link>

          <Link
            to="/expenses"
            className={isActive('/expenses')}
          >
            <span>↗</span>
            Expenses
          </Link>

          <Link
            to="/income"
            className={isActive('/income')}
          >
            <span>↘</span>
            Income
          </Link>

          <Link
            to="/budget"
            className={isActive('/budget')}
          >
            <span>◫</span>
            Budget
          </Link>

          <Link
            to="/reports"
            className={isActive('/reports')}
          >
            <span>▥</span>
            Reports
          </Link>


          {role === 'ADMIN' && (

            <Link
              to="/admin"
              className={isActive('/admin')}
            >
              <span>⚙</span>
              Admin
            </Link>

          )}


          {role === 'ADMIN' && (

            <Link
              to="/admin/users"
              className={isActive('/admin/users')}
            >
              <span>👥</span>
              Users
            </Link>

          )}

        </div>

      )}


      {/* RIGHT SIDE */}

      {token && (

        <div className="navbar-right">

          <div className="user-badge">

            <div className="user-avatar">
              {role === 'ADMIN' ? 'A' : 'U'}
            </div>

            <div className="user-info">

              <strong>
                {role === 'ADMIN'
                  ? 'Administrator'
                  : 'User'}
              </strong>

              <span>
                {role}
              </span>

            </div>

          </div>


          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      )}

    </nav>
  )
}

export default Navbar