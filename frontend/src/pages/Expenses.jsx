import { useEffect, useState } from 'react'
import api from '../api/axios'

function Expenses() {

  const [expenses, setExpenses] = useState([])

  const [search, setSearch] = useState('')

  const [category, setCategory] = useState('All')

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')


  // =========================
  // FORM
  // =========================

  const [showForm, setShowForm] = useState(false)

  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    description: '',
    expenseDate: ''
  })

  const [formMessage, setFormMessage] = useState('')

  const [formError, setFormError] = useState('')

  const [submitting, setSubmitting] = useState(false)


  // =========================
  // LOAD EXPENSES
  // =========================

  const loadExpenses = async () => {

    try {

      const response = await api.get('/api/expenses')

      setExpenses(response.data)

      setError('')

    } catch (error) {

      console.error('LOAD EXPENSES ERROR:', error)

      setError('Unable to load expenses.')

    } finally {

      setLoading(false)

    }

  }


  useEffect(() => {

    loadExpenses()

  }, [])


  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {

    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })

  }


  // =========================
  // OPEN ADD FORM
  // =========================

  const handleOpenAddForm = () => {

    setEditingId(null)

    setFormData({
      title: '',
      amount: '',
      category: 'Food',
      description: '',
      expenseDate: ''
    })

    setFormMessage('')

    setFormError('')

    setShowForm(true)

  }


  // =========================
  // OPEN EDIT FORM
  // =========================

  const handleEdit = (expense) => {

    setEditingId(expense.id)

    setFormData({
      title: expense.title || '',
      amount: expense.amount || '',
      category: expense.category || 'Food',
      description: expense.description || '',
      expenseDate: expense.expenseDate || ''
    })

    setFormMessage('')

    setFormError('')

    setShowForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

  }


  // =========================
  // CLOSE FORM
  // =========================

  const handleCloseForm = () => {

    setShowForm(false)

    setEditingId(null)

    setFormMessage('')

    setFormError('')

  }


  // =========================
  // ADD / UPDATE EXPENSE
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault()

    setFormMessage('')

    setFormError('')

    setSubmitting(true)

    try {

      const requestData = {
        title: formData.title,
        amount: Number(formData.amount),
        category: formData.category,
        description: formData.description,
        expenseDate: formData.expenseDate
      }


      // =========================
      // UPDATE
      // =========================

      if (editingId) {

        const response = await api.put(
          `/api/expenses/${editingId}`,
          requestData
        )

        console.log('UPDATE EXPENSE:', response.data)

        setFormMessage(
          'Expense updated successfully!'
        )

      }


      // =========================
      // CREATE
      // =========================

      else {

        const response = await api.post(
          '/api/expenses',
          requestData
        )

        console.log('ADD EXPENSE:', response.data)

        setFormMessage(
          'Expense added successfully!'
        )

      }


      // Reload list

      await loadExpenses()


      // Clear form

      setFormData({
        title: '',
        amount: '',
        category: 'Food',
        description: '',
        expenseDate: ''
      })


      // Close after short delay

      setTimeout(() => {

        setShowForm(false)

        setEditingId(null)

        setFormMessage('')

      }, 1000)

    } catch (error) {

      console.error(
        'ADD / UPDATE EXPENSE ERROR:',
        error
      )

      if (error.response) {

        setFormError(
          error.response.data?.message ||
          'Unable to save expense.'
        )

      } else {

        setFormError(
          'Cannot connect to backend.'
        )

      }

    } finally {

      setSubmitting(false)

    }

  }


  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        'Are you sure you want to delete this expense?'
      )

    if (!confirmDelete) {
      return
    }

    try {

      await api.delete(`/api/expenses/${id}`)

      setExpenses(
        expenses.filter(
          (expense) => expense.id !== id
        )
      )

    } catch (error) {

      console.error(
        'DELETE ERROR:',
        error
      )

      alert('Unable to delete expense.')

    }

  }


  // =========================
  // FILTER
  // =========================

  const filteredExpenses = expenses.filter(
    (expense) => {

      const matchesSearch =
        expense.title
          .toLowerCase()
          .includes(search.toLowerCase())


      const matchesCategory =
        category === 'All' ||
        expense.category === category


      return (
        matchesSearch &&
        matchesCategory
      )

    }
  )


  // =========================
  // CATEGORIES
  // =========================

  const categories = [
    'All',
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Entertainment',
    'Other'
  ]


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="expenses-page">

        <h1>My Expenses</h1>

        <p>Loading expenses...</p>

      </div>
    )

  }


  return (

    <div className="expenses-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="expenses-header">

        <div>

          <h1>My Expenses</h1>

          <p>
            Manage your personal expenses.
          </p>

        </div>


        <button
          className="add-expense-button"
          onClick={() => {

            if (showForm) {

              handleCloseForm()

            } else {

              handleOpenAddForm()

            }

          }}
        >
          {showForm
            ? 'Close'
            : '+ Add Expense'
          }
        </button>

      </div>


      {/* =========================
          ADD / EDIT FORM
      ========================= */}

      {showForm && (

        <div className="add-expense-card">

          <h2>
            {editingId
              ? 'Edit Expense'
              : 'Add New Expense'
            }
          </h2>


          <form onSubmit={handleSubmit}>

            {/* TITLE */}

            <label>
              Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter expense title"
              required
            />


            {/* AMOUNT */}

            <label>
              Amount
            </label>

            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              min="0"
              step="0.01"
              required
            />


            {/* CATEGORY */}

            <label>
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >

              <option value="Food">
                Food
              </option>

              <option value="Transport">
                Transport
              </option>

              <option value="Shopping">
                Shopping
              </option>

              <option value="Bills">
                Bills
              </option>

              <option value="Entertainment">
                Entertainment
              </option>

              <option value="Other">
                Other
              </option>

            </select>


            {/* DESCRIPTION */}

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              rows="3"
            />


            {/* DATE */}

            <label>
              Date
            </label>

            <input
              type="date"
              name="expenseDate"
              value={formData.expenseDate}
              onChange={handleChange}
              required
            />


            {/* SAVE BUTTON */}

            <button
              type="submit"
              className="save-expense-button"
              disabled={submitting}
            >

              {submitting

                ? 'Saving...'

                : editingId
                  ? 'Update Expense'
                  : 'Add Expense'

              }

            </button>

          </form>


          {formMessage && (

            <p className="success-message">
              {formMessage}
            </p>

          )}


          {formError && (

            <p className="error-message">
              {formError}
            </p>

          )}

        </div>

      )}


      {/* =========================
          SEARCH + FILTER
      ========================= */}

      <div className="expense-filters">

        <input
          type="text"
          placeholder="Search expenses..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />


        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >

          {categories.map((item) => (

            <option
              key={item}
              value={item}
            >
              {item}
            </option>

          ))}

        </select>

      </div>


      {error && (

        <p className="error-message">
          {error}
        </p>

      )}


      {/* =========================
          EXPENSE LIST
      ========================= */}

      <div className="expense-list">

        {filteredExpenses.length === 0 ? (

          <div className="empty-expenses">

            <h3>
              No expenses found
            </h3>

            <p>
              Try changing your search or filter.
            </p>

          </div>

        ) : (

          filteredExpenses.map((expense) => (

            <div
              className="expense-item"
              key={expense.id}
            >

              <div className="expense-info">

                <h3>
                  {expense.title}
                </h3>

                <p>
                  Category: {expense.category}
                </p>

                <p>
                  Date: {expense.expenseDate}
                </p>

                {expense.description && (

                  <p>
                    {expense.description}
                  </p>

                )}

              </div>


              <div className="expense-actions">

                <strong>
                  Rs. {Number(expense.amount).toFixed(2)}
                </strong>


                <div>

                  <button
                    onClick={() =>
                      handleEdit(expense)
                    }
                  >
                    Edit
                  </button>


                  <button
                    onClick={() =>
                      handleDelete(expense.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  )

}

export default Expenses