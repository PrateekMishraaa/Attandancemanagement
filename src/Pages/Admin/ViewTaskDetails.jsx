import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../Components/AdminSidebar/Sidebar.jsx";
import axios from 'axios';

const ViewTaskDetails = () => {
    const navigate = useNavigate();
    const [viewTask, setViewTask] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);

    useEffect(() => {
        const fetchViewTask = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://localhost:3500/api/work/worklist');
                const tasks = response.data?.allwork || response.data?.tasks || response.data;
                console.log('Task with ID:', tasks[0]?._id);
                setViewTask(tasks || []);
            } catch (error) {
                console.error('Error:', error);
                setError(error.message);
                setViewTask([]);
            } finally {
                setLoading(false);
            }
        };
        fetchViewTask();
    }, []);

    const styles = {
        container: {
            display: 'flex',
            minHeight: '100vh',
            background: '#0d2818'
        },
        content: {
            flex: 1,
            padding: '30px 40px',
            overflowY: 'auto'
        },
        header: {
            marginBottom: '30px'
        },
        heading: {
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '10px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        },
        subtitle: {
            color: 'rgba(255,255,255,0.9)',
            fontSize: '16px'
        },
        statsContainer: {
            display: 'flex',
            gap: '20px',
            marginBottom: '30px',
            flexWrap: 'wrap'
        },
        statCard: {
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '15px 25px',
            color: 'white',
            textAlign: 'center',
            minWidth: '150px'
        },
        statNumber: {
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '5px'
        },
        statLabel: {
            fontSize: '14px',
            opacity: 0.9
        },
        cardGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '24px'
        },
        card: {
            background: 'white',
            borderRadius: '12px',
            padding: '0',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            cursor: 'pointer'
        },
        cardHeader: {
            background: 'white',
            padding: '20px',
            color: 'black'
        },
        projectName: {
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '8px'
        },
        projectIcon: {
            fontSize: '24px',
            marginRight: '10px'
        },
        cardBody: {
            padding: '20px'
        },
        infoRow: {
            display: 'flex',
            marginBottom: '15px',
            alignItems: 'flex-start'
        },
        label: {
            minWidth: '120px',
            fontWeight: '600',
            color: '#555',
            fontSize: '14px'
        },
        value: {
            color: '#333',
            fontSize: '14px',
            flex: 1,
            lineHeight: '1.5'
        },
        taskOverview: {
            background: '#f8f9fa',
            padding: '12px',
            borderRadius: '8px',
            marginTop: '10px',
            color: '#666',
            fontSize: '14px',
            lineHeight: '1.6'
        },
        buttonContainer: {
            padding: '20px',
            borderTop: '1px solid #e0e0e0',
            background: '#fafafa'
        },
        button: {
            width: '100%',
            padding: '12px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
        },
        loadingContainer: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '20px'
        },
        spinner: {
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        },
        loadingText: {
            color: 'white',
            fontSize: '18px'
        },
        errorContainer: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '20px'
        },
        errorCard: {
            background: 'white',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            maxWidth: '400px'
        },
        errorIcon: {
            fontSize: '48px',
            marginBottom: '20px'
        },
        errorTitle: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#e74c3c',
            marginBottom: '10px'
        },
        errorMessage: {
            color: '#666',
            marginBottom: '20px'
        },
        retryButton: {
            padding: '10px 20px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
        },
        emptyContainer: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        emptyCard: {
            background: 'white',
            borderRadius: '12px',
            padding: '60px',
            textAlign: 'center'
        },
        emptyIcon: {
            fontSize: '64px',
            marginBottom: '20px'
        },
        emptyTitle: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '10px'
        },
        emptyText: {
            color: '#666'
        }
    };

    // Add keyframes animation for spinner
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleSheet);

    const handleCardHover = (index) => {
        setHoveredCard(index);
    };

    const handleViewDetails = (id) => {
        navigate(`/admin/task-details/${id}`);
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <Sidebar />
                <div style={styles.loadingContainer}>
                    <div style={styles.spinner}></div>
                    <div style={styles.loadingText}>Loading tasks...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <Sidebar />
                <div style={styles.errorContainer}>
                    <div style={styles.errorCard}>
                        <div style={styles.errorIcon}>⚠️</div>
                        <div style={styles.errorTitle}>Error Loading Tasks</div>
                        <div style={styles.errorMessage}>{error}</div>
                        <button 
                            style={styles.retryButton}
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const totalTasks = viewTask.length;
    const recentTasks = viewTask.filter(task => {
        const taskDate = new Date(task.date);
        const today = new Date();
        const diffTime = Math.abs(today - taskDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    }).length;

    return (
        <div style={styles.container}>
            <Sidebar />
            <div style={styles.content}>
                <div style={styles.header}>
                    <h1 style={styles.heading}>Task Dashboard</h1>
                    <p style={styles.subtitle}>Manage and track all project tasks</p>
                </div>

                <div style={styles.statsContainer}>
                    <div style={styles.statCard}>
                        <div style={styles.statNumber}>{totalTasks}</div>
                        <div style={styles.statLabel}>Total Tasks</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statNumber}>{recentTasks}</div>
                        <div style={styles.statLabel}>Recent Tasks (7 days)</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statNumber}>
                            {viewTask.filter(task => task.taskOverview?.length > 50).length}
                        </div>
                        <div style={styles.statLabel}>Detailed Tasks</div>
                    </div>
                </div>

                {viewTask.length === 0 ? (
                    <div style={styles.emptyContainer}>
                        <div style={styles.emptyCard}>
                            <div style={styles.emptyIcon}>📋</div>
                            <div style={styles.emptyTitle}>No Tasks Found</div>
                            <div style={styles.emptyText}>There are no tasks available to display.</div>
                        </div>
                    </div>
                ) : (
                    <div style={styles.cardGrid}>
                        {viewTask.map((item, index) => (
                            <div 
                                key={item._id} 
                                style={{
                                    ...styles.card,
                                    transform: hoveredCard === index ? 'translateY(-5px)' : 'translateY(0)',
                                    boxShadow: hoveredCard === index 
                                        ? '0 8px 20px rgba(0,0,0,0.15)' 
                                        : '0 4px 6px rgba(0,0,0,0.1)'
                                }}
                                onMouseEnter={() => handleCardHover(index)}
                                onMouseLeave={() => handleCardHover(null)}
                            >
                                <div style={styles.cardHeader}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={styles.projectIcon}>📊</span>
                                        <div style={styles.projectName}>{item.project_name || 'Untitled Project'}</div>
                                    </div>
                                </div>
                                
                                <div style={styles.cardBody}>
                                    <div style={styles.infoRow}>
                                        <div style={styles.label}>📅 Date:</div>
                                        <div style={styles.value}>
                                            {new Date(item.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                    
                                    <div style={styles.infoRow}>
                                        <div style={styles.label}>📝 Task Overview:</div>
                                    </div>
                                    <div style={styles.taskOverview}>
                                        {item.taskOverview || 'No description provided'}
                                    </div>
                                </div>
                                
                                <div style={styles.buttonContainer}>
                                    <button 
                                        onClick={() => handleViewDetails(item._id)}
                                        style={styles.button}
                                        disabled
                                        onMouseEnter={(e) => {
                                            e.target.style.opacity = '0.9';
                                            e.target.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.opacity = '1';
                                            e.target.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        View Full Details →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewTaskDetails;