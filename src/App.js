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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
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
          <Route path='/admin/dashboard' element={<PrivateRoute>
            <AdminDashboard/>
          </PrivateRoute>}/>
              <Route path='/admin/dashboard/todays-attandance' element={<PrivateRoute>
            <TodaysAttandance/>
          </PrivateRoute>}/>
          <Route path='/admin/monthly-attandance' element={<PrivateRoute>
            <MonthlyAttandance/>
          </PrivateRoute>}/>
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;