import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const cardStyle = {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '500px',
    width: '90%'
  };

  const iconStyle = {
    fontSize: '80px',
    marginBottom: '20px'
  };

  const titleStyle = {
    fontSize: '28px',
    color: '#e74c3c',
    marginBottom: '10px',
    fontWeight: '600'
  };

  const messageStyle = {
    fontSize: '16px',
    color: '#7f8c8d',
    marginBottom: '30px',
    lineHeight: '1.5'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center'
  };

  const buttonStyle = {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#3498db',
    color: '#fff'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#95a5a6',
    color: '#fff'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={iconStyle}>🔒</div>
        <div style={titleStyle}>Access Denied</div>
        <div style={messageStyle}>
          You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
        </div>
        <div style={buttonContainerStyle}>
          <button 
            style={primaryButtonStyle}
            onClick={() => navigate('/login')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
          >
            Go Back
          </button>
          <button 
            style={secondaryButtonStyle}
            onClick={() => navigate('/dashboard')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#7f8c8d'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#95a5a6'}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;