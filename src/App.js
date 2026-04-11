import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import PrivateRoute from './Components/Common/PrivateRoute.js';
import Login from './Pages/Login.js';
import Dashboard from './Pages/Dashboard.js';
import History from './Pages/History.js';
import Profile from './Pages/Profile.js';
import TodaysAttandance from "./Pages/Admin/TodaysAttandance.jsx"
import AdminDashboard from './Pages/Admin/AdminDashboard.jsx';
import MonthlyAttandance from './Pages/Admin/MonthlyAttandance.jsx';
import ApplicationForm from './Components/ApplicationForm/ApplicationForm.jsx';
import Unauthorized from './Pages/Unauthorized.jsx'; // Create this component

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Employee Routes - Accessible by all authenticated users */}
          <Route path="/dashboard/:id" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/history" element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          } />
          
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          
          <Route path="/dashboard/application-form/:id" element={
            <PrivateRoute>
              <ApplicationForm />
            </PrivateRoute>
          } />
          
          {/* Admin Routes - Only accessible by admin role */}
          <Route path='/admin/dashboard' element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          
          <Route path='/admin/dashboard/todays-attandance' element={
            <PrivateRoute allowedRoles={['admin']}>
              <TodaysAttandance />
            </PrivateRoute>
          } />
          
          <Route path='/admin/monthly-attandance' element={
            <PrivateRoute allowedRoles={['admin']}>
              <MonthlyAttandance />
            </PrivateRoute>
          } />
          
          {/* Manager Routes - If you have manager-specific routes */}
          <Route path='/manager/dashboard' element={
            <PrivateRoute allowedRoles={['admin', 'manager']}>
              {/* <ManagerDashboard /> */}
              <div>Manager Dashboard</div>
            </PrivateRoute>
          } />
          
          {/* Default route */}
          <Route path="/" element={<Login />} />
          
          {/* Catch all route - 404 */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;