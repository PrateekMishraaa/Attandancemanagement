import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Leaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [updateStatus, setUpdateStatus] = useState('');
    const [updateRemarks, setUpdateRemarks] = useState('');

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://attendancemanagementbackend-oqfl.onrender.com/api/leave/getAllLeaves');
            console.log('All leaves:', response.data);
            setLeaves(response.data.data || response.data.allLeaves || []);
            setError(false);
        } catch (error) {
            console.error('Error fetching leaves:', error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateLeave = async (leaveId, newStatus) => {
        if (!leaveId) {
            alert('Invalid leave application');
            return;
        }

        setUpdatingId(leaveId);
        
        try {
            const response = await axios.put(
                `https://attendancemanagementbackend-oqfl.onrender.com/api/leave/update-leave/${leaveId}`,
                { 
                    Status: newStatus,
                    Remarks: updateRemarks
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log('Leave updated successfully:', response.data);
            alert(`Leave ${newStatus.toLowerCase()} successfully!`);
            
            await fetchLeaves();
            setShowModal(false);
            setSelectedLeave(null);
            setUpdateRemarks('');
            
        } catch (error) {
            console.error('Error updating leave:', error);
            
            if (error.response) {
                const errorMessage = error.response.data?.message || 'Failed to update leave status';
                alert(errorMessage);
                console.error('Error details:', error.response.data);
            } else if (error.request) {
                alert('Network error. Please check your connection.');
            } else {
                alert('Something went wrong. Please try again.');
            }
        } finally {
            setUpdatingId(null);
        }
    };

    const openUpdateModal = (leave, status) => {
        setSelectedLeave(leave);
        setUpdateStatus(status);
        setShowModal(true);
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

    if (loading) {
        return (
            <LoadingContainer>
                <Loader></Loader>
                <LoadingText>Loading leave applications...</LoadingText>
            </LoadingContainer>
        );
    }

    if (error) {
        return (
            <ErrorContainer>
                <ErrorIcon>⚠️</ErrorIcon>
                <ErrorMessage>Error fetching leaves. Please try again later.</ErrorMessage>
                <RetryButton onClick={fetchLeaves}>Retry</RetryButton>
            </ErrorContainer>
        );
    }

    return (
        <>
            <LeavesContainer>
                <Header>
                    <Title>📋 Leave Applications</Title>
                    <Subtitle>{leaves.length} application(s) found</Subtitle>
                </Header>

                {leaves.length === 0 ? (
                    <EmptyState>
                        <EmptyIcon>📭</EmptyIcon>
                        <EmptyText>No leave applications found</EmptyText>
                    </EmptyState>
                ) : (
                    <CardsGrid>
                        {leaves.map((item) => (
                            <LeaveCard key={item._id}>
                                <CardHeader>
                                    <EmployeeInfo>
                                        <EmployeeName>
                                            {item.Employeid?.name || 'Employee'}
                                        </EmployeeName>
                                        <EmployeeId>
                                            ID: {item.Employeid?.employeeCode || item.Employeid?._id?.slice(-6) || 'N/A'}
                                        </EmployeeId>
                                    </EmployeeInfo>
                                    <StatusBadge 
                                        style={{
                                            backgroundColor: getStatusBgColor(item.Status),
                                            color: getStatusColor(item.Status)
                                        }}
                                    >
                                        {item.Status === 'Pending' && '⏳'}
                                        {item.Status === 'Approved' && '✅'}
                                        {item.Status === 'Rejected' && '❌'}
                                        {item.Status === 'Under Review' && '📝'}
                                        {item.Status === 'Cancelled' && '🚫'}
                                        {' '}{item.Status}
                                    </StatusBadge>
                                </CardHeader>

                                <CardBody>
                                    <DateRange>
                                        <DateBox>
                                            <DateLabel>FROM</DateLabel>
                                            <DateValue>{formatDate(item.FromDate)}</DateValue>
                                        </DateBox>
                                        <DateArrow>→</DateArrow>
                                        <DateBox>
                                            <DateLabel>TO</DateLabel>
                                            <DateValue>{formatDate(item.ToDate)}</DateValue>
                                        </DateBox>
                                    </DateRange>

                                    <LeaveInfo>
                                        <InfoChip>
                                            <ChipIcon>📅</ChipIcon>
                                            <span>{item.NumberOfDays || 'N/A'} day(s)</span>
                                        </InfoChip>
                                        <InfoChip>
                                            <ChipIcon>🏷️</ChipIcon>
                                            <span>{item.LeaveType}</span>
                                        </InfoChip>
                                        {item.IsHalfDay && (
                                            <InfoChip>
                                                <ChipIcon>⏰</ChipIcon>
                                                <span>Half Day ({item.HalfDaySession})</span>
                                            </InfoChip>
                                        )}
                                    </LeaveInfo>

                                    <ReasonSection>
                                        <ReasonLabel>Reason:</ReasonLabel>
                                        <ReasonText>{item.ApplicationReason}</ReasonText>
                                    </ReasonSection>
                                </CardBody>

                                <CardFooter>
                                    {item.Status === 'Pending' || item.Status === 'Under Review' ? (
                                        <>
                                            <ApproveButton 
                                                onClick={() => openUpdateModal(item, 'Approved')}
                                                disabled={updatingId === item._id}
                                            >
                                                {updatingId === item._id ? 'Processing...' : '✅ Approve'}
                                            </ApproveButton>
                                            <RejectButton 
                                                onClick={() => openUpdateModal(item, 'Rejected')}
                                                disabled={updatingId === item._id}
                                            >
                                                {updatingId === item._id ? 'Processing...' : '❌ Reject'}
                                            </RejectButton>
                                            <ReviewButton 
                                                onClick={() => openUpdateModal(item, 'Under Review')}
                                                disabled={updatingId === item._id}
                                            >
                                                📝 Review
                                            </ReviewButton>
                                        </>
                                    ) : (
                                        <AlreadyProcessed>
                                            Already {item.Status.toLowerCase()}
                                        </AlreadyProcessed>
                                    )}
                                </CardFooter>
                            </LeaveCard>
                        ))}
                    </CardsGrid>
                )}
            </LeavesContainer>

            {/* Update Modal */}
            {showModal && selectedLeave && (
                <ModalOverlay onClick={() => setShowModal(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>Update Leave Application</ModalTitle>
                            <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
                        </ModalHeader>
                        
                        <ModalBody>
                            <LeaveSummary>
                                <SummaryText><strong>Employee:</strong> {selectedLeave.Employeid?.name || 'N/A'}</SummaryText>
                                <SummaryText><strong>Leave Type:</strong> {selectedLeave.LeaveType}</SummaryText>
                                <SummaryText><strong>Duration:</strong> {formatDate(selectedLeave.FromDate)} to {formatDate(selectedLeave.ToDate)}</SummaryText>
                                <SummaryText><strong>Reason:</strong> {selectedLeave.ApplicationReason}</SummaryText>
                            </LeaveSummary>

                            <UpdateSection>
                                <UpdateLabel>Change Status to:</UpdateLabel>
                                <StatusOptions>
                                    <StatusOption 
                                        className={updateStatus === 'Approved' ? 'selected-approved' : ''}
                                        onClick={() => setUpdateStatus('Approved')}
                                    >
                                        ✅ Approved
                                    </StatusOption>
                                    <StatusOption 
                                        className={updateStatus === 'Rejected' ? 'selected-rejected' : ''}
                                        onClick={() => setUpdateStatus('Rejected')}
                                    >
                                        ❌ Rejected
                                    </StatusOption>
                                    <StatusOption 
                                        className={updateStatus === 'Under Review' ? 'selected-review' : ''}
                                        onClick={() => setUpdateStatus('Under Review')}
                                    >
                                        📝 Under Review
                                    </StatusOption>
                                </StatusOptions>

                                <RemarksSection>
                                    <UpdateLabel>Remarks (Optional):</UpdateLabel>
                                    <RemarksInput
                                        rows="3"
                                        placeholder="Add any comments or remarks..."
                                        value={updateRemarks}
                                        onChange={(e) => setUpdateRemarks(e.target.value)}
                                    />
                                </RemarksSection>
                            </UpdateSection>
                        </ModalBody>

                        <ModalFooter>
                            <CancelButton onClick={() => setShowModal(false)}>
                                Cancel
                            </CancelButton>
                            <ConfirmButton 
                                onClick={() => handleUpdateLeave(selectedLeave._id, updateStatus)}
                                disabled={updatingId === selectedLeave._id}
                            >
                                {updatingId === selectedLeave._id ? 'Updating...' : `Confirm ${updateStatus}`}
                            </ConfirmButton>
                        </ModalFooter>
                    </ModalContent>
                </ModalOverlay>
            )}
        </>
    );
};

// Styled Components with Style Tag approach
const styleTag = `
    .selected-approved {
        border-color: #4caf50 !important;
        background: #e8f5e9 !important;
    }
    
    .selected-rejected {
        border-color: #f44336 !important;
        background: #ffebee !important;
    }
    
    .selected-review {
        border-color: #2196f3 !important;
        background: #e3f2fd !important;
    }
`;

// Inject styles into document head
const StyleInjector = () => {
    React.useEffect(() => {
        const style = document.createElement('style');
        style.textContent = styleTag;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);
    return null;
};

// Styled component definitions using inline styles
const LeavesContainer = ({ children }) => (
    <>
        <StyleInjector />
        <div style={styles.leavesContainer}>
            {children}
        </div>
    </>
);

const Header = ({ children }) => <div style={styles.header}>{children}</div>;
const Title = ({ children }) => <h1 style={styles.title}>{children}</h1>;
const Subtitle = ({ children }) => <p style={styles.subtitle}>{children}</p>;

const CardsGrid = ({ children }) => <div style={styles.cardsGrid}>{children}</div>;

const LeaveCard = ({ children }) => <div style={styles.leaveCard}>{children}</div>;

const CardHeader = ({ children }) => <div style={styles.cardHeader}>{children}</div>;

const EmployeeInfo = ({ children }) => <div style={styles.employeeInfo}>{children}</div>;
const EmployeeName = ({ children }) => <span style={styles.employeeName}>{children}</span>;
const EmployeeId = ({ children }) => <span style={styles.employeeId}>{children}</span>;

const StatusBadge = ({ children, style }) => (
    <span style={{ ...styles.statusBadge, ...style }}>{children}</span>
);

const CardBody = ({ children }) => <div style={styles.cardBody}>{children}</div>;

const DateRange = ({ children }) => <div style={styles.dateRange}>{children}</div>;
const DateBox = ({ children }) => <div style={styles.dateBox}>{children}</div>;
const DateLabel = ({ children }) => <div style={styles.dateLabel}>{children}</div>;
const DateValue = ({ children }) => <div style={styles.dateValue}>{children}</div>;
const DateArrow = ({ children }) => <div style={styles.dateArrow}>{children}</div>;

const LeaveInfo = ({ children }) => <div style={styles.leaveInfo}>{children}</div>;
const InfoChip = ({ children }) => <div style={styles.infoChip}>{children}</div>;
const ChipIcon = ({ children }) => <span style={styles.chipIcon}>{children}</span>;

const ReasonSection = ({ children }) => <div style={styles.reasonSection}>{children}</div>;
const ReasonLabel = ({ children }) => <div style={styles.reasonLabel}>{children}</div>;
const ReasonText = ({ children }) => <div style={styles.reasonText}>{children}</div>;

const CardFooter = ({ children }) => <div style={styles.cardFooter}>{children}</div>;

const ApproveButton = ({ children, onClick, disabled }) => (
    <button style={styles.approveBtn} onClick={onClick} disabled={disabled}>{children}</button>
);

const RejectButton = ({ children, onClick, disabled }) => (
    <button style={styles.rejectBtn} onClick={onClick} disabled={disabled}>{children}</button>
);

const ReviewButton = ({ children, onClick, disabled }) => (
    <button style={styles.reviewBtn} onClick={onClick} disabled={disabled}>{children}</button>
);

const AlreadyProcessed = ({ children }) => <div style={styles.alreadyProcessed}>{children}</div>;

// Loading and Error styles
const LoadingContainer = ({ children }) => <div style={styles.loadingContainer}>{children}</div>;
const Loader = () => <div style={styles.loader}></div>;
const LoadingText = ({ children }) => <p style={styles.loadingText}>{children}</p>;

const ErrorContainer = ({ children }) => <div style={styles.errorContainer}>{children}</div>;
const ErrorIcon = ({ children }) => <div style={styles.errorIcon}>{children}</div>;
const ErrorMessage = ({ children }) => <p style={styles.errorMessage}>{children}</p>;
const RetryButton = ({ children, onClick }) => (
    <button style={styles.retryBtn} onClick={onClick}>{children}</button>
);

const EmptyState = ({ children }) => <div style={styles.emptyState}>{children}</div>;
const EmptyIcon = ({ children }) => <div style={styles.emptyIcon}>{children}</div>;
const EmptyText = ({ children }) => <p style={styles.emptyText}>{children}</p>;

// Modal styles
const ModalOverlay = ({ children, onClick }) => (
    <div style={styles.modalOverlay} onClick={onClick}>{children}</div>
);

const ModalContent = ({ children, onClick }) => (
    <div style={styles.modalContent} onClick={onClick}>{children}</div>
);

const ModalHeader = ({ children }) => <div style={styles.modalHeader}>{children}</div>;
const ModalTitle = ({ children }) => <h2 style={styles.modalTitle}>{children}</h2>;
const CloseButton = ({ children, onClick }) => (
    <button style={styles.closeBtn} onClick={onClick}>{children}</button>
);

const ModalBody = ({ children }) => <div style={styles.modalBody}>{children}</div>;
const LeaveSummary = ({ children }) => <div style={styles.leaveSummary}>{children}</div>;
const SummaryText = ({ children }) => <p style={styles.summaryText}>{children}</p>;

const UpdateSection = ({ children }) => <div style={styles.updateSection}>{children}</div>;
const UpdateLabel = ({ children }) => <label style={styles.updateLabel}>{children}</label>;

const StatusOptions = ({ children }) => <div style={styles.statusOptions}>{children}</div>;
const StatusOption = ({ children, onClick, className }) => (
    <button 
        style={styles.statusOption} 
        onClick={onClick}
        className={className}
    >
        {children}
    </button>
);

const RemarksSection = ({ children }) => <div style={styles.remarksSection}>{children}</div>;
const RemarksInput = ({ rows, placeholder, value, onChange }) => (
    <textarea 
        style={styles.remarksInput}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
    />
);

const ModalFooter = ({ children }) => <div style={styles.modalFooter}>{children}</div>;
const CancelButton = ({ children, onClick }) => (
    <button style={styles.cancelBtn} onClick={onClick}>{children}</button>
);

const ConfirmButton = ({ children, onClick, disabled }) => (
    <button style={styles.confirmBtn} onClick={onClick} disabled={disabled}>{children}</button>
);

// All styles defined as a JavaScript object
const styles = {
    leavesContainer: {
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif'
    },
    header: {
        marginBottom: '30px',
        textAlign: 'center'
    },
    title: {
        color: '#333',
        marginBottom: '10px'
    },
    subtitle: {
        color: '#666',
        fontSize: '14px'
    },
    cardsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: '20px'
    },
    leaveCard: {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s'
    },
    cardHeader: {
        padding: '16px 20px',
        background: '#f8f9fa',
        borderBottom: '1px solid #e9ecef',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    employeeInfo: {
        display: 'flex',
        flexDirection: 'column'
    },
    employeeName: {
        fontWeight: 600,
        color: '#333',
        fontSize: '16px'
    },
    employeeId: {
        fontSize: '12px',
        color: '#666',
        marginTop: '2px'
    },
    statusBadge: {
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: 500
    },
    cardBody: {
        padding: '20px'
    },
    dateRange: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        gap: '10px'
    },
    dateBox: {
        flex: 1,
        textAlign: 'center'
    },
    dateLabel: {
        fontSize: '11px',
        fontWeight: 600,
        color: '#999',
        textTransform: 'uppercase',
        marginBottom: '5px'
    },
    dateValue: {
        fontSize: '14px',
        color: '#333',
        fontWeight: 500
    },
    dateArrow: {
        color: '#999',
        fontSize: '18px'
    },
    leaveInfo: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        marginBottom: '15px'
    },
    infoChip: {
        background: '#f0f0f0',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },
    chipIcon: {
        fontSize: '14px'
    },
    reasonSection: {
        background: '#f8f9fa',
        padding: '12px',
        borderRadius: '8px',
        marginTop: '10px'
    },
    reasonLabel: {
        fontSize: '11px',
        fontWeight: 600,
        color: '#999',
        textTransform: 'uppercase',
        marginBottom: '5px'
    },
    reasonText: {
        fontSize: '13px',
        color: '#555',
        lineHeight: 1.4
    },
    cardFooter: {
        padding: '16px 20px',
        background: '#f8f9fa',
        borderTop: '1px solid #e9ecef',
        display: 'flex',
        gap: '10px'
    },
    approveBtn: {
        flex: 1,
        padding: '8px 12px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer',
        background: '#4caf50',
        color: 'white',
        transition: 'all 0.2s'
    },
    rejectBtn: {
        flex: 1,
        padding: '8px 12px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer',
        background: '#f44336',
        color: 'white',
        transition: 'all 0.2s'
    },
    reviewBtn: {
        flex: 1,
        padding: '8px 12px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer',
        background: '#2196f3',
        color: 'white',
        transition: 'all 0.2s'
    },
    alreadyProcessed: {
        flex: 1,
        textAlign: 'center',
        padding: '8px',
        background: '#e9ecef',
        borderRadius: '6px',
        fontSize: '13px',
        color: '#666'
    },
    loadingContainer: {
        textAlign: 'center',
        padding: '60px 20px'
    },
    loader: {
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
    },
    loadingText: {
        color: '#666'
    },
    errorContainer: {
        textAlign: 'center',
        padding: '60px 20px'
    },
    errorIcon: {
        fontSize: '48px',
        marginBottom: '20px'
    },
    errorMessage: {
        color: '#f44336',
        marginBottom: '20px'
    },
    retryBtn: {
        padding: '10px 20px',
        background: '#2196f3',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px'
    },
    emptyIcon: {
        fontSize: '64px',
        marginBottom: '20px'
    },
    emptyText: {
        color: '#999',
        fontSize: '16px'
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modalContent: {
        background: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto'
    },
    modalHeader: {
        padding: '20px',
        borderBottom: '1px solid #e9ecef',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    modalTitle: {
        margin: 0,
        fontSize: '20px'
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        fontSize: '28px',
        cursor: 'pointer',
        color: '#999'
    },
    modalBody: {
        padding: '20px'
    },
    leaveSummary: {
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px'
    },
    summaryText: {
        margin: '8px 0',
        fontSize: '14px'
    },
    updateSection: {
        marginTop: '20px'
    },
    updateLabel: {
        display: 'block',
        fontWeight: 600,
        marginBottom: '10px',
        color: '#333'
    },
    statusOptions: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px'
    },
    statusOption: {
        flex: 1,
        padding: '10px',
        border: '2px solid #e0e0e0',
        background: 'white',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    remarksSection: {
        marginTop: '20px'
    },
    remarksInput: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontFamily: 'inherit',
        resize: 'vertical'
    },
    modalFooter: {
        padding: '20px',
        borderTop: '1px solid #e9ecef',
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end'
    },
    cancelBtn: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        background: '#e0e0e0',
        color: '#333'
    },
    confirmBtn: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        background: '#2196f3',
        color: 'white'
    }
};

// Add keyframes for animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .selected-approved {
        border-color: #4caf50 !important;
        background: #e8f5e9 !important;
    }
    
    .selected-rejected {
        border-color: #f44336 !important;
        background: #ffebee !important;
    }
    
    .selected-review {
        border-color: #2196f3 !important;
        background: #e3f2fd !important;
    }
    
    button:hover:not(:disabled) {
        opacity: 0.9;
        transform: translateY(-1px);
    }
    
    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .leave-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
`;
document.head.appendChild(styleSheet);

export default Leaves;