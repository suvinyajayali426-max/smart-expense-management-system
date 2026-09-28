import { useEffect, useState } from 'react'
import api from '../api/axios'

function Reports() {

  const [expenses, setExpenses] = useState([])
  const [incomes, setIncomes] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  // =====================================
  // LOAD DATA
  // =====================================

  const loadReportData = async () => {

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
        'REPORT ERROR:',
        error
      )

      setError(
        error.response?.data?.message ||
        'Unable to load reports.'
      )

    } finally {

      setLoading(false)

    }
  }


  useEffect(() => {
    loadReportData()
  }, [])


  // =====================================
  // TOTALS
  // =====================================

  const totalIncome = incomes.reduce(
    (total, income) =>
      total + Number(income.amount),
    0
  )


  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount),
    0
  )


  const netBalance =
    totalIncome - totalExpenses


  // =====================================
  // EXPENSE BY CATEGORY
  // =====================================

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


  // =====================================
  // INCOME BY SOURCE
  // =====================================

  const incomeBySource =
    incomes.reduce(
      (result, income) => {

        const source =
          income.source

        const amount =
          Number(income.amount)

        if (result[source]) {

          result[source] += amount

        } else {

          result[source] = amount

        }

        return result

      },
      {}
    )


  // =====================================
  // RECENT TRANSACTIONS
  // =====================================

  const transactions = [

    ...expenses.map((expense) => ({
      id: `expense-${expense.id}`,
      type: 'Expense',
      title: expense.title,
      category: expense.category,
      amount: Number(expense.amount),
      date: expense.expenseDate
    })),

    ...incomes.map((income) => ({
      id: `income-${income.id}`,
      type: 'Income',
      title: income.title,
      category: income.source,
      amount: Number(income.amount),
      date: income.incomeDate
    }))

  ]

  const recentTransactions =
    transactions
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      )
      .slice(0, 10)


  // =====================================
  // CSV EXPORT
  // =====================================

  const exportCSV = () => {

    const headers = [
      'Type',
      'Title',
      'Category',
      'Amount',
      'Date'
    ]

    const rows =
      transactions.map(
        (transaction) => [
          transaction.type,
          transaction.title,
          transaction.category,
          transaction.amount.toFixed(2),
          transaction.date
        ]
      )


    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((value) =>
            `"${String(value).replaceAll('"', '""')}"`
          )
          .join(',')
      )
    ].join('\n')


    const blob = new Blob(
      [csvContent],
      {
        type: 'text/csv;charset=utf-8;'
      }
    )


    const url =
      URL.createObjectURL(blob)

    const link =
      document.createElement('a')

    link.href = url

    link.download =
      'smart-expense-report.csv'

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <section className="reports-page">

        <div className="dashboard-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading financial reports...
          </p>

        </div>

      </section>
    )
  }


  // =====================================
  // ERROR
  // =====================================

  if (error) {

    return (
      <section className="reports-page">

        <div className="dashboard-error-box">

          <h3>
            Something went wrong
          </h3>

          <p>
            {error}
          </p>

          <button
            onClick={loadReportData}
          >
            Try Again
          </button>

        </div>

      </section>
    )
  }


  // =====================================
  // UI
  // =====================================

  return (

    <section className="reports-page">

      {/* =================================
          HEADER
      ================================== */}

      <div className="reports-header">

        <div>

          <p className="dashboard-label">
            PERSONAL FINANCE
          </p>

          <h1>
            Financial Reports
          </h1>

          <p>
            Review your income, expenses and overall financial position.
          </p>

        </div>


        <button
          className="export-report-button"
          onClick={exportCSV}
        >
          ↓ Export CSV
        </button>

      </div>


      {/* =================================
          SUMMARY CARDS
      ================================== */}

      <div className="reports-summary">

        <div className="report-summary-card">

          <div className="report-icon">
            💰
          </div>

          <div>

            <span>
              Total Income
            </span>

            <strong>
              Rs. {totalIncome.toFixed(2)}
            </strong>

          </div>

        </div>


        <div className="report-summary-card">

          <div className="report-icon">
            💸
          </div>

          <div>

            <span>
              Total Expenses
            </span>

            <strong>
              Rs. {totalExpenses.toFixed(2)}
            </strong>

          </div>

        </div>


        <div className="report-summary-card">

          <div className="report-icon">
            📊
          </div>

          <div>

            <span>
              Net Balance
            </span>

            <strong
              className={
                netBalance >= 0
                  ? 'report-positive'
                  : 'report-negative'
              }
            >
              Rs. {netBalance.toFixed(2)}
            </strong>

          </div>

        </div>

      </div>


      {/* =================================
          EXPENSE SUMMARY
      ================================== */}

      <div className="report-grid">

        <div className="report-card">

          <div className="report-card-header">

            <h2>
              Expense Summary
            </h2>

            <p>
              Spending by category
            </p>

          </div>


          {Object.keys(
            expenseByCategory
          ).length === 0 ? (

            <div className="report-empty">
              No expense data available.
            </div>

          ) : (

            <div className="report-list">

              {Object.entries(
                expenseByCategory
              ).map(
                ([category, amount]) => (

                  <div
                    className="report-row"
                    key={category}
                  >

                    <div>

                      <span className="report-row-icon">
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

                    <strong>
                      Rs. {amount.toFixed(2)}
                    </strong>

                  </div>

                )
              )}

            </div>

          )}

        </div>


        {/* =================================
            INCOME SUMMARY
        ================================== */}

        <div className="report-card">

          <div className="report-card-header">

            <h2>
              Income Summary
            </h2>

            <p>
              Income by source
            </p>

          </div>


          {Object.keys(
            incomeBySource
          ).length === 0 ? (

            <div className="report-empty">
              No income data available.
            </div>

          ) : (

            <div className="report-list">

              {Object.entries(
                incomeBySource
              ).map(
                ([source, amount]) => (

                  <div
                    className="report-row"
                    key={source}
                  >

                    <div>

                      <span className="report-row-icon">
                        {source === 'Salary'
                          ? '💼'
                          : source === 'Freelance'
                            ? '💻'
                            : source === 'Business'
                              ? '🏢'
                              : source === 'Investment'
                                ? '📈'
                                : '💰'}
                      </span>

                      <strong>
                        {source}
                      </strong>

                    </div>

                    <strong>
                      Rs. {amount.toFixed(2)}
                    </strong>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>


      {/* =================================
          RECENT TRANSACTIONS
      ================================== */}

      <div className="report-card transactions-card">

        <div className="report-card-header">

          <h2>
            Recent Transactions
          </h2>

          <p>
            Your latest income and expenses
          </p>

        </div>


        {recentTransactions.length === 0 ? (

          <div className="report-empty">
            No transactions available.
          </div>

        ) : (

          <div className="transaction-list">

            {recentTransactions.map(
              (transaction) => (

                <div
                  className="transaction-row"
                  key={transaction.id}
                >

                  <div className="transaction-info">

                    <div
                      className={
                        transaction.type === 'Income'
                          ? 'transaction-icon income-transaction'
                          : 'transaction-icon expense-transaction'
                      }
                    >
                      {transaction.type === 'Income'
                        ? '↓'
                        : '↑'}
                    </div>


                    <div>

                      <h3>
                        {transaction.title}
                      </h3>

                      <p>
                        {transaction.category}
                        {' • '}
                        {transaction.date}
                      </p>

                    </div>

                  </div>


                  <strong
                    className={
                      transaction.type === 'Income'
                        ? 'transaction-income'
                        : 'transaction-expense'
                    }
                  >
                    {transaction.type === 'Income'
                      ? '+'
                      : '-'}
                    {' '}
                    Rs. {transaction.amount.toFixed(2)}
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

export default Reports