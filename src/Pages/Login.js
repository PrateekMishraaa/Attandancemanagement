import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const {Employeid} = useParams();
  console.log('this is employee id ',Employeid)
  const [formData, setFormData] = useState({
    employeeId: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.password) {
      toast.error('Please enter Employee ID and Password');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://attendancemanagementbackend-oqfl.onrender.com/api/auth/login', formData, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded);
        
        toast.success(`Welcome ${user.name}! Redirecting...`, {
          duration: 2000,
          icon: '🎉',
        });
        
        setTimeout(() => {
          if (user.role === 'Admin' || user.role === 'Admin') {
            navigate('/admin/dashboard');
          } else if (user.role === 'Manager' || user.role === 'manager') {
            navigate('/manager-dashboard');
          } else {
            navigate(`/dashboard/:${decoded.id}`);
          }
        }, 2000);
      } else {
        toast.error(response.data.message || 'Login failed');
        setError(response.data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || '429 Opppssss Too Many Request Please Try after some time.';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #0f172a;
          }

          /* Main Container */
          .login-wrapper {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
            padding: 1rem;
            position: relative;
            overflow: hidden;
          }

          /* Animated Background Elements */
          .bg-blob {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.3;
            animation: float 20s infinite ease-in-out;
          }

          .blob-1 {
            width: 400px;
            height: 400px;
            background: #4f46e5;
            top: -100px;
            left: -100px;
          }

          .blob-2 {
            width: 500px;
            height: 500px;
            background: #7c3aed;
            bottom: -150px;
            right: -150px;
            animation-delay: -5s;
          }

          .blob-3 {
            width: 300px;
            height: 300px;
            background: #ec4899;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation-delay: -10s;
            opacity: 0.15;
          }

          @keyframes float {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(30px, -30px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }

          /* Login Card */
          .login-card {
            width: 100%;
            max-width: 440px;
            background: rgba(255, 255, 255, 0.98);
            border-radius: 32px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
            overflow: hidden;
            position: relative;
            z-index: 10;
            transition: transform 0.3s ease;
          }

          .login-card:hover {
            transform: translateY(-5px);
          }

          /* Header Section */
          .card-header {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%);
            padding: 32px 24px;
            text-align: center;
            position: relative;
          }

          .logo-wrapper {
            width: 70px;
            height: 70px;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          }

          .logo-icon {
            width: 38px;
            height: 38px;
            color: white;
          }

          .card-header h1 {
            font-size: 28px;
            font-weight: 700;
            color: white;
            margin-bottom: 6px;
            letter-spacing: -0.5px;
          }

          .card-header p {
            color: rgba(255, 255, 255, 0.85);
            font-size: 14px;
            font-weight: 500;
          }

          .version-badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(5px);
            padding: 4px 12px;
            border-radius: 50px;
            font-size: 11px;
            color: white;
            margin-top: 12px;
            font-weight: 500;
          }

          /* Form Section */
          .card-body {
            padding: 32px 28px;
          }

          .welcome-text h3 {
            font-size: 22px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 6px;
          }

          .welcome-text p {
            font-size: 13px;
            color: #64748b;
            margin-bottom: 24px;
          }

          /* Alert */
          .alert-error {
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border-left: 4px solid #ef4444;
            padding: 12px 16px;
            border-radius: 16px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 13px;
            color: #b91c1c;
            font-weight: 500;
          }

          .alert-error svg {
            flex-shrink: 0;
          }

          /* Form Groups */
          .input-group {
            margin-bottom: 20px;
          }

          .input-label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            font-weight: 600;
            color: #334155;
            margin-bottom: 8px;
          }

          .input-label svg {
            width: 16px;
            height: 16px;
            color: #4f46e5;
          }

          .input-field {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 20px;
            font-size: 14px;
            transition: all 0.2s;
            outline: none;
            background: #f8fafc;
            font-family: inherit;
          }

          .input-field:focus {
            border-color: #4f46e5;
            background: white;
            box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
          }

          .password-wrapper {
            position: relative;
          }

          .password-toggle {
            position: absolute;
            right: 14px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #94a3b8;
            display: flex;
            align-items: center;
            padding: 4px;
          }

          .password-toggle:hover {
            color: #4f46e5;
          }

          /* Login Button */
          .login-button {
            width: 100%;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            font-weight: 700;
            font-size: 16px;
            padding: 14px;
            border: none;
            border-radius: 40px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 8px;
            font-family: inherit;
            position: relative;
            overflow: hidden;
          }

          .login-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
          }

          .login-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .button-content {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }

          .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          /* Divider */
          .divider {
            display: flex;
            align-items: center;
            margin: 24px 0;
          }

          .divider-line {
            flex: 1;
            height: 1px;
            background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
          }

          .divider-text {
            padding: 0 12px;
            font-size: 11px;
            color: #94a3b8;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          /* Footer Links */
          .footer-links {
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: center;
            margin-top: 20px;
          }

          @media (min-width: 480px) {
            .footer-links {
              flex-direction: row;
              justify-content: space-between;
            }
          }

          .footer-link {
            color: #4f46e5;
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
            transition: color 0.2s;
          }

          .footer-link:hover {
            color: #7c3aed;
            text-decoration: underline;
          }

          /* Copyright */
          .copyright {
            margin-top: 28px;
            text-align: center;
            color: #94a3b8;
            font-size: 11px;
            padding-top: 20px;
            border-top: 1px solid #f1f5f9;
          }

          .copyright a {
            color: #4f46e5;
            text-decoration: none;
          }

          .copyright a:hover {
            text-decoration: underline;
          }

          /* Location Badge */
          .location-badge {
            margin-top: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            font-size: 11px;
            color: #64748b;
            background: #f1f5f9;
            padding: 8px 16px;
            border-radius: 50px;
            width: fit-content;
            margin-left: auto;
            margin-right: auto;
          }

          .location-badge svg {
            width: 12px;
            height: 12px;
          }
        `}
      </style>

      <div className="login-wrapper">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        <div className="bg-blob blob-3"></div>

        <div className="login-card">
          {/* Header */}
          <div className="card-header">
            <div className="logo-wrapper">
              <svg className="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1>Attendance System</h1>
            <p>Secure Employee Portal</p>
            <span className="version-badge">Version 2.0</span>
          </div>

          {/* Form */}
          <div className="card-body">
            <div className="welcome-text">
              <h3>Welcome Back!</h3>
              <p>Please login to continue</p>
            </div>

            {error && (
              <div className="alert-error">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Employee ID Field */}
              <div className="input-group">
                <label className="input-label">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Employee ID
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your employee ID"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="input-group">
                <label className="input-label">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Password
                </label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your password"
                    required
                  />
                  <button type="button" className="password-toggle" onClick={handleTogglePassword}>
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button type="submit" disabled={loading} className="login-button">
                <div className="button-content">
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                      </svg>
                      <span>Let me in!</span>
                    </>
                  )}
                </div>
              </button>

              {/* Divider */}
              <div className="divider">
                <div className="divider-line"></div>
                <span className="divider-text">Secure Access</span>
                <div className="divider-line"></div>
              </div>

              {/* Footer Links */}
              {/* <div className="footer-links">
                <a href="" className="footer-link">Not registered? Register</a>
                <a href="#" className="footer-link">Forgot Password</a>
              </div> */}

              {/* Location Badge */}
              <div className="location-badge">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Location verification enabled for attendance</span>
              </div>

              {/* Copyright */}
              <div className="copyright">
                Copyright © 2020 | Create by <a href="#">connectwithdev.com</a>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '15px',
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4caf50',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
};

export default Login;