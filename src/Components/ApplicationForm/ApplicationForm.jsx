import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from "jwt-decode"
import toast, {Toaster} from "react-hot-toast"
import {useNavigate} from "react-router-dom"
const ApplicationForm = ({ employeeId }) => {
    const navigate = useNavigate()
    console.log('this is emploree eid ',employeeId)
    const userToken = localStorage.getItem('token')
    console.log('this is user token',userToken)
    const [userData,setUserData] = useState('')
  const [formData, setFormData] = useState({
    LeaveType: '',
    FromDate: '',
    ToDate: '',
    IsHalfDay: false,
    HalfDaySession: '',
    ApplicationReason: '',
    ContactNumberDuringLeave: '',
    EmergencyContactPerson: '',
    EmergencyContactNumber: '',
    TaskHandoverTo: '',
    PendingWorkStatus: '',
    AvailableCasualLeave: 0,
    AvailableSickLeave: 0,
  });
console.log('this is application form data',formData)
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });



useEffect(()=>{
    const fetchUserData = async()=>{
        if(userToken){
            const decodeToken = await jwtDecode(userToken)
            console.log('this is this',decodeToken.id)
            setUserData(decodeToken)
        }
    }
    fetchUserData()
},[])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post(
        `https://attendancemanagementbackend-oqfl.onrender.com/api/leave/employee/leave/${userData.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            // Add authorization token if required
            // 'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log('this is response',response)
      if (response.data.success) {
        toast.success( 'Leave application submitted successfully!');
        setTimeout(()=>{
            navigate(`/dashboard/:${userData.id}`)
        },4000)

        // Reset form
        setFormData({
          LeaveType: '',
          FromDate: '',
          ToDate: '',
          IsHalfDay: false,
          HalfDaySession: '',
          ApplicationReason: '',
          ContactNumberDuringLeave: '',
          EmergencyContactPerson: '',
          EmergencyContactNumber: '',
          TaskHandoverTo: '',
          PendingWorkStatus: '',
          AvailableCasualLeave: 0,
          AvailableSickLeave: 0,
        });
      }
    } catch (error) {
      console.error('Error submitting leave application:', error);
      if (error.response) {
        setMessage({ 
          type: 'error', 
          text: error.response.data.message || error.response.data.errors?.join(', ') || 'Failed to submit application'
        });
      } else {
        setMessage({ type: 'error', text: 'Network error. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: '800px',
    margin: '50px auto',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '3px solid #f0f0f0'
  };

  const titleStyle = {
    fontSize: '28px',
    color: '#2c3e50',
    marginBottom: '10px',
    fontWeight: '600'
  };

  const subtitleStyle = {
    fontSize: '14px',
    color: '#7f8c8d',
    fontWeight: '400'
  };

  const formGroupStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#34495e'
  };

  const requiredStarStyle = {
    color: '#e74c3c',
    marginLeft: '4px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    fontSize: '14px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit',
    backgroundColor: '#fff'
  };

  const selectStyle = {
    width: '100%',
    padding: '12px 15px',
    fontSize: '14px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: '#fff',
    fontFamily: 'inherit'
  };

  const textareaStyle = {
    width: '100%',
    padding: '12px 15px',
    fontSize: '14px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '100px',
    backgroundColor: '#fff'
  };

  const checkboxGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '10px'
  };

  const checkboxStyle = {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  };

  const radioGroupStyle = {
    display: 'flex',
    gap: '20px',
    marginTop: '10px'
  };

  const radioLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer'
  };

  const radioStyle = {
    cursor: 'pointer'
  };

  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: loading ? '#95a5a6' : '#3498db',
    border: 'none',
    borderRadius: '10px',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '20px',
    fontFamily: 'inherit'
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: '25px',
    marginBottom: '20px',
    paddingBottom: '8px',
    borderBottom: '2px solid #3498db'
  };

  const infoBoxStyle = {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '20px',
    border: '1px solid #e0e0e0'
  };

  const leaveBalanceStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '15px'
  };

  const balanceCardStyle = {
    flex: 1,
    backgroundColor: '#fff',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #e0e0e0'
  };

  const balanceLabelStyle = {
    fontSize: '12px',
    color: '#7f8c8d',
    marginBottom: '5px'
  };

  const balanceValueStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2c3e50'
  };

  const messageStyle = {
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
    backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
    color: message.type === 'success' ? '#155724' : '#721c24',
    border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
  };

  return (
    <>
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={titleStyle}>Hello {userData.name}</div>
        <div style={subtitleStyle}>Please fill in all required fields (*)</div>
      </div>

      {message.text && (
        <div style={messageStyle}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Leave Balance Information */}
        <div style={infoBoxStyle}>
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#2c3e50' }}>
            Your Leave Balance
          </div>
          <div style={leaveBalanceStyle}>
            <div style={balanceCardStyle}>
              <div style={balanceLabelStyle}>Casual Leave</div>
              <div style={balanceValueStyle}>
                <input
                  type="number"
                  name="AvailableCasualLeave"
                  value={formData.AvailableCasualLeave}
                  onChange={handleChange}
                  style={{
                    width: '80px',
                    padding: '5px',
                    textAlign: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    border: '1px solid #e0e0e0',
                    borderRadius: '5px'
                  }}
                />
              </div>
            </div>
            <div style={balanceCardStyle}>
              <div style={balanceLabelStyle}>Sick Leave</div>
              <div style={balanceValueStyle}>
                <input
                  type="number"
                  name="AvailableSickLeave"
                  value={formData.AvailableSickLeave}
                  onChange={handleChange}
                  style={{
                    width: '80px',
                    padding: '5px',
                    textAlign: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    border: '1px solid #e0e0e0',
                    borderRadius: '5px'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Leave Type Section */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>
            Leave Type <span style={requiredStarStyle}>*</span>
          </label>
          <select
            name="LeaveType"
            style={selectStyle}
            value={formData.LeaveType}
            onChange={handleChange}
            required
          >
            <option value="">Select Leave Type</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Earned Leave">Earned Leave</option>
            <option value="Privilege Leave">Privilege Leave</option>
            <option value="Compensatory Off">Compensatory Off</option>
            <option value="Unpaid Leave">Unpaid Leave</option>
            <option value="Maternity Leave">Maternity Leave</option>
            <option value="Paternity Leave">Paternity Leave</option>
            <option value="Study Leave">Study Leave</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Leave Duration Section */}
        <div style={sectionTitleStyle}>Leave Duration</div>
        <div style={rowStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              From Date <span style={requiredStarStyle}>*</span>
            </label>
            <input
              type="date"
              name="FromDate"
              style={inputStyle}
              value={formData.FromDate}
              onChange={handleChange}
              required
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              To Date <span style={requiredStarStyle}>*</span>
            </label>
            <input
              type="date"
              name="ToDate"
              style={inputStyle}
              value={formData.ToDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Half Day Option */}
        <div style={formGroupStyle}>
          <div style={checkboxGroupStyle}>
            <input
              type="checkbox"
              id="IsHalfDay"
              name="IsHalfDay"
              style={checkboxStyle}
              checked={formData.IsHalfDay}
              onChange={handleChange}
            />
            <label htmlFor="IsHalfDay" style={{ fontSize: '14px', fontWeight: '500', color: '#34495e' }}>
              Apply for Half Day Leave
            </label>
          </div>
        </div>

        {/* Half Day Session (conditional) */}
        {formData.IsHalfDay && (
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Select Session <span style={requiredStarStyle}>*</span>
            </label>
            <div style={radioGroupStyle}>
              <label style={radioLabelStyle}>
                <input
                  type="radio"
                  name="HalfDaySession"
                  value="First Half"
                  style={radioStyle}
                  checked={formData.HalfDaySession === 'First Half'}
                  onChange={handleChange}
                  required={formData.IsHalfDay}
                />
                First Half (9:00 AM - 1:00 PM)
              </label>
              <label style={radioLabelStyle}>
                <input
                  type="radio"
                  name="HalfDaySession"
                  value="Second Half"
                  style={radioStyle}
                  checked={formData.HalfDaySession === 'Second Half'}
                  onChange={handleChange}
                />
                Second Half (2:00 PM - 6:00 PM)
              </label>
            </div>
          </div>
        )}

        {/* Application Reason */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>
            Reason for Leave <span style={requiredStarStyle}>*</span>
          </label>
          <textarea
            name="ApplicationReason"
            style={textareaStyle}
            placeholder="Please provide detailed reason for your leave application..."
            value={formData.ApplicationReason}
            onChange={handleChange}
            required
          />
        </div>

        {/* Contact Information Section */}
        <div style={sectionTitleStyle}>Contact Information</div>
        <div style={rowStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Contact Number (During Leave)</label>
            <input
              type="tel"
              name="ContactNumberDuringLeave"
              style={inputStyle}
              placeholder="10-digit mobile number"
              maxLength="10"
              value={formData.ContactNumberDuringLeave}
              onChange={handleChange}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Emergency Contact Person</label>
            <input
              type="text"
              name="EmergencyContactPerson"
              style={inputStyle}
              placeholder="Name of emergency contact"
              value={formData.EmergencyContactPerson}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Emergency Contact Number</label>
          <input
            type="tel"
            name="EmergencyContactNumber"
            style={inputStyle}
            placeholder="10-digit mobile number"
            maxLength="10"
            value={formData.EmergencyContactNumber}
            onChange={handleChange}
          />
        </div>

        {/* Work Handover Section */}
        <div style={sectionTitleStyle}>Work Handover Details</div>
        <div style={rowStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Task Handover To</label>
            <input
              type="text"
              name="TaskHandoverTo"
              style={inputStyle}
              placeholder="Name of colleague"
              value={formData.TaskHandoverTo}
              onChange={handleChange}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Pending Work Status</label>
            <input
              type="text"
              name="PendingWorkStatus"
              style={inputStyle}
              placeholder="Status of pending work"
              value={formData.PendingWorkStatus}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={buttonStyle}
          disabled={loading}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#2980b9';
              e.target.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#3498db';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          {loading ? 'Submitting...' : 'Submit Leave Application'}
        </button>
      </form>
    </div>
    <Toaster/>
    </>
  );
};

export default ApplicationForm;