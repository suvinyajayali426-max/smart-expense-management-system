import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './pages/AdminDashboard'
import UserManagement from './pages/UserManagement'
import AdminRoute from './components/AdminRoute'
import Income from './pages/Income'
import Budget from './pages/Budget'
import Reports from './pages/Reports'

import Login from './pages/Login'
import Register from './pages/Register'
import Expenses from './pages/Expenses'


import './App.css'

function App() {

  return (

    <div>

      <Navbar />

      <Routes>

        {/* =========================
            DASHBOARD
        ========================= */}

        <Route
          path="/"
          element={
        <ProtectedRoute>
        <Dashboard />
        </ProtectedRoute>
          }
      />


        {/* =========================
            LOGIN
        ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =========================
            REGISTER
        ========================= */}

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================
            EXPENSES
        ========================= */}

        <Route
        path="/expenses"
        element={
        <ProtectedRoute>
         <Expenses />
        </ProtectedRoute>
       }
    />
      <Route
       path="/income"
      element={
      <ProtectedRoute>
      <Income />
    </ProtectedRoute>
     }
     />

     <Route
      path="/budget"
      element={
      <ProtectedRoute>
      <Budget />
    </ProtectedRoute>
     }
   />
       <Route
       path="/reports"
       element={
       <ProtectedRoute>
       <Reports />
     </ProtectedRoute>
    }
   />
        {/* ADMIN DASHBOARD */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />


        {/* USER MANAGEMENT */}

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
    </Routes>
    </div>

  )
}

export default App