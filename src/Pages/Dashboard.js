import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import DisplayLeaves from '../Components/Leaves/DisplayLeaves';

const Dashboard = () => {
  const navigate = useNavigate();
  const loginToken = localStorage.getItem('token');
  const [tokenData, setTokenData] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  console.log('this is current time',currentTime)
  const [currentDate, setCurrentDate] = useState('');
  const [todayStatus, setTodayStatus] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(true);
  const [locationPermission, setLocationPermission] = useState(null);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [streakCount, setStreakCount] = useState(0);
  const [monthlyStats, setMonthlyStats] = useState({ present: 0, absent: 0, late: 0 });
  const [workingHours, setWorkingHours] = useState(0);

  // Office Timings Configuration
  const GRACE_PERIOD_MINUTES = 15;

  const API_BASE_URL = 'https://attendancemanagementbackend-gg9v.onrender.com/api';

  // Define updateDateTime first (before useEffect)
  const updateDateTime = useCallback(() => {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }));
    setCurrentDate(now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }, []);

  // Define checkConnection with cleanup
  const checkConnection = useCallback(() => {
    setConnectionStatus(navigator.onLine);
    
    const handleOnline = () => setConnectionStatus(true);
    const handleOffline = () => setConnectionStatus(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Define fetchTodayStatus (before useEffect that uses it)
  const fetchTodayStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await axios.get(`${API_BASE_URL}/attendance/today`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setTodayStatus(response.data.data);
        if (response.data.data?.workingHours) {
          setWorkingHours(response.data.data.workingHours);
        }
      }
    } catch (error) {
      console.error('Error fetching today status:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [navigate, API_BASE_URL]);

  // Define fetchMonthlyStats


const handleNavigate=()=>{
  navigate(`/dashboard/application-form/${tokenData.id}`)
}

  const fetchMonthlyStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await axios.get(`${API_BASE_URL}/attendance/monthly-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setMonthlyStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
    }
  }, [API_BASE_URL]);

  // Define fetchStreakCount
  const fetchStreakCount = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await axios.get(`${API_BASE_URL}/attendance/streak`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setStreakCount(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching streak:', error);
    }
  }, [API_BASE_URL]);

  // Set greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Initial data fetch effect
  useEffect(() => {
    const fetchUserTokenData = async () => {
      try {
        if (loginToken) {
          const decodedToken = await jwtDecode(loginToken);
          setTokenData(decodedToken);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.log('error', error);
        navigate('/login');
      }
    };
    fetchUserTokenData();
    fetchMonthlyStats();
    fetchStreakCount();
  }, [loginToken, navigate, fetchMonthlyStats, fetchStreakCount]);

  // Main effect for real-time updates
  useEffect(() => {
    fetchTodayStatus();
    const cleanupConnection = checkConnection();
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    
    return () => {
      clearInterval(timer);
      if (cleanupConnection) cleanupConnection();
    };
  }, [fetchTodayStatus, checkConnection, updateDateTime]);

  const isCheckInAllowed = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;
    const startTimeInMinutes = 10 * 60;
    const endTimeInMinutes = 19 * 60;
    
    if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes) {
      return { allowed: true, message: '' };
    } else if (currentTimeInMinutes < startTimeInMinutes) {
      return { allowed: false, message: `Office starts at 10:00 AM. Please wait until office hours to check in.` };
    } else {
      return { allowed: false, message: `Office hours ended at 7:00 PM. You cannot check in now.` };
    }
  };

  const isCheckOutAllowed = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;
    const startTimeInMinutes = 10 * 60;
    const endTimeInMinutes = 20 * 60;
    
    if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes) {
      return { allowed: true, message: '' };
    } else if (currentTimeInMinutes < startTimeInMinutes) {
      return { allowed: false, message: `You haven't checked in yet. Office starts at 10:00 AM.` };
    } else {
      return { allowed: false, message: `Office closed at 7:00 PM. Please check out before that time.` };
    }
  };

  const isLate = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;
    const startTimeInMinutes = 10 * 60;
    const graceTimeInMinutes = startTimeInMinutes + GRACE_PERIOD_MINUTES;
    return currentTimeInMinutes > graceTimeInMinutes;
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission(true);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setLocationPermission(false);
          let errorMessage = 'Location access denied';
          if (error.code === 1) errorMessage = 'Please allow location permission';
          if (error.code === 2) errorMessage = 'Location unavailable';
          if (error.code === 3) errorMessage = 'Location request timeout';
          reject(new Error(errorMessage));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const handleProceedWithWarning = () => {
    if (pendingAction === 'checkin') {
      handleCheckIn();
    }
  };

  const handleCheckInClick = () => {
    const timeCheck = isCheckInAllowed();
    if (!timeCheck.allowed) {
      toast.error('⏰ ' + timeCheck.message);
      return;
    }
    if (isLate()) {
      setPendingAction('checkin');
      setShowTimeWarning(true);
    } else {
      handleCheckIn();
    }
  };

  const handleCheckOutClick = () => {
    const timeCheck = isCheckOutAllowed();
    if (!timeCheck.allowed) {
      toast.error('⏰ ' + timeCheck.message);
      return;
    }
    handleCheckOut();
  };

  const handleCheckIn = async () => {
    setLocationLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('❌ Please login first');
        navigate('/login');
        return;
      }
      const location = await getCurrentLocation();
      console.log('this is current location',location)
      console.log('this is current location',location)
      const response = await axios.post(`${API_BASE_URL}/attendance/checkin`, {
        latitude: location.latitude,
        longitude: location.longitude,
        time:location.time
      }, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } });
      
      if (response.data.success) {
        toast.success('✅ ' + response.data.message);
        fetchTodayStatus();
        fetchMonthlyStats();
        fetchStreakCount();
      } else {
        toast.error('❌ ' + response.data.message);
      }
    } catch (error) {
      let errorMessage = 'Failed to mark check-in';
      if (error.response?.data?.message) errorMessage = error.response.data.message;
      else if (error.message) errorMessage = error.message;
      toast.error('❌ ' + errorMessage);
    } finally {
      setLocationLoading(false);
      setShowTimeWarning(false);
      setPendingAction(null);
    }
  };

  const handleCheckOut = async () => {
    setLocationLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('❌ Please login first');
        navigate('/login');
        return;
      }
      const location = await getCurrentLocation();
      const response = await axios.post(`${API_BASE_URL}/attendance/checkout`, {
        latitude: location.latitude,
        longitude: location.longitude
      }, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } });
      
      if (response.data.success) {
        toast.success('✅ ' + response.data.message);
        fetchTodayStatus();
        fetchMonthlyStats();
      } else {
        toast.error('❌ ' + response.data.message);
      }
    } catch (error) {
      let errorMessage = 'Failed to mark check-out';
      if (error.response?.data?.message) errorMessage = error.response.data.message;
      else if (error.message) errorMessage = error.message;
      toast.error('❌ ' + errorMessage);
    } finally {
      setLocationLoading(false);
    }
  };

  const isCheckedIn = todayStatus?.checkInTime ? true : false;
  const isCheckedOut = todayStatus?.checkOutTime ? true : false;
  const checkInTime = todayStatus?.checkInTime;
  const checkOutTime = todayStatus?.checkOutTime;
  const status = todayStatus?.status;

  const getMotivationalMessage = () => {
    if (!isCheckedIn) return "Start your day strong! 💪";
    if (isCheckedIn && !isCheckedOut) return "Great progress! Keep going! 🚀";
    return "Amazing work today! 🌟";
  };

  const getProductivityPercentage = () => {
    return Math.min((workingHours / 9) * 100, 100);
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
            background: #f5f7fa;
          }

          /* Dashboard Container */
          .dashboard-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
            padding: 24px 20px;
          }

          .dashboard-content {
            max-width: 1200px;
            margin: 0 auto;
          }

          /* Navbar */
          .navbar {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            padding: 16px 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 100;
          }

          .navbar-brand {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .navbar-brand svg {
            width: 32px;
            height: 32px;
            color: #667eea;
          }

          .navbar-brand h2 {
            color: white;
            font-size: 20px;
            font-weight: 600;
          }

          .navbar-user {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .user-name {
            color: #e2e8f0;
            font-weight: 500;
          }

          .logout-btn {
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid rgba(239, 68, 68, 0.5);
            color: #f87171;
            padding: 8px 20px;
            border-radius: 40px;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: 500;
          }

          .logout-btn:hover {
            background: rgba(239, 68, 68, 0.4);
            transform: translateY(-2px);
          }

          /* Alert */
          .alert-offline {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 12px 20px;
            border-radius: 16px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 12px;
            color: #92400e;
          }

          /* Welcome Section */
          .welcome-section {
            text-align: center;
            margin-bottom: 32px;
          }

          .greeting {
            font-size: 36px;
            font-weight: 700;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            margin-bottom: 8px;
          }

          .welcome-name {
            font-size: 20px;
            color: #334155;
            margin-bottom: 8px;
          }

          .current-date {
            color: #64748b;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          /* Time Card */
          .time-card {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            border-radius: 40px;
            padding: 40px;
            text-align: center;
            color: white;
            margin-bottom: 32px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          }

          .time-display {
            font-size: 64px;
            font-weight: 700;
            font-family: monospace;
            letter-spacing: 4px;
            margin: 16px 0;
          }

          @media (max-width: 768px) {
            .time-display {
              font-size: 40px;
            }
          }

          .date-display {
            font-size: 18px;
            opacity: 0.9;
            margin-bottom: 24px;
          }

          .office-chips {
            display: flex;
            justify-content: center;
            gap: 12px;
            flex-wrap: wrap;
          }

          .chip {
            background: rgba(255, 255, 255, 0.15);
            padding: 6px 16px;
            border-radius: 30px;
            font-size: 12px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }

          /* Stats Grid */
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
          }

          .stat-card {
            background: white;
            border-radius: 24px;
            padding: 20px;
            transition: all 0.3s;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          }

          .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          }

          .stat-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .stat-title {
            font-size: 13px;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .stat-value {
            font-size: 36px;
            font-weight: 700;
            margin-top: 8px;
          }

          .stat-sub {
            font-size: 12px;
            color: #94a3b8;
            margin-top: 4px;
          }

          .stat-icon {
            width: 60px;
            height: 60px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          /* Progress Bar */
          .progress-bar {
            margin-top: 16px;
            height: 8px;
            background: #e2e8f0;
            border-radius: 10px;
            overflow: hidden;
          }

          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4f46e5, #7c3aed);
            border-radius: 10px;
            transition: width 0.3s;
          }

          /* Action Buttons Grid */
          .actions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
          }

          .action-card {
            border-radius: 32px;
            padding: 32px;
            text-align: center;
            color: white;
            transition: all 0.3s;
          }

          .action-card:hover {
            transform: translateY(-8px);
          }

          .checkin-card {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          }

          .checkout-card {
            background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
          }

          .action-icon {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
          }

          .action-icon svg {
            width: 40px;
            height: 40px;
          }

          .action-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
          }

          .action-subtitle {
            opacity: 0.9;
            margin-bottom: 16px;
          }

          .action-chips {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 24px;
            flex-wrap: wrap;
          }

          .action-chip {
            background: rgba(255, 255, 255, 0.2);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
          }

          .action-btn {
            width: 100%;
            background: white;
            border: none;
            padding: 14px;
            border-radius: 50px;
            font-weight: 700;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s;
          }

          .checkin-btn {
            color: #4f46e5;
          }

          .checkout-btn {
            color: #ec4899;
          }

          .action-btn:hover:not(:disabled) {
            transform: scale(1.02);
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
          }

          .action-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .checkin-status {
            margin-top: 16px;
            font-size: 12px;
            opacity: 0.9;
          }

          /* Stats Paper */
          .stats-paper {
            background: white;
            border-radius: 28px;
            padding: 24px;
            margin-top: 32px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          }

          .stats-title {
            font-size: 20px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 20px;
            color: #1e293b;
          }

          .monthly-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            text-align: center;
          }

          .monthly-stat-value {
            font-size: 32px;
            font-weight: 700;
          }

          .present-value {
            color: #22c55e;
          }

          .absent-value {
            color: #ef4444;
          }

          .late-value {
            color: #f59e0b;
          }

          /* Security Notice */
          .security-notice {
            background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(124, 58, 237, 0.05));
            border-radius: 20px;
            padding: 16px 20px;
            margin-top: 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 16px;
          }

          .security-text {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          /* Modal */
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .modal-content {
            background: white;
            border-radius: 24px;
            max-width: 400px;
            width: 90%;
            overflow: hidden;
          }

          .modal-header {
            padding: 20px 24px;
            background: #fff3e0;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .modal-body {
            padding: 24px;
          }

          .modal-footer {
            padding: 16px 24px;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            border-top: 1px solid #e2e8f0;
          }

          .btn-cancel {
            padding: 10px 20px;
            border: 1px solid #cbd5e1;
            background: white;
            border-radius: 40px;
            cursor: pointer;
          }

          .btn-proceed {
            padding: 10px 20px;
            background: #f59e0b;
            color: white;
            border: none;
            border-radius: 40px;
            cursor: pointer;
          }

          /* Spinner */
          .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid white;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
            display: inline-block;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .btn-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid currentColor;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
          }
        `}
      </style>

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h2>Attendance System</h2>
        </div>
        <div className="navbar-user">
          <span className="user-name">{tokenData?.name || 'Employee'}</span>
          <button className="logout-btn" onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
            toast.success('Logged out successfully');
          }}>Logout</button>
        </div>
      </nav>
       
      <div className="dashboard-container">
        <div className="dashboard-content">
          {/* Offline Alert */}
          {!connectionStatus && (
            <div className="alert-offline">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18.36 6.64A9 9 0 0 1 20.77 15M6.16 6.16a9 9 0 1 0 12.68 12.68M12 2v4M2 2l20 20" />
                <path d="M12 12v.01" />
              </svg>
              <span>You are offline. Please check your internet connection.</span>
            </div>
          )}

          {/* Welcome Section */}
          <div className="welcome-section">
          <div>
  <button 
    style={{
      height: "45px",
      width: "200px",
      padding: "10px 20px",
      cursor: "pointer",
      border: "none",
      borderRadius: "40px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      fontSize: "16px",
      fontWeight: "bold",
      letterSpacing: "1px",
      transition: "all 0.3s ease",
      animation: "blink 1.5s ease-in-out infinite",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
      position: "relative",
      overflow: "hidden"
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = "scale(1.05)";
      e.target.style.animation = "none";
    }}
    onClick={handleNavigate}
    onMouseLeave={(e) => {
      e.target.style.transform = "scale(1)";
      e.target.style.animation = "blink 1.5s ease-in-out infinite";
    }}
  >
    Apply For Leave
  </button>
  
  <style>
    {`
      @keyframes blink {
        0% {
          opacity: 1;
          box-shadow: 0 0 5px rgba(102, 126, 234, 0.5);
        }
        50% {
          opacity: 0.9;
          box-shadow: 0 0 20px rgba(102, 126, 234, 0.8);
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }
        100% {
          opacity: 1;
          box-shadow: 0 0 5px rgba(102, 126, 234, 0.5);
        }
      }
    `}
  </style>
</div>

            <h1 className="greeting">{greeting}!</h1>
            <p className="welcome-name">Welcome back, {tokenData?.name || 'Employee'} 👋</p>
            <p className="current-date">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {currentDate}
            </p>
          </div>

          {/* Time Card */}
          <div className="time-card">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto' }}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <div className="time-display">{currentTime}</div>
            <div className="date-display">{currentDate}</div>
            <div className="office-chips">
              <span className="chip">🕐 Opens: 10:00 AM</span>
              <span className="chip">⏹️ Closes: 7:00 PM</span>
              <span className="chip">⏱️ Grace: 15 min</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <div>
                  <div className="stat-title">Today's Status</div>
                  <div className="stat-value" style={{ color: isCheckedIn ? (status === 'late' ? '#f59e0b' : '#22c55e') : '#ef4444' }}>
                    {isCheckedIn ? (status === 'late' ? 'Late' : 'Present') : 'Absent'}
                  </div>
                  <div className="stat-sub">{isCheckedIn ? `In: ${checkInTime}` : 'Not marked yet'}</div>
                </div>
                <div className="stat-icon" style={{ background: isCheckedIn ? (status === 'late' ? '#f59e0b20' : '#22c55e20') : '#ef444420' }}>
                  {isCheckedIn ? (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={isCheckedIn ? (status === 'late' ? '#f59e0b' : '#22c55e') : '#ef4444'} strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div>
                  <div className="stat-title">Working Hours</div>
                  <div className="stat-value">{workingHours.toFixed(1)} <span style={{ fontSize: '14px' }}>hrs</span></div>
                  <div className="stat-sub">Target: 9 hours</div>
                </div>
                <div className="stat-icon" style={{ background: '#3b82f620' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${getProductivityPercentage()}%` }}></div>
              </div>
              <div className="stat-sub" style={{ marginTop: '8px' }}>{getProductivityPercentage().toFixed(0)}% of daily goal</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div>
                  <div className="stat-title">Monthly Streak</div>
                  <div className="stat-value">{streakCount} <span style={{ fontSize: '14px' }}>days</span></div>
                  <div className="stat-sub">Keep it up! 🔥</div>
                </div>
                <div className="stat-icon" style={{ background: '#f59e0b20' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                    <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div>
                  <div className="stat-title">Location Status</div>
                  <div className="stat-value" style={{ color: locationPermission ? '#22c55e' : '#ef4444' }}>
                    {locationPermission === null ? '?' : locationPermission ? 'Active' : 'Off'}
                  </div>
                  <div className="stat-sub">{locationPermission ? 'GPS verified' : 'Please enable'}</div>
                </div>
                <div className="stat-icon" style={{ background: locationPermission ? '#22c55e20' : '#ef444420' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={locationPermission ? '#22c55e' : '#ef4444'} strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Motivational Banner */}
          {!isCheckedOut && (
            <div className="alert-offline" style={{ background: isCheckedIn ? '#e0e7ff' : '#fed7aa', borderLeftColor: isCheckedIn ? '#4f46e5' : '#f59e0b', marginBottom: '24px' }}>
              <span>{isCheckedIn ? '🚀' : '☕'}</span>
              <span><strong>{getMotivationalMessage()}</strong></span>
              {isCheckedIn && !isCheckedOut && (
                <span style={{ marginLeft: 'auto', fontSize: '12px' }}>
                  Checked in at {checkInTime}
                  {status === 'late' && ' ⚠️ You were late today'}
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="actions-grid">
            <div className="action-card checkin-card">
              <div className="action-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="action-title">Check In</h2>
              <p className="action-subtitle">Start your workday</p>
              <div className="action-chips">
                <span className="action-chip">10:00 AM Start</span>
                <span className="action-chip">10:15 AM Grace</span>
              </div>
              <button 
                className="action-btn checkin-btn"
                disabled={locationLoading || isCheckedIn || !connectionStatus}
                onClick={handleCheckInClick}
              >
                {locationLoading ? <span className="btn-spinner"></span> : '📍 Check In Now'}
              </button>
              {isCheckedIn && !checkOutTime && (
                <div className="checkin-status">
                  ✅ Checked in at {checkInTime}
                  {status === 'late' && <span style={{ background: '#f59e0b', padding: '2px 8px', borderRadius: '20px', marginLeft: '8px', fontSize: '10px' }}>Late</span>}
                </div>
              )}
            </div>

            <div className="action-card checkout-card">
              <div className="action-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6m-6 4h6" />
                </svg>
              </div>
              <h2 className="action-title">Check Out</h2>
              <p className="action-subtitle">Complete your workday</p>
              <div className="action-chips">
                <span className="action-chip">7:00 PM End</span>
                <span className="action-chip">9 Hours Goal</span>
              </div>
              <button 
                className="action-btn checkout-btn"
                disabled={locationLoading || !isCheckedIn || isCheckedOut || !connectionStatus}
                onClick={handleCheckOutClick}
              >
                {locationLoading ? <span className="btn-spinner"></span> : '📍 Check Out Now'}
              </button>
              {isCheckedOut && (
                <div className="checkin-status">
                  ✅ Checked out at {checkOutTime}
                  {workingHours > 0 && ` | Hours: ${workingHours.toFixed(1)}`}
                </div>
              )}
            </div>
          </div>

          {/* Monthly Statistics */}
          <div className="stats-paper">
            <h3 className="stats-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <path d="M12 22V12" />
                <path d="M9 10.5L12 9l3 1.5" />
              </svg>
              Monthly Performance
            </h3>
            <div className="monthly-stats">
              <div>
                <div className="monthly-stat-value present-value">{monthlyStats.present}</div>
                <div className="stat-sub">Present Days</div>
              </div>
              <div>
                <div className="monthly-stat-value absent-value">{monthlyStats.absent}</div>
                <div className="stat-sub">Absent Days</div>
              </div>
              <div>
                <div className="monthly-stat-value late-value">{monthlyStats.late}</div>
                <div className="stat-sub">Late Arrivals</div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="security-notice">
            <div className="security-text">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <div>
                <strong>🔒 Secure Location-Based Attendance</strong><br />
                <span style={{ fontSize: '12px', color: '#64748b' }}>Your location is verified in real-time. Attendance can only be marked within 100 meters of office premises.</span>
              </div>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>
      </div>
   <DisplayLeaves/>
      {/* Warning Modal */}
      {showTimeWarning && (
        <div className="modal-overlay" onClick={() => setShowTimeWarning(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3>Late Check-in Warning</h3>
            </div>
            <div className="modal-body">
              <p>You are checking in after 10:15 AM. This will be marked as <strong style={{ color: '#f59e0b' }}>LATE</strong>.</p>
              <p style={{ marginTop: '12px' }}>Are you sure you want to continue?</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowTimeWarning(false)}>Cancel</button>
              <button className="btn-proceed" onClick={handleProceedWithWarning}>Proceed Anyway</button>
            </div>
          </div>
        </div>
      )}

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

export default Dashboard;