import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/AdminSidebar/Sidebar';
import axios from "axios";
import Leaves from '../Leaves/Leaves.jsx';

const AdminDashboard = () => {
  const [openLeaves, setOpenLeaves] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    departments: {}
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://attendancemanagementbackend-oqfl.onrender.com/api/admin/employees');
        console.log('All employees:', response.data);
        
        if (response.data.success) {
          const employeesData = response.data.data;
          setEmployees(employeesData);
          
          const total = employeesData.length;
          const active = employeesData.filter(emp => emp.isActive === true).length;
          
          const deptMap = {};
          employeesData.forEach(emp => {
            const dept = emp.department || 'Unassigned';
            deptMap[dept] = (deptMap[dept] || 0) + 1;
          });
          
          setStats({
            total,
            active,
            departments: deptMap
          });
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const handleApproveLeaveClick = () => {
    setOpenLeaves(true);
  };

  const handleCloseModal = () => {
    setOpenLeaves(false);
  };

  const styles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .dashboard-container {
      display: flex;
      min-height: 100vh;
    }

    .sidebar-fixed {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      z-index: 1000;
    }

    .main-content {
      flex: 1;
      width: 100%;
      transition: margin-left 0.3s ease;
    }

    /* Top Navigation Bar */
    .top-navbar {
      background: white;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      border-bottom: 1px solid #e5e7eb;
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .navbar-content {
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .navbar-title h1 {
      font-size: 24px;
      font-weight: bold;
      color: #1f2937;
      margin: 0;
    }

    .navbar-title p {
      font-size: 14px;
      color: #6b7280;
      margin-top: 4px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-details {
      text-align: right;
    }

    .user-name {
      font-size: 14px;
      font-weight: 500;
      color: #374151;
    }

    .user-role {
      font-size: 12px;
      color: #6b7280;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #1e3c2c 0%, #0d2818 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 16px;
    }

    /* Content Area */
    .content-area {
      padding: 24px;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .stat-card {
      border-radius: 12px;
      padding: 24px;
      color: white;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .stat-card-blue {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    }

    .stat-card-green {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    }

    .stat-card-purple {
      background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
    }

    .stat-card-orange {
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    }

    .stat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .stat-label {
      font-size: 14px;
      opacity: 0.9;
    }

    .stat-value {
      font-size: 36px;
      font-weight: bold;
      margin-top: 8px;
    }

    .stat-icon {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon svg {
      width: 24px;
      height: 24px;
    }

    /* Department Section */
    .department-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      margin-bottom: 24px;
    }

    .department-title {
      font-size: 18px;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 16px;
    }

    .department-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .department-badge {
      background: #f3f4f6;
      border-radius: 8px;
      padding: 8px 16px;
    }

    .department-name {
      font-weight: 500;
      color: #374151;
    }

    .department-count {
      margin-left: 8px;
      color: #6b7280;
      font-weight: bold;
    }

    /* Employees Table */
    .employees-table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .table-header {
      padding: 16px 24px;
      border-bottom: 1px solid #e5e7eb;
    }

    .table-header h3 {
      font-size: 18px;
      font-weight: bold;
      color: #1f2937;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .employees-table {
      width: 100%;
      border-collapse: collapse;
    }

    .employees-table thead {
      background: #f9fafb;
    }

    .employees-table th {
      padding: 12px 24px;
      text-align: left;
      font-size: 12px;
      font-weight: 500;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .employees-table td {
      padding: 16px 24px;
      border-bottom: 1px solid #e5e7eb;
    }

    .employee-row {
      transition: background-color 0.2s;
    }

    .employee-row:hover {
      background: #f9fafb;
    }

    .employee-info {
      display: flex;
      align-items: center;
    }

    .employee-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1e3c2c 0%, #0d2818 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      font-weight: bold;
      margin-right: 12px;
    }

    .employee-id {
      font-size: 14px;
      font-weight: 500;
      color: #111827;
    }

    .employee-name {
      font-size: 14px;
      font-weight: 500;
      color: #111827;
    }

    .employee-phone {
      font-size: 12px;
      color: #6b7280;
      margin-top: 2px;
    }

    .employee-email {
      font-size: 14px;
      color: #4b5563;
    }

    .employee-department {
      font-size: 14px;
      color: #4b5563;
    }

    .role-badge {
      padding: 4px 8px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 500;
    }

    .role-admin {
      background: #f3e8ff;
      color: #9333ea;
    }

    .role-employee {
      background: #dbeafe;
      color: #2563eb;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-active {
      background: #dcfce7;
      color: #16a34a;
    }

    .status-inactive {
      background: #fee2e2;
      color: #dc2626;
    }

    .joining-date {
      font-size: 14px;
      color: #6b7280;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 48px;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 3px solid #e5e7eb;
      border-top-color: #16a34a;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      padding: 48px;
      color: #6b7280;
    }

    /* Modal/Popup Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(5px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      animation: fadeIn 0.3s ease;
    }

    .modal-content {
      background: white;
      border-radius: 16px;
      width: 90%;
      max-width: 1200px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      animation: slideIn 0.3s ease;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .modal-header {
      position: sticky;
      top: 0;
      background: white;
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
    }

    .modal-header h2 {
      font-size: 20px;
      font-weight: bold;
      color: #1f2937;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.2s ease;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
    }

    .close-btn:hover {
      background: #f3f4f6;
      color: #1f2937;
    }

    .modal-body {
      padding: 24px;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideIn {
      from {
        transform: translateY(-50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .navbar-content {
        padding: 12px 16px;
      }
      
      .navbar-title h1 {
        font-size: 18px;
      }
      
      .content-area {
        padding: 16px;
      }
      
      .employees-table th,
      .employees-table td {
        padding: 12px 16px;
      }

      .modal-content {
        width: 95%;
        max-height: 95vh;
      }

      .modal-header {
        padding: 16px 20px;
      }

      .modal-header h2 {
        font-size: 18px;
      }

      .modal-body {
        padding: 16px;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-container">
        {/* Sidebar */}
        <div className="sidebar-fixed">
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        </div>

        {/* Main Content */}
        <div 
          className="main-content"
          style={{ marginLeft: isMobile ? 0 : (sidebarOpen ? '280px' : '80px') }}
        >
          {/* Top Navigation Bar */}
          <div className="top-navbar">
            <div className="navbar-content">
              <div className="navbar-title">
                <h1>Employee Management</h1>
                <p>Manage and monitor all employees</p>
              </div>
              <div className="user-info">
                <div className="user-details">
                  <div className="user-name">Admin User</div>
                  <div className="user-role">Administrator</div>
                </div>
                <div className="user-avatar">A</div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="content-area">
            {/* Statistics Cards */}
            <div className="stats-grid">
              <div className="stat-card stat-card-blue">
                <div className="stat-header">
                  <div>
                    <div className="stat-label">Total Employees</div>
                    <div className="stat-value">{stats.total}</div>
                  </div>
                  <div className="stat-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="stat-card stat-card-green">
                <div className="stat-header">
                  <div>
                    <div className="stat-label">Active Employees</div>
                    <div className="stat-value">{stats.active}</div>
                  </div>
                  <div className="stat-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="stat-card stat-card-purple">
                <div className="stat-header">
                  <div>
                    <div className="stat-label">Departments</div>
                    <div className="stat-value">{Object.keys(stats.departments).length}</div>
                  </div>
                  <div className="stat-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="stat-card stat-card-orange">
                <div className="stat-header">
                  <div>
                    <div className="stat-label">Admin Users</div>
                    <div className="stat-value">{employees.filter(emp => emp.role === 'Admin').length}</div>
                  </div>
                  <div className="stat-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Distribution */}
            <div className="department-section">
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                flexWrap: "wrap",
                gap: "16px"
              }}>
                <h3 className="department-title" style={{ marginBottom: 0 }}>Department Distribution</h3>
                <button 
                  onClick={handleApproveLeaveClick}
                  style={{
                    background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                    color: "white",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(249, 115, 22, 0.2)",
                    letterSpacing: "0.3px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 12px rgba(249, 115, 22, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 4px rgba(249, 115, 22, 0.2)";
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Approve/Reject Leaves
                </button>
              </div>
              <div className="department-badges">
                {Object.entries(stats.departments).map(([dept, count]) => (
                  <div key={dept} className="department-badge">
                    <span className="department-name">{dept}:</span>
                    <span className="department-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Employees Table */}
            <div className="employees-table-container">
              <div className="table-header">
                <h3>All Employees</h3>
              </div>
              
              {loading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="employees-table">
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joining Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee, index) => (
                        <tr key={employee._id || index} className="employee-row">
                          <td>
                            <div className="employee-info">
                              <div className="employee-avatar">
                                {getInitials(employee.name)}
                              </div>
                              <span className="employee-id">{employee.employeeId}</span>
                            </div>
                          </td>
                          <td>
                            <div className="employee-name">{employee.name}</div>
                            <div className="employee-phone">{employee.phone}</div>
                          </td>
                          <td>
                            <div className="employee-email">{employee.email}</div>
                          </td>
                          <td>
                            <div className="employee-department">{employee.department || 'N/A'}</div>
                          </td>
                          <td>
                            <span className={`role-badge ${employee.role === 'Admin' ? 'role-admin' : 'role-employee'}`}>
                              {employee.role || 'Employee'}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${employee.isActive ? 'status-active' : 'status-inactive'}`}>
                              {employee.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <div className="joining-date">
                              {new Date(employee.joiningDate).toLocaleDateString()}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {employees.length === 0 && (
                    <div className="empty-state">
                      No employees found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal/Popup for Leaves */}
      {openLeaves && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', marginRight: '8px' }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Leave Requests Management
              </h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              <Leaves />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;