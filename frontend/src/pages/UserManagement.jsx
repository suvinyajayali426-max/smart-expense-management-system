import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function UserManagement() {

  const navigate = useNavigate()

  const [users, setUsers] = useState([])

  const [search, setSearch] = useState('')

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')


  // =========================
  // EDIT USER FORM
  // =========================

  const [showEditForm, setShowEditForm] = useState(false)

  const [editingId, setEditingId] = useState(null)

  const [editData, setEditData] = useState({
    name: '',
    email: '',
    role: 'USER'
  })

  const [updateMessage, setUpdateMessage] = useState('')

  const [updateError, setUpdateError] = useState('')

  const [updating, setUpdating] = useState(false)


  // =========================
  // LOAD USERS
  // =========================

  const loadUsers = async () => {

    try {

      const response = await api.get('/api/users')

      console.log('USERS:', response.data)

      setUsers(response.data)

      setError('')

    } catch (error) {

      console.error('LOAD USERS ERROR:', error)

      if (error.response?.status === 403) {

        setError(
          'You do not have permission to access user management.'
        )

      } else {

        setError(
          'Unable to load users.'
        )

      }

    } finally {

      setLoading(false)

    }

  }


  useEffect(() => {

    const role = localStorage.getItem('role')

    if (role !== 'ADMIN') {

      navigate('/')

      return

    }

    loadUsers()

  }, [navigate])


  // =========================
  // HANDLE EDIT INPUT
  // =========================

  const handleEditChange = (e) => {

    const { name, value } = e.target

    setEditData({
      ...editData,
      [name]: value
    })

  }


  // =========================
  // OPEN EDIT FORM
  // =========================

  const handleEdit = (user) => {

    setEditingId(user.id)

    setEditData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'USER'
    })

    setUpdateMessage('')

    setUpdateError('')

    setShowEditForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

  }


  // =========================
  // CLOSE EDIT FORM
  // =========================

  const handleCloseEdit = () => {

    setShowEditForm(false)

    setEditingId(null)

    setUpdateMessage('')

    setUpdateError('')

  }


  // =========================
  // UPDATE USER
  // =========================

  const handleUpdate = async (e) => {

    e.preventDefault()

    setUpdateMessage('')

    setUpdateError('')

    setUpdating(true)

    try {

      const response = await api.put(
        `/api/users/${editingId}`,
        {
          name: editData.name,
          email: editData.email,
          role: editData.role
        }
      )

      console.log(
        'UPDATE USER:',
        response.data
      )

      setUpdateMessage(
        'User updated successfully!'
      )

      // Reload user list
      await loadUsers()

      // Close form after short delay
      setTimeout(() => {

        setShowEditForm(false)

        setEditingId(null)

        setUpdateMessage('')

      }, 1000)

    } catch (error) {

      console.error(
        'UPDATE USER ERROR:',
        error
      )

      if (error.response?.status === 403) {

        setUpdateError(
          'You are not allowed to update this user.'
        )

      } else if (error.response) {

        setUpdateError(
          error.response.data?.message ||
          'Unable to update user.'
        )

      } else {

        setUpdateError(
          'Cannot connect to backend.'
        )

      }

    } finally {

      setUpdating(false)

    }

  }


  // =========================
  // DELETE USER
  // =========================

  const handleDelete = async (id, name) => {

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${name}?`
    )

    if (!confirmDelete) {
      return
    }

    try {

      await api.delete(`/api/users/${id}`)

      setUsers(
        users.filter(
          (user) => user.id !== id
        )
      )

    } catch (error) {

      console.error(
        'DELETE USER ERROR:',
        error
      )

      if (error.response?.status === 403) {

        alert(
          'You are not allowed to delete this user.'
        )

      } else {

        alert(
          'Unable to delete user.'
        )

      }

    }

  }


  // =========================
  // SEARCH
  // =========================

  const filteredUsers = users.filter(
    (user) => {

      const searchText =
        search.toLowerCase()

      return (
        user.name
          ?.toLowerCase()
          .includes(searchText) ||

        user.email
          ?.toLowerCase()
          .includes(searchText) ||

        user.role
          ?.toLowerCase()
          .includes(searchText)
      )

    }
  )


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <section className="user-management">

        <h1>
          User Management
        </h1>

        <p>
          Loading users...
        </p>

      </section>
    )

  }


  return (

    <section className="user-management">

      {/* =========================
          HEADER
      ========================= */}

      <div className="user-management-header">

        <div>

          <h1>
            User Management
          </h1>

          <p>
            View and manage registered users.
          </p>

        </div>

        <p>
             Total registered users: {users.length}
        </p>

      </div>


      {/* =========================
          EDIT USER FORM
      ========================= */}

      {showEditForm && (

        <div className="edit-user-card">

          <h2>
            Edit User
          </h2>

          <form onSubmit={handleUpdate}>

            {/* NAME */}

            <label>
              Name
            </label>

            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={handleEditChange}
              placeholder="Enter name"
              required
            />


            {/* EMAIL */}

            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              value={editData.email}
              onChange={handleEditChange}
              placeholder="Enter email"
              required
            />


            {/* ROLE */}

            <label>
              Role
            </label>

            <select
              name="role"
              value={editData.role}
              onChange={handleEditChange}
            >

              <option value="USER">
                USER
              </option>

              <option value="ADMIN">
                ADMIN
              </option>

            </select>


            <div className="edit-user-actions">

              <button
                type="submit"
                disabled={updating}
              >
                {updating
                  ? 'Updating...'
                  : 'Update User'
                }
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={handleCloseEdit}
              >
                Cancel
              </button>

            </div>

          </form>


          {updateMessage && (

            <p className="success-message">
              {updateMessage}
            </p>

          )}


          {updateError && (

            <p className="error-message">
              {updateError}
            </p>

          )}

        </div>

      )}


      {/* =========================
          ERROR
      ========================= */}

      {error && (

        <p className="error-message">
          {error}
        </p>

      )}


      {/* =========================
          SEARCH
      ========================= */}

      <div className="user-search">

        <input
          type="text"
          placeholder="Search by name, email or role..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      {/* =========================
          USER TABLE
      ========================= */}

      {filteredUsers.length === 0 ? (

        <div className="empty-users">

          <h3>
            No users found
          </h3>

          <p>
            Try changing your search.
          </p>

        </div>

      ) : (

        <div className="user-table-container">

          <table className="user-table">

            <thead>

              <tr>

                <th>
                  ID
                </th>

                <th>
                  Name
                </th>

                <th>
                  Email
                </th>

                <th>
                  Role
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredUsers.map((user) => (

                <tr key={user.id}>

                  <td>
                    {user.id}
                  </td>

                  <td>
                    {user.name}
                  </td>

                  <td>
                    {user.email}
                  </td>

                  <td>

                    <span
                      className={
                        user.role === 'ADMIN'
                          ? 'role-admin'
                          : 'role-user'
                      }
                    >
                      {user.role}
                    </span>

                  </td>

                  <td>

                    <div className="user-action-buttons">

                      <button
                        className="edit-user-button"
                        onClick={() =>
                          handleEdit(user)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-user-button"
                        onClick={() =>
                          handleDelete(
                            user.id,
                            user.name
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </section>

  )

}

export default UserManagement