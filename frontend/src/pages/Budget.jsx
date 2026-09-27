import { useEffect, useState } from 'react'
import api from '../api/axios'

function Budget() {
  const [budgets, setBudgets] = useState([])

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    category: 'Food',
    amount: '',
    budgetMonth: ''
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const categories = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Entertainment',
    'Other'
  ]

  const loadBudgets = async () => {
    try {
      setLoading(true)

      const response = await api.get('/api/budgets')

      setBudgets(response.data)
      setError('')
    } catch (error) {
      console.error('BUDGET ERROR:', error)

      setError(
        error.response?.data?.message ||
        'Unable to load budgets.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBudgets()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const resetForm = () => {
    setFormData({
      category: 'Food',
      amount: '',
      budgetMonth: ''
    })

    setEditingId(null)
    setMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setMessage('')
    setError('')
    setSubmitting(true)

    try {
      if (editingId) {
        await api.put(
          `/api/budgets/${editingId}`,
          formData
        )

        setMessage(
          'Budget updated successfully.'
        )
      } else {
        await api.post(
          '/api/budgets',
          formData
        )

        setMessage(
          'Budget added successfully.'
        )
      }

      await loadBudgets()

      setTimeout(() => {
        resetForm()
        setShowForm(false)
      }, 700)

    } catch (error) {
      console.error(
        'BUDGET SAVE ERROR:',
        error
      )

      setError(
        error.response?.data?.message ||
        'Unable to save budget.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (budget) => {
    setEditingId(budget.id)

    setFormData({
      category: budget.category,
      amount: budget.amount,
      budgetMonth: budget.budgetMonth
    })

    setShowForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this budget?'
    )

    if (!confirmed) {
      return
    }

    try {
      await api.delete(`/api/budgets/${id}`)

      await loadBudgets()

    } catch (error) {
      console.error(
        'BUDGET DELETE ERROR:',
        error
      )

      setError(
        error.response?.data?.message ||
        'Unable to delete budget.'
      )
    }
  }

  if (loading) {
    return (
      <section className="expenses-page">

        <div className="dashboard-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading budgets...
          </p>

        </div>

      </section>
    )
  }

  return (
    <section className="expenses-page">

      <div className="expenses-header">

        <div>

          <p className="dashboard-label">
            PERSONAL FINANCE
          </p>

          <h1>
            Budget
          </h1>

          <p>
            Set and manage your monthly spending limits.
          </p>

        </div>

        <button
          className="add-expense-button"
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
        >
          {showForm
            ? 'Close'
            : '+ Add Budget'}
        </button>

      </div>


      {error && (
        <div className="dashboard-error-box">

          <h3>
            Something went wrong
          </h3>

          <p>
            {error}
          </p>

          <button onClick={loadBudgets}>
            Try Again
          </button>

        </div>
      )}


      {showForm && (
        <div className="add-expense-card">

          <h2>
            {editingId
              ? 'Edit Budget'
              : 'Add New Budget'}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >

                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}

              </select>

            </div>


            <div className="form-group">

              <label>
                Budget Amount
              </label>

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter budget amount"
                min="0"
                step="0.01"
                required
              />

            </div>


            <div className="form-group">

              <label>
                Budget Month
              </label>

              <input
                type="month"
                name="budgetMonth"
                value={formData.budgetMonth}
                onChange={handleChange}
                required
              />

            </div>


            {message && (
              <p className="success-message">
                {message}
              </p>
            )}


            <div className="expense-form-actions">

              <button
                type="submit"
                className="save-expense-button"
                disabled={submitting}
              >
                {submitting
                  ? 'Saving...'
                  : editingId
                    ? 'Update Budget'
                    : 'Save Budget'}
              </button>


              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  resetForm()
                  setShowForm(false)
                }}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}


      <div className="expense-list">

        {budgets.length === 0 ? (

          <div className="empty-expenses">

            <div className="empty-icon">
              💰
            </div>

            <h3>
              No budgets yet
            </h3>

            <p>
              Add your first monthly budget.
            </p>

          </div>

        ) : (

          budgets.map((budget) => (

            <div
              className="expense-item"
              key={budget.id}
            >

              <div className="expense-info">

                <div
  className={`expense-category-icon ${
    budget.category === 'Food'
      ? 'budget-food'
      : budget.category === 'Transport'
        ? 'budget-transport'
        : budget.category === 'Shopping'
          ? 'budget-shopping'
          : budget.category === 'Bills'
            ? 'budget-bills'
            : budget.category === 'Entertainment'
              ? 'budget-entertainment'
              : 'budget-other'
  }`}
>
  {budget.category === 'Food'
    ? '🍔'
    : budget.category === 'Transport'
      ? '🚌'
      : budget.category === 'Shopping'
        ? '🛍️'
        : budget.category === 'Bills'
          ? '💡'
          : budget.category === 'Entertainment'
            ? '🎮'
            : '💰'}
</div>

                <div>

                  <h3>
                    {budget.category}
                  </h3>

                  <p>
                    Monthly Budget
                  </p>

                  <small>
                    {budget.budgetMonth}
                  </small>

                </div>

              </div>


              <div className="expense-actions">

                <strong className="budget-amount">
             Rs. {Number(
             budget.amount
              ).toFixed(2)}
               </strong>

                <button
                  className="edit-expense-button"
                  onClick={() =>
                    handleEdit(budget)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-expense-button"
                  onClick={() =>
                    handleDelete(budget.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </section>
  )
}

export default Budget