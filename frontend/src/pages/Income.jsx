import { useEffect, useState } from 'react'
import api from '../api/axios'

function Income() {
  const [incomes, setIncomes] = useState([])

  const [search, setSearch] = useState('')
  const [source, setSource] = useState('All')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    source: 'Salary',
    incomeDate: '',
    description: ''
  })

  const [formMessage, setFormMessage] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadIncome = async () => {
    try {
      setLoading(true)

      const response = await api.get('/api/income')

      setIncomes(response.data)
      setError('')
    } catch (error) {
      console.error('INCOME ERROR:', error)

      if (error.response?.status === 401) {
        setError('Your session has expired. Please login again.')
      } else {
        setError('Unable to load income.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadIncome()
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
      title: '',
      amount: '',
      source: 'Salary',
      incomeDate: '',
      description: ''
    })

    setEditingId(null)
    setFormMessage('')
    setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setFormMessage('')
    setFormError('')
    setSubmitting(true)

    try {
      if (editingId) {
        await api.put(
          `/api/income/${editingId}`,
          formData
        )

        setFormMessage('Income updated successfully.')
      } else {
        await api.post(
          '/api/income',
          formData
        )

        setFormMessage('Income added successfully.')
      }

      await loadIncome()

      setTimeout(() => {
        resetForm()
        setShowForm(false)
      }, 700)

    } catch (error) {
      console.error('INCOME SAVE ERROR:', error)

      if (error.response) {
        setFormError(
          error.response.data?.message ||
          'Unable to save income.'
        )
      } else {
        setFormError('Cannot connect to backend.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (income) => {
    setEditingId(income.id)

    setFormData({
      title: income.title,
      amount: income.amount,
      source: income.source,
      incomeDate: income.incomeDate,
      description: income.description || ''
    })

    setFormMessage('')
    setFormError('')
    setShowForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this income?'
    )

    if (!confirmed) {
      return
    }

    try {
      await api.delete(`/api/income/${id}`)

      await loadIncome()
    } catch (error) {
      console.error('INCOME DELETE ERROR:', error)

      setError(
        error.response?.data?.message ||
        'Unable to delete income.'
      )
    }
  }

  const filteredIncome = incomes.filter((income) => {
    const searchText = search.toLowerCase()

    const matchesSearch =
      income.title.toLowerCase().includes(searchText) ||
      income.source.toLowerCase().includes(searchText) ||
      (income.description || '')
        .toLowerCase()
        .includes(searchText)

    const matchesSource =
      source === 'All' ||
      income.source === source

    return matchesSearch && matchesSource
  })

  const sourceOptions = [
    'All',
    'Salary',
    'Freelance',
    'Business',
    'Investment',
    'Other'
  ]

  if (loading) {
    return (
      <section className="expenses-page">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading income...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="expenses-page">

      {/* Header */}

      <div className="expenses-header">

        <div>
          <p className="dashboard-label">
            PERSONAL FINANCE
          </p>

          <h1>Income</h1>

          <p>
            Track and manage your income sources.
          </p>
        </div>

        <button
          className="add-expense-button"
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
        >
          {showForm ? 'Close' : '+ Add Income'}
        </button>

      </div>


      {/* Error */}

      {error && (
        <div className="dashboard-error-box">
          <h3>Something went wrong</h3>

          <p>{error}</p>

          <button onClick={loadIncome}>
            Try Again
          </button>
        </div>
      )}


      {/* Add / Edit Form */}

      {showForm && (
        <div className="add-expense-card">

          <h2>
            {editingId
              ? 'Edit Income'
              : 'Add New Income'}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>Income Title</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Monthly Salary"
                required
              />

            </div>


            <div className="form-group">

              <label>Amount</label>

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

            </div>


            <div className="form-group">

              <label>Source</label>

              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
              >

                <option value="Salary">
                  Salary
                </option>

                <option value="Freelance">
                  Freelance
                </option>

                <option value="Business">
                  Business
                </option>

                <option value="Investment">
                  Investment
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>


            <div className="form-group">

              <label>Income Date</label>

              <input
                type="date"
                name="incomeDate"
                value={formData.incomeDate}
                onChange={handleChange}
                required
              />

            </div>


            <div className="form-group">

              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Optional description"
                rows="3"
              />

            </div>


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


            <div className="expense-form-actions">

              <button
                type="submit"
                className="save-expense-button"
                disabled={submitting}
              >
                {submitting
                  ? 'Saving...'
                  : editingId
                    ? 'Update Income'
                    : 'Save Income'}
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


      {/* Filters */}

      <div className="expense-filters">

        <input
          type="text"
          placeholder="Search income..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />


        <select
          value={source}
          onChange={(e) =>
            setSource(e.target.value)
          }
        >

          {sourceOptions.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item === 'All'
                ? 'All Sources'
                : item}
            </option>
          ))}

        </select>

      </div>


      {/* Income List */}

      <div className="expense-list">

        {filteredIncome.length === 0 ? (

          <div className="empty-expenses">

            <div className="empty-icon">
              💰
            </div>

            <h3>
              No income found
            </h3>

            <p>
              Add your income to start
              tracking your finances.
            </p>

          </div>

        ) : (

          filteredIncome.map((income) => (

            <div
              className="expense-item"
              key={income.id}
            >

              <div className="expense-info">

                <div className="expense-category-icon">
                  {income.source === 'Salary'
                    ? '💼'
                    : income.source === 'Freelance'
                      ? '💻'
                      : income.source === 'Business'
                        ? '🏢'
                        : income.source === 'Investment'
                          ? '📈'
                          : '💰'}
                </div>


                <div>

                  <h3>
                    {income.title}
                  </h3>

                  <p>
                    {income.source}
                  </p>

                  <small>
                    {income.incomeDate}
                  </small>

                  {income.description && (
                    <small>
                      {income.description}
                    </small>
                  )}

                </div>

              </div>


              <div className="expense-actions">

                <strong className="income-amount">
                  + Rs.{' '}
                  {Number(income.amount).toFixed(2)}
                </strong>

                <button
                  className="edit-expense-button"
                  onClick={() =>
                    handleEdit(income)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-expense-button"
                  onClick={() =>
                    handleDelete(income.id)
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

export default Income