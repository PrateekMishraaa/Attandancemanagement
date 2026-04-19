import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import PrivateRoute from './Components/Common/PrivateRoute.js';
import Login from './Pages/Login.js';
import Dashboard from './Pages/Dashboard.js';
import History from './Pages/History.js';
import Profile from './Pages/Profile/Profile.jsx';
import TodaysAttandance from "./Pages/Admin/TodaysAttandance.jsx"
import AdminDashboard from './Pages/Admin/AdminDashboard.jsx';
import MonthlyAttandance from './Pages/Admin/MonthlyAttandance.jsx';
import ApplicationForm from './Components/ApplicationForm/ApplicationForm.jsx';
import Unauthorized from './Pages/Unauthorized.jsx'; // Create this component
import AddEmployee from './Pages/Admin/AddEmployee.jsx';
import ViewTaskDetails from './Pages/Admin/ViewTaskDetails.jsx';
import ViewEmployeeTask from './Pages/Admin/ViewEmployeeTask.jsx';
import Task from './Pages/Admin/Task.jsx';

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
          <Route path='/admin/add-employee' element={<PrivateRoute>
            <AddEmployee/>
          </PrivateRoute>}/>
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
            <PrivateRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          
          <Route path='/admin/dashboard/todays-attandance' element={
            <PrivateRoute allowedRoles={['Admin']}>
              <TodaysAttandance />
            </PrivateRoute>
          } />
          <Route path='/dashboard/profile/:id' element={<PrivateRoute>
              <Profile/>
          </PrivateRoute>}/>  
          <Route path='/admin/add-task' element={<PrivateRoute>
            <Task/>
          </PrivateRoute>}/>
          <Route path='/admin/monthly-attandance' element={
            <PrivateRoute allowedRoles={['Admin']}>
              <MonthlyAttandance />
            </PrivateRoute>
          } />
           <Route path='/admin/view-task-details' element={
            <PrivateRoute allowedRoles={['Admin']}>
              <ViewTaskDetails />
            </PrivateRoute>
          } />

             <Route path='/admin/task-details/:id' element={
            <PrivateRoute allowedRoles={['Admin']}>
              <ViewEmployeeTask />
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