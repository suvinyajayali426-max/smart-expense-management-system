# Smart Expense & Personal Finance Management System

A full-stack web application for managing personal income, expenses, budgets, and financial reports.

## 📌 Project Overview

The Smart Expense & Personal Finance Management System helps users manage their personal finances in one place.

Users can:

- Register and login securely
- Manage personal expenses
- Manage income
- Set and manage monthly budgets
- View financial summaries
- Generate financial reports
- Export reports as CSV files

The system also includes an Admin Dashboard for administrators to manage users and view system-level information.

---

## 🚀 Features

### User Features

- User Registration
- User Login
- JWT Authentication
- Role-Based Authorization
- Expense Management
  - Add expense
  - View expenses
  - Update expense
  - Delete expense
  - Search expenses
  - Filter expenses by category
- Income Management
  - Add income
  - View income
  - Update income
  - Delete income
  - Search income
  - Filter income by source
- Budget Management
  - Add monthly budget
  - View budgets
  - Update budget
  - Delete budget
- Financial Dashboard
- Financial Reports
- CSV Report Export
- Responsive UI

### Admin Features

- Admin Dashboard
- View total users
- User Management
- View users
- Update users
- Delete users
- Role-based access control

---

## 🛠️ Technologies Used

### Frontend

- React
- Vite
- JavaScript
- Axios
- React Router
- CSS

### Backend

- Java
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- Maven

### Database

- PostgreSQL

### Development Tools

- Visual Studio Code
- IntelliJ IDEA / VS Code
- Postman
- Git
- GitHub

---

## 🏗️ Project Structure

```text
SmartExpense
│
├── backend
│   ├── src
│   │   └── main
│   │       ├── java
│   │       └── resources
│   ├── pom.xml
│   └── mvnw.cmd
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── pages
│   │   ├── assets
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md