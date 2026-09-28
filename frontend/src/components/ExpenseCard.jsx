function ExpenseCard({title, amount, Category}) {
  return (
    <div className = "expense-card">
      <h3>{title}</h3>
      <p>Category: {Category}</p>
      <p>Amount: Rs. {amount}</p>
      
    </div>
  )
}

export default ExpenseCard