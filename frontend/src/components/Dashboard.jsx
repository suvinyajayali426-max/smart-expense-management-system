import { useEffect, useState } from 'react'
import api from '../api/axios'

function Dashboard() {

  const [expenses, setExpenses] = useState([])
  const [incomes, setIncomes] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  const loadDashboardData = async () => {

    try {

      setLoading(true)

      const [
        expenseResponse,
        incomeResponse
      ] = await Promise.all([
        api.get('/api/expenses'),
        api.get('/api/income')
      ])

      setExpenses(expenseResponse.data)
      setIncomes(incomeResponse.data)

      setError('')

    } catch (error) {

      console.error(
        'DASHBOARD ERROR:',
        error
      )

      if (error.response?.status === 401) {

        setError(
          'Your session has expired. Please login again.'
        )

      } else {

        setError(
          'Unable to load dashboard data.'
        )

      }

    } finally {

      setLoading(false)

    }
  }


  useEffect(() => {

    loadDashboardData()

  }, [])


  // ==========================================
  // TOTAL CALCULATIONS
  // ==========================================

  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount),
    0
  )


  const totalIncome = incomes.reduce(
    (total, income) =>
      total + Number(income.amount),
    0
  )


  const remainingBalance =
    totalIncome - totalExpenses


  // ==========================================
  // CURRENT MONTH
  // ==========================================

  const currentDate = new Date()

  const currentMonth =
    currentDate.getMonth()

  const currentYear =
    currentDate.getFullYear()


  const thisMonthExpenses =
    expenses
      .filter((expense) => {

        const expenseDate =
          new Date(expense.expenseDate)

        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        )

      })
      .reduce(
        (total, expense) =>
          total + Number(expense.amount),
        0
      )


  const thisMonthIncome =
    incomes
      .filter((income) => {

        const incomeDate =
          new Date(income.incomeDate)

        return (
          incomeDate.getMonth() === currentMonth &&
          incomeDate.getFullYear() === currentYear
        )

      })
      .reduce(
        (total, income) =>
          total + Number(income.amount),
        0
      )


  const thisMonthBalance =
    thisMonthIncome - thisMonthExpenses


  // ==========================================
  // RECENT EXPENSES
  // ==========================================

  const recentExpenses =
    [...expenses]
      .sort(
        (a, b) =>
          new Date(b.expenseDate) -
          new Date(a.expenseDate)
      )
      .slice(0, 5)


  // ==========================================
  // EXPENSE CATEGORY TOTALS
  // ==========================================

  const expenseByCategory =
    expenses.reduce(
      (result, expense) => {

        const category =
          expense.category

        const amount =
          Number(expense.amount)

        if (result[category]) {

          result[category] += amount

        } else {

          result[category] = amount

        }

        return result

      },
      {}
    )


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <section className="dashboard">

        <div className="dashboard-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading your dashboard...
          </p>

        </div>

      </section>

    )

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (

      <section className="dashboard">

        <div className="dashboard-error-box">

          <div className="error-icon">
            ⚠️
          </div>

          <h3>
            Something went wrong
          </h3>

          <p>
            {error}
          </p>

          <button
            onClick={loadDashboardData}
          >
            Try Again
          </button>

        </div>

      </section>

    )

  }


  // ==========================================
  // DASHBOARD UI
  // ==========================================

  return (

    <section className="dashboard">


      {/* ======================================
          HEADER
      ======================================= */}

      <div className="dashboard-header">

        <div>

          <p className="dashboard-label">
            PERSONAL FINANCE
          </p>

          <h1>
            Dashboard
          </h1>

          <p className="dashboard-subtitle">
            Here's an overview of your financial activity.
          </p>

        </div>


        <button
          className="dashboard-refresh-button"
          onClick={loadDashboardData}
        >
          ↻ Refresh
        </button>

      </div>


      {/* ======================================
          MAIN SUMMARY CARDS
      ======================================= */}

      <div className="summary-container">


        {/* TOTAL INCOME */}

        <div className="summary-card income-card">

          <div className="summary-icon income-icon">
            💰
          </div>

          <div className="summary-content">

            <span className="summary-label">
              Total Income
            </span>

            <h3>
              Rs. {totalIncome.toFixed(2)}
            </h3>

            <small>
              All recorded income
            </small>

          </div>

        </div>


        {/* TOTAL EXPENSES */}

        <div className="summary-card expense-card">

          <div className="summary-icon expense-icon">
            💸
          </div>

          <div className="summary-content">

            <span className="summary-label">
              Total Expenses
            </span>

            <h3>
              Rs. {totalExpenses.toFixed(2)}
            </h3>

            <small>
              All recorded expenses
            </small>

          </div>

        </div>


        {/* BALANCE */}

        <div
          className={`summary-card ${
            remainingBalance >= 0
              ? 'balance-card'
              : 'negative-balance-card'
          }`}
        >

          <div className="summary-icon balance-icon">
            💵
          </div>

          <div className="summary-content">

            <span className="summary-label">
              Remaining Balance
            </span>

            <h3>
              Rs. {remainingBalance.toFixed(2)}
            </h3>

            <small>
              {remainingBalance >= 0
                ? 'Available balance'
                : 'Expenses exceed income'}
            </small>

          </div>

        </div>


        {/* EXPENSE COUNT */}

        <div className="summary-card count-card">

          <div className="summary-icon count-icon">
            🧾
          </div>

          <div className="summary-content">

            <span className="summary-label">
              Total Expenses
            </span>

            <h3>
              {expenses.length}
            </h3>

            <small>
              Recorded transactions
            </small>

          </div>

        </div>


      </div>


      {/* ======================================
          MONTHLY OVERVIEW
      ======================================= */}

      <div className="dashboard-section-title">

        <div>

          <h2>
            Monthly Overview
          </h2>

          <p>
            Your financial activity for this month
          </p>

        </div>

      </div>


      <div className="monthly-overview">


        {/* MONTHLY INCOME */}

        <div className="monthly-card">

          <div className="monthly-card-top">

            <div className="monthly-icon monthly-income-icon">
              ↘
            </div>

            <span>
              Monthly Income
            </span>

          </div>

          <h3>
            Rs. {thisMonthIncome.toFixed(2)}
          </h3>

          <div className="monthly-line income-line"></div>

        </div>


        {/* MONTHLY EXPENSE */}

        <div className="monthly-card">

          <div className="monthly-card-top">

            <div className="monthly-icon monthly-expense-icon">
              ↗
            </div>

            <span>
              Monthly Expenses
            </span>

          </div>

          <h3>
            Rs. {thisMonthExpenses.toFixed(2)}
          </h3>

          <div className="monthly-line expense-line"></div>

        </div>


        {/* MONTHLY BALANCE */}

        <div className="monthly-card">

          <div className="monthly-card-top">

            <div className="monthly-icon monthly-balance-icon">
              =
            </div>

            <span>
              Monthly Balance
            </span>

          </div>

          <h3
            className={
              thisMonthBalance >= 0
                ? 'monthly-positive'
                : 'monthly-negative'
            }
          >
            Rs. {thisMonthBalance.toFixed(2)}
          </h3>

          <div className="monthly-line balance-line"></div>

        </div>


      </div>


      {/* ======================================
          FINANCIAL POSITION
      ======================================= */}

      <div className="dashboard-main-grid">


        {/* FINANCIAL POSITION */}

        <div className="financial-position-card">

          <div className="section-header">

            <div>

              <h2>
                Financial Position
              </h2>

              <p>
                Income compared with expenses
              </p>

            </div>

          </div>


          <div className="financial-position-content">


            {/* INCOME */}

            <div className="position-row">

              <div className="position-label">

                <span className="position-dot income-dot"></span>

                <span>
                  Income
                </span>

              </div>

              <strong>
                Rs. {totalIncome.toFixed(2)}
              </strong>

            </div>


            <div className="position-bar">

              <div
                className="position-bar-income"
                style={{
                  width:
                    totalIncome > 0
                      ? '100%'
                      : '0%'
                }}
              ></div>

            </div>


            {/* EXPENSE */}

            <div className="position-row">

              <div className="position-label">

                <span className="position-dot expense-dot"></span>

                <span>
                  Expenses
                </span>

              </div>

              <strong>
                Rs. {totalExpenses.toFixed(2)}
              </strong>

            </div>


            <div className="position-bar">

              <div
                className="position-bar-expense"
                style={{
                  width:
                    totalIncome > 0
                      ? `${Math.min(
                          (totalExpenses /
                            totalIncome) *
                            100,
                          100
                        )}%`
                      : '0%'
                }}
              ></div>

            </div>


            {/* BALANCE */}

            <div className="position-balance">

              <span>
                Remaining
              </span>

              <strong
                className={
                  remainingBalance >= 0
                    ? 'position-positive'
                    : 'position-negative'
                }
              >
                Rs. {remainingBalance.toFixed(2)}
              </strong>

            </div>

          </div>

        </div>


        {/* EXPENSE CATEGORIES */}

        <div className="financial-position-card">

          <div className="section-header">

            <div>

              <h2>
                Expense Categories
              </h2>

              <p>
                Where your money is going
              </p>

            </div>

          </div>


          {Object.keys(expenseByCategory).length === 0 ? (

            <div className="dashboard-empty-small">

              <div>
                🧾
              </div>

              <p>
                No expense categories yet.
              </p>

            </div>

          ) : (

            <div className="category-summary-list">

              {Object.entries(
                expenseByCategory
              )
                .sort(
                  ([, a], [, b]) =>
                    b - a
                )
                .slice(0, 5)
                .map(
                  ([category, amount]) => {

                    const percentage =
                      totalExpenses > 0
                        ? (
                            amount /
                            totalExpenses
                          ) * 100
                        : 0

                    return (

                      <div
                        className="category-summary-item"
                        key={category}
                      >

                        <div className="category-summary-top">

                          <div>

                            <span className="category-mini-icon">

                              {category === 'Food'
                                ? '🍔'
                                : category === 'Transport'
                                  ? '🚌'
                                  : category === 'Shopping'
                                    ? '🛍️'
                                    : category === 'Bills'
                                      ? '💡'
                                      : '💳'}

                            </span>

                            <strong>
                              {category}
                            </strong>

                          </div>

                          <span>
                            Rs. {amount.toFixed(2)}
                          </span>

                        </div>


                        <div className="category-progress">

                          <div
                            style={{
                              width:
                                `${percentage}%`
                            }}
                          ></div>

                        </div>

                      </div>

                    )

                  }
                )}

            </div>

          )}

        </div>


      </div>


      {/* ======================================
          RECENT EXPENSES
      ======================================= */}

      <div className="recent-expenses">

        <div className="section-header">

          <div>

            <h2>
              Recent Expenses
            </h2>

            <p>
              Your latest transactions
            </p>

          </div>

        </div>


        {recentExpenses.length === 0 ? (

          <div className="empty-expenses">

            <div className="empty-icon">
              🧾
            </div>

            <h3>
              No expenses yet
            </h3>

            <p>
              Start adding your expenses to see them here.
            </p>

          </div>

        ) : (

          <div className="recent-expense-container">

            {recentExpenses.map(
              (expense) => (

                <div
                  className="recent-expense-card"
                  key={expense.id}
                >


                  <div className="recent-expense-left">


                    <div className="expense-category-icon">

                      {expense.category === 'Food'
                        ? '🍔'
                        : expense.category === 'Transport'
                          ? '🚌'
                          : expense.category === 'Shopping'
                            ? '🛍️'
                            : expense.category === 'Bills'
                              ? '💡'
                              : '💳'}

                    </div>


                    <div>

                      <h3>
                        {expense.title}
                      </h3>

                      <p>
                        {expense.category}
                      </p>

                      <small>
                        {expense.expenseDate}
                      </small>

                    </div>


                  </div>


                  <strong>
                    - Rs. {Number(
                      expense.amount
                    ).toFixed(2)}
                  </strong>


                </div>

              )
            )}

          </div>

        )}

      </div>


    </section>

  )
}

export default Dashboard