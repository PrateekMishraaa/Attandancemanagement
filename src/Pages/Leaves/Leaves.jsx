import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Leaves.css'; // We'll create this CSS file

const Leaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const FetchLeaves = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://attendancemanagementbackend-gg9v.onrender.com/api/leave/getAllLeaves');
                console.log('all pending leaves', response.data.allLeaves);
                setLeaves(response.data.allLeaves);
                setError(false);
            } catch (error) {
                console.log('error', error);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        FetchLeaves();
    }, []);

    const getStatusColor = (status) => {
        switch(status) {
            case 'Pending': return '#ff9800';
            case 'Approved': return '#4caf50';
            case 'Rejected': return '#f44336';
            default: return '#757575';
        }
    };

    const getStatusBgColor = (status) => {
        switch(status) {
            case 'Pending': return '#fff3e0';
            case 'Approved': return '#e8f5e9';
            case 'Rejected': return '#ffebee';
            default: return '#f5f5f5';
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Loading leave applications...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">⚠️</div>
                <p>Error fetching leaves. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="leaves-container">
            <div className="header">
                <h1>📋 Leave Applications</h1>
                <p className="subtitle">{leaves.length} application(s) found</p>
            </div>

            {leaves.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <p>No leave applications found</p>
                </div>
            ) : (
                <div className="cards-grid">
                    {leaves.map((item, index) => (
                        <div key={item._id || index} className="leave-card">
                            <div className="card-header">
                                <span className="employee-id">Employee #{item.Employeid.slice(-6)}</span>
                                <span 
                                    className="status-badge"
                                    style={{
                                        backgroundColor: getStatusBgColor(item.Status),
                                        color: getStatusColor(item.Status)
                                    }}
                                >
                                    {item.Status === 'Pending' && '⏳'}
                                    {item.Status === 'Approved' && '✅'}
                                    {item.Status === 'Rejected' && '❌'}
                                    {' '}{item.Status}
                                </span>
                            </div>

                            <div className="card-body">
                                <div className="date-range">
                                    <div className="date-box">
                                        <div className="date-label">FROM</div>
                                        <div className="date-value">
                                            {new Date(item.FromDate).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                    <div className="date-arrow">→</div>
                                    <div className="date-box">
                                        <div className="date-label">TO</div>
                                        <div className="date-value">
                                            {new Date(item.ToDate).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="leave-info">
                                    <div className="info-chip">
                                        <span className="chip-icon">📅</span>
                                        <span>{item.NumberOfDays} day(s)</span>
                                    </div>
                                    <div className="info-chip">
                                        <span className="chip-icon">🏷️</span>
                                        <span>{item.LeaveType}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer">
                                <button className="view-details-btn">Approve →</button>
                                  <button className="view-details-btn">Reject →</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Leaves;