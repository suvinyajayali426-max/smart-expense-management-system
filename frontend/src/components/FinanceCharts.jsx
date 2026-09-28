import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'

function FinanceCharts({ expenses, incomes }) {

  // ==============================
  // EXPENSE CATEGORY DATA
  // ==============================

  const expenseCategoryData = expenses.reduce(
    (result, expense) => {

      const category = expense.category
      const amount = Number(expense.amount)

      const existingCategory = result.find(
        (item) => item.name === category
      )

      if (existingCategory) {
        existingCategory.value += amount
      } else {
        result.push({
          name: category,
          value: amount
        })
      }

      return result
    },
    []
  )


  // ==============================
  // INCOME SOURCE DATA
  // ==============================

  const incomeSourceData = incomes.reduce(
    (result, income) => {

      const source = income.source
      const amount = Number(income.amount)

      const existingSource = result.find(
        (item) => item.name === source
      )

      if (existingSource) {
        existingSource.value += amount
      } else {
        result.push({
          name: source,
          value: amount
        })
      }

      return result
    },
    []
  )


  // ==============================
  // MONTHLY DATA
  // ==============================

  const monthlyData = [
    {
      name: 'Income',
      amount: incomes.reduce(
        (total, income) =>
          total + Number(income.amount),
        0
      )
    },
    {
      name: 'Expenses',
      amount: expenses.reduce(
        (total, expense) =>
          total + Number(expense.amount),
        0
      )
    }
  ]


  // ==============================
  // COLORS
  // ==============================

  const COLORS = [
    '#2563eb',
    '#16a34a',
    '#f59e0b',
    '#dc2626',
    '#7c3aed',
    '#0891b2',
    '#db2777'
  ]


  return (
    <div className="finance-charts">

      {/* ==========================
          EXPENSE CATEGORY CHART
      =========================== */}

      <div className="chart-card">

        <div className="chart-header">

          <h2>
            Expenses by Category
          </h2>

          <p>
            See where your money is being spent.
          </p>

        </div>


        {expenseCategoryData.length === 0 ? (

          <div className="chart-empty">
            <p>
              No expense data available.
            </p>
          </div>

        ) : (

          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <PieChart>

                <Pie
                  data={expenseCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={105}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >

                  {expenseCategoryData.map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLORS[
                            index % COLORS.length
                          ]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip
                  formatter={(value) =>
                    `Rs. ${Number(value).toFixed(2)}`
                  }
                />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        )}

      </div>


      {/* ==========================
          INCOME SOURCE CHART
      =========================== */}

      <div className="chart-card">

        <div className="chart-header">

          <h2>
            Income by Source
          </h2>

          <p>
            See where your income comes from.
          </p>

        </div>


        {incomeSourceData.length === 0 ? (

          <div className="chart-empty">
            <p>
              No income data available.
            </p>
          </div>

        ) : (

          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <PieChart>

                <Pie
                  data={incomeSourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={105}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >

                  {incomeSourceData.map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLORS[
                            index % COLORS.length
                          ]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip
                  formatter={(value) =>
                    `Rs. ${Number(value).toFixed(2)}`
                  }
                />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        )}

      </div>


      {/* ==========================
          INCOME VS EXPENSES
      =========================== */}

      <div className="chart-card chart-card-wide">

        <div className="chart-header">

          <h2>
            Income vs Expenses
          </h2>

          <p>
            Compare your total income and expenses.
          </p>

        </div>


        <div className="chart-container">

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart
              data={monthlyData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip
                formatter={(value) =>
                  `Rs. ${Number(value).toFixed(2)}`
                }
              />

              <Legend />

              <Bar
                dataKey="amount"
                name="Amount"
                fill="#2563eb"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  )
}

export default FinanceCharts