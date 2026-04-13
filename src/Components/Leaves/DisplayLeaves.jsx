import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// API Service Configuration
const API_BASE_URL = ' http://localhost:3500/api';

// API Service Class
class LeaveService {
    // Get all leaves for a specific employee by employee ID
    static async getLeavesByEmployeeId(employeeId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/leave/employee/${employeeId}/all-leaves`);
            return response.data;
        } catch (error) {
            console.error('Error fetching employee leaves:', error);
            throw error;
        }
    }

    // Get single leave application by leave application ID
    static async getLeaveById(leaveId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/leave/employee-leave/${leaveId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching leave by ID:', error);
            throw error;
        }
    }

    // Get all leaves (admin)
    static async getAllLeaves() {
        try {
            const response = await axios.get(`${API_BASE_URL}/leave/getAllLeaves`);
            return response.data;
        } catch (error) {
            console.error('Error fetching all leaves:', error);
            throw error;
        }
    }

    // Update leave status
    static async updateLeaveStatus(leaveId, status) {
        try {
            const response = await axios.put(`${API_BASE_URL}/leave/update-leave/${leaveId}`, { Status: status });
            return response.data;
        } catch (error) {
            console.error('Error updating leave status:', error);
            throw error;
        }
    }

    // Create new leave application
    static async createLeaveApplication(employeeId, leaveData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/leave/employee/leave/${employeeId}`, leaveData);
            return response.data;
        } catch (error) {
            console.error('Error creating leave application:', error);
            throw error;
        }
    }
}

const DisplayLeaves = () => {
    const { id } = useParams(); // Can be employee ID or leave application ID
    const [leaves, setLeaves] = useState([]);
    const [singleLeave, setSingleLeave] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'single'
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [employeeId, setEmployeeId] = useState(null);
    console.log('this is employee id',employeeId)

    useEffect(() => {
        if (id) {
            // First try to fetch as employee ID to get all leaves
            fetchLeavesByEmployeeId(id);
        }
    }, [id]);

    // Function to fetch all leaves by employee ID using the API
    const fetchLeavesByEmployeeId = async (empId) => {
        setLoading(true);
        setError(false);
        try {
            console.log(`Fetching leaves for employee ID: ${empId}`);
            
            // Using the API service to get leaves by employee ID
            const response = await LeaveService.getLeavesByEmployeeId(empId);
            
            console.log('API Response:', response);
            
            if (response.success && response.data && response.data.length > 0) {
                setLeaves(response.data);
                setViewMode('list');
                setSingleLeave(null);
                setEmployeeId(empId);
            } else if (response.success && response.data && response.data.length === 0) {
                // No leaves found for this employee
                setLeaves([]);
                setViewMode('list');
                setError(false);
            } else {
                // If no leaves found, try to fetch as single leave application
                await fetchSingleLeaveById(empId);
            }
        } catch (error) {
            console.log('Not found as employee ID, trying as leave application ID...');
            await fetchSingleLeaveById(empId);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch single leave by leave application ID
    const fetchSingleLeaveById = async (leaveId) => {
        try {
            console.log(`Fetching leave application ID: ${leaveId}`);
            
            // Using the API service to get leave by ID
            const response = await LeaveService.getLeaveById(leaveId);
            
            if (response.success && response.data) {
                setSingleLeave(response.data);
                setViewMode('single');
                setLeaves([]);
            } else {
                setError(true);
            }
        } catch (error) {
            console.error('Error fetching leave application:', error);
            setError(true);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Pending': return '#ff9800';
            case 'Approved': return '#4caf50';
            case 'Rejected': return '#f44336';
            case 'Under Review': return '#2196f3';
            case 'Cancelled': return '#9e9e9e';
            default: return '#757575';
        }
    };

    const getStatusBgColor = (status) => {
        switch(status) {
            case 'Pending': return '#fff3e0';
            case 'Approved': return '#e8f5e9';
            case 'Rejected': return '#ffebee';
            case 'Under Review': return '#e3f2fd';
            case 'Cancelled': return '#f5f5f5';
            default: return '#f5f5f5';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateDays = (fromDate, toDate) => {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        const diffTime = Math.abs(to - from);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loader}></div>
                <p>Loading leave applications...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorIcon}>⚠️</div>
                <h3>No Leave Applications Found</h3>
                <p>No leave applications found for this employee or the application ID is invalid.</p>
                <Link to="/dashboard" style={styles.retryBtn}>
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    // Render single leave view
    if (viewMode === 'single' && singleLeave) {
        return (
            <SingleLeaveView 
                leave={singleLeave} 
                formatDate={formatDate}
                formatDateTime={formatDateTime}
                getStatusColor={getStatusColor}
                getStatusBgColor={getStatusBgColor}
                calculateDays={calculateDays}
            />
        );
    }

    // Render list of leaves view
    if (viewMode === 'list') {
        return (
            <LeavesListView 
                leaves={leaves}
                employeeId={employeeId}
                formatDate={formatDate}
                getStatusColor={getStatusColor}
                getStatusBgColor={getStatusBgColor}
                calculateDays={calculateDays}
            />
        );
    }

    return null;
};

// Component for single leave view
const SingleLeaveView = ({ leave, formatDate, formatDateTime, getStatusColor, getStatusBgColor, calculateDays }) => {
    return (
        <>
            <style>
                {`
                    .leave-detail-container {
                        max-width: 900px;
                        margin: 40px auto;
                        padding: 20px;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                        background: #f5f7fa;
                        min-height: 100vh;
                    }

                    .back-button {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        padding: 10px 20px;
                        background: white;
                        border: 1px solid #e0e0e0;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                        color: #666;
                        margin-bottom: 20px;
                        transition: all 0.2s;
                        text-decoration: none;
                    }

                    .back-button:hover {
                        background: #f5f5f5;
                        transform: translateX(-2px);
                    }

                    .main-card {
                        background: white;
                        border-radius: 16px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                        overflow: hidden;
                    }

                    .card-header {
                        padding: 24px 30px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                    }

                    .card-header h1 {
                        font-size: 28px;
                        margin-bottom: 10px;
                    }

                    .application-id {
                        font-size: 13px;
                        opacity: 0.9;
                        font-family: monospace;
                    }

                    .status-banner {
                        display: inline-block;
                        padding: 8px 20px;
                        border-radius: 50px;
                        font-size: 14px;
                        font-weight: 600;
                        margin-top: 15px;
                    }

                    .content-section {
                        padding: 30px;
                    }

                    .section {
                        margin-bottom: 30px;
                        border-bottom: 1px solid #e9ecef;
                        padding-bottom: 20px;
                    }

                    .section:last-child {
                        border-bottom: none;
                        margin-bottom: 0;
                        padding-bottom: 0;
                    }

                    .section-title {
                        font-size: 18px;
                        font-weight: 600;
                        color: #333;
                        margin-bottom: 20px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    .section-title .icon {
                        font-size: 22px;
                    }

                    .info-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 20px;
                    }

                    .info-item {
                        display: flex;
                        flex-direction: column;
                    }

                    .info-label {
                        font-size: 12px;
                        font-weight: 600;
                        color: #999;
                        text-transform: uppercase;
                        margin-bottom: 5px;
                    }

                    .info-value {
                        font-size: 16px;
                        color: #333;
                        font-weight: 500;
                    }

                    .date-range {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        background: #f8f9fa;
                        padding: 20px;
                        border-radius: 12px;
                        margin-top: 10px;
                    }

                    .date-box {
                        text-align: center;
                        flex: 1;
                    }

                    .date-label-small {
                        font-size: 11px;
                        font-weight: 600;
                        color: #999;
                        text-transform: uppercase;
                        margin-bottom: 5px;
                    }

                    .date-value-large {
                        font-size: 18px;
                        font-weight: 600;
                        color: #333;
                    }

                    .date-arrow {
                        font-size: 24px;
                        color: #ccc;
                        padding: 0 20px;
                    }

                    .reason-box {
                        background: #f8f9fa;
                        padding: 20px;
                        border-radius: 12px;
                        margin-top: 10px;
                    }

                    .reason-text {
                        font-size: 15px;
                        line-height: 1.6;
                        color: #555;
                    }

                    .chip-container {
                        display: flex;
                        gap: 10px;
                        flex-wrap: wrap;
                        margin-top: 10px;
                    }

                    .chip {
                        background: #f0f0f0;
                        padding: 8px 16px;
                        border-radius: 50px;
                        font-size: 14px;
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                    }

                    .chip-icon {
                        font-size: 16px;
                    }

                    .leave-balance {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 20px;
                        border-radius: 12px;
                        margin-top: 20px;
                    }

                    .balance-title {
                        font-size: 14px;
                        opacity: 0.9;
                        margin-bottom: 10px;
                    }

                    .balance-values {
                        display: flex;
                        gap: 30px;
                    }

                    .balance-item {
                        flex: 1;
                    }

                    .balance-label {
                        font-size: 12px;
                        opacity: 0.8;
                        margin-bottom: 5px;
                    }

                    .balance-value {
                        font-size: 24px;
                        font-weight: 700;
                    }

                    @media (max-width: 768px) {
                        .info-grid {
                            grid-template-columns: 1fr;
                            gap: 15px;
                        }

                        .date-range {
                            flex-direction: column;
                            gap: 15px;
                        }

                        .date-arrow {
                            transform: rotate(90deg);
                            padding: 10px 0;
                        }

                        .balance-values {
                            flex-direction: column;
                            gap: 15px;
                        }

                        .leave-detail-container {
                            padding: 15px;
                            margin: 20px auto;
                        }

                        .card-header {
                            padding: 20px;
                        }

                        .content-section {
                            padding: 20px;
                        }
                    }
                `}
            </style>

            <div className="leave-detail-container">
                <Link to="/dashboard" className="back-button">
                    ← Back to Dashboard
                </Link>

                <div className="main-card">
                    <div className="card-header">
                        <h1>Leave Application</h1>
                        <div className="application-id">Application ID: {leave._id}</div>
                        <div 
                            className="status-banner"
                            style={{
                                backgroundColor: getStatusBgColor(leave.Status),
                                color: getStatusColor(leave.Status)
                            }}
                        >
                            {leave.Status === 'Pending' && '⏳ Pending Review'}
                            {leave.Status === 'Approved' && '✅ Approved'}
                            {leave.Status === 'Rejected' && '❌ Rejected'}
                            {leave.Status === 'Under Review' && '📝 Under Review'}
                            {leave.Status === 'Cancelled' && '🚫 Cancelled'}
                        </div>
                    </div>

                    <div className="content-section">
                        <div className="section">
                            <div className="section-title">
                                <span className="icon">👤</span>
                                <span>Employee Information</span>
                            </div>
                            <div className="info-grid">
                                <div className="info-item">
                                    <div className="info-label">Employee Name</div>
                                    <div className="info-value">{leave.Employeid?.name || 'N/A'}</div>
                                </div>
                                <div className="info-item">
                                    <div className="info-label">Employee Code</div>
                                    <div className="info-value">{leave.Employeid?.employeeCode || 'N/A'}</div>
                                </div>
                                <div className="info-item">
                                    <div className="info-label">Email</div>
                                    <div className="info-value">{leave.Employeid?.email || 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="section">
                            <div className="section-title">
                                <span className="icon">📅</span>
                                <span>Leave Details</span>
                            </div>
                            
                            <div className="date-range">
                                <div className="date-box">
                                    <div className="date-label-small">From Date</div>
                                    <div className="date-value-large">{formatDate(leave.FromDate)}</div>
                                </div>
                                <div className="date-arrow">→</div>
                                <div className="date-box">
                                    <div className="date-label-small">To Date</div>
                                    <div className="date-value-large">{formatDate(leave.ToDate)}</div>
                                </div>
                            </div>

                            <div className="chip-container">
                                <div className="chip">
                                    <span className="chip-icon">🏷️</span>
                                    <span>{leave.LeaveType}</span>
                                </div>
                                <div className="chip">
                                    <span className="chip-icon">📊</span>
                                    <span>{calculateDays(leave.FromDate, leave.ToDate)} day(s)</span>
                                </div>
                                {leave.IsHalfDay && (
                                    <div className="chip">
                                        <span className="chip-icon">⏰</span>
                                        <span>Half Day ({leave.HalfDaySession})</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="section">
                            <div className="section-title">
                                <span className="icon">💬</span>
                                <span>Application Reason</span>
                            </div>
                            <div className="reason-box">
                                <div className="reason-text">{leave.ApplicationReason}</div>
                            </div>
                        </div>

                        {(leave.ContactNumberDuringLeave || leave.EmergencyContactPerson) && (
                            <div className="section">
                                <div className="section-title">
                                    <span className="icon">📞</span>
                                    <span>Contact Information</span>
                                </div>
                                <div className="info-grid">
                                    {leave.ContactNumberDuringLeave && (
                                        <div className="info-item">
                                            <div className="info-label">Contact During Leave</div>
                                            <div className="info-value">{leave.ContactNumberDuringLeave}</div>
                                        </div>
                                    )}
                                    {leave.EmergencyContactPerson && (
                                        <>
                                            <div className="info-item">
                                                <div className="info-label">Emergency Contact Person</div>
                                                <div className="info-value">{leave.EmergencyContactPerson}</div>
                                            </div>
                                            {leave.EmergencyContactNumber && (
                                                <div className="info-item">
                                                    <div className="info-label">Emergency Contact Number</div>
                                                    <div className="info-value">{leave.EmergencyContactNumber}</div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {(leave.TaskHandoverTo || leave.PendingWorkStatus) && (
                            <div className="section">
                                <div className="section-title">
                                    <span className="icon">💼</span>
                                    <span>Work Handover</span>
                                </div>
                                <div className="info-grid">
                                    {leave.TaskHandoverTo && (
                                        <div className="info-item">
                                            <div className="info-label">Task Handover To</div>
                                            <div className="info-value">{leave.TaskHandoverTo}</div>
                                        </div>
                                    )}
                                    {leave.PendingWorkStatus && (
                                        <div className="info-item">
                                            <div className="info-label">Pending Work Status</div>
                                            <div className="info-value">{leave.PendingWorkStatus}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {(leave.AvailableCasualLeave > 0 || leave.AvailableSickLeave > 0) && (
                            <div className="leave-balance">
                                <div className="balance-title">Available Leave Balance</div>
                                <div className="balance-values">
                                    <div className="balance-item">
                                        <div className="balance-label">Casual Leave</div>
                                        <div className="balance-value">{leave.AvailableCasualLeave} days</div>
                                    </div>
                                    <div className="balance-item">
                                        <div className="balance-label">Sick Leave</div>
                                        <div className="balance-value">{leave.AvailableSickLeave} days</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="section">
                            <div className="section-title">
                                <span className="icon">⏱️</span>
                                <span>Application Timeline</span>
                            </div>
                            <div className="info-grid">
                                <div className="info-item">
                                    <div className="info-label">Applied On</div>
                                    <div className="info-value">{formatDateTime(leave.ApplicationDate || leave.createdAt)}</div>
                                </div>
                                <div className="info-item">
                                    <div className="info-label">Last Updated</div>
                                    <div className="info-value">{formatDateTime(leave.updatedAt)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Component for list view of leaves
const LeavesListView = ({ leaves, employeeId, formatDate, getStatusColor, getStatusBgColor, calculateDays }) => {
    return (
        <>
            <style>
                {`
                    .leaves-list-container {
                        max-width: 1200px;
                        margin: 40px auto;
                        padding: 20px;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                        background: #f5f7fa;
                        min-height: 100vh;
                    }

                    .header-section {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 30px;
                        flex-wrap: wrap;
                        gap: 20px;
                    }

                    .header-section h1 {
                        font-size: 28px;
                        color: #333;
                        margin: 0;
                    }

                    .employee-id-badge {
                        background: #e3f2fd;
                        padding: 8px 16px;
                        border-radius: 8px;
                        font-size: 14px;
                        color: #1976d2;
                    }

                    .back-button {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        padding: 10px 20px;
                        background: white;
                        border: 1px solid #e0e0e0;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                        color: #666;
                        transition: all 0.2s;
                        text-decoration: none;
                    }

                    .back-button:hover {
                        background: #f5f5f5;
                        transform: translateX(-2px);
                    }

                    .stats-cards {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 20px;
                        margin-bottom: 30px;
                    }

                    .stat-card {
                        background: white;
                        padding: 20px;
                        border-radius: 12px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                        text-align: center;
                        transition: transform 0.2s;
                    }

                    .stat-card:hover {
                        transform: translateY(-2px);
                    }

                    .stat-number {
                        font-size: 32px;
                        font-weight: 700;
                        color: #667eea;
                        margin-bottom: 5px;
                    }

                    .stat-label {
                        font-size: 14px;
                        color: #666;
                    }

                    .leaves-table {
                        background: white;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    }

                    .leaves-table table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    .leaves-table th {
                        background: #f8f9fa;
                        padding: 15px;
                        text-align: left;
                        font-size: 14px;
                        font-weight: 600;
                        color: #666;
                        border-bottom: 2px solid #e9ecef;
                    }

                    .leaves-table td {
                        padding: 15px;
                        border-bottom: 1px solid #e9ecef;
                        color: #333;
                    }

                    .leaves-table tr:hover {
                        background: #f8f9fa;
                    }

                    .status-badge {
                        display: inline-block;
                        padding: 5px 12px;
                        border-radius: 50px;
                        font-size: 12px;
                        font-weight: 600;
                    }

                    .view-link {
                        color: #667eea;
                        text-decoration: none;
                        font-weight: 500;
                        transition: color 0.2s;
                    }

                    .view-link:hover {
                        color: #764ba2;
                        text-decoration: underline;
                    }

                    .no-data {
                        text-align: center;
                        padding: 60px;
                        color: #999;
                    }

                    .no-data-icon {
                        font-size: 64px;
                        margin-bottom: 20px;
                    }

                    .apply-leave-btn {
                        display: inline-block;
                        padding: 10px 20px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 500;
                        transition: transform 0.2s;
                    }

                    .apply-leave-btn:hover {
                        transform: translateY(-2px);
                    }

                    @media (max-width: 768px) {
                        .leaves-table {
                            overflow-x: auto;
                        }
                        
                        .leaves-table table {
                            min-width: 600px;
                        }
                        
                        .header-section {
                            flex-direction: column;
                            align-items: flex-start;
                        }
                    }
                `}
            </style>

            <div className="leaves-list-container">
                <div className="header-section">
                    <div>
                        <h1>My Leave Applications</h1>
                        {employeeId && (
                            <div className="employee-id-badge">
                                Employee ID: {employeeId}
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Link to={`/dashboard/application-form/:${employeeId}`} className="apply-leave-btn">
                            + Apply for Leave
                        </Link>
                        <Link to="/dashboard" className="back-button">
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>

                <div className="stats-cards">
                    <div className="stat-card">
                        <div className="stat-number">{leaves.length}</div>
                        <div className="stat-label">Total Applications</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{leaves.filter(l => l.Status === 'Approved').length}</div>
                        <div className="stat-label">Approved</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{leaves.filter(l => l.Status === 'Pending').length}</div>
                        <div className="stat-label">Pending</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{leaves.filter(l => l.Status === 'Rejected').length}</div>
                        <div className="stat-label">Rejected</div>
                    </div>
                </div>

                {leaves.length > 0 ? (
                    <div className="leaves-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Leave Type</th>
                                    <th>Duration</th>
                                    <th>From Date</th>
                                    <th>To Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaves.map((leave) => (
                                    <tr key={leave._id}>
                                        <td>{leave.LeaveType}</td>
                                        <td>{calculateDays(leave.FromDate, leave.ToDate)} days</td>
                                        <td>{formatDate(leave.FromDate)}</td>
                                        <td>{formatDate(leave.ToDate)}</td>
                                        <td>
                                            <span 
                                                className="status-badge"
                                                style={{
                                                    backgroundColor: getStatusBgColor(leave.Status),
                                                    color: getStatusColor(leave.Status)
                                                }}
                                            >
                                                {leave.Status}
                                            </span>
                                        </td>
                                        <td>
                                            {/* <Link to={`/leave/${leave._id}`} className="view-link">
                                                View Details →
                                            </Link> */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="leaves-table">
                        <div className="no-data">
                            <div className="no-data-icon">📋</div>
                            <h3>No Leave Applications Found</h3>
                            <p>You haven't submitted any leave applications yet.</p>
                            <Link to={`/dashboard/application-form/:${employeeId}`} className="apply-leave-btn" style={{ marginTop: '20px', display: 'inline-block' }}>
                                Apply for Leave
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

// Styles
const styles = {
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f5f7fa',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    loader: {
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #4f46e5',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
    },
    errorContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f5f7fa',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        textAlign: 'center',
        padding: '20px'
    },
    errorIcon: {
        fontSize: '64px',
        marginBottom: '20px'
    },
    retryBtn: {
        marginTop: '20px',
        padding: '10px 20px',
        background: '#4f46e5',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        textDecoration: 'none',
        display: 'inline-block'
    }
};

// Add keyframe animation for loader
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);

export default DisplayLeaves;