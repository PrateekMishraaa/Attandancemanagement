import React, { useState } from 'react';
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Swal from "sweetalert2"
import { useParams } from "react-router-dom";

const EmployeWork = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    project_name: "",
    taskOverview: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { id } = useParams();
  
  // CRITICAL FIX: Remove colon from ID if present
  const cleanId = id?.startsWith(':') ? id.substring(1) : id;
  
  console.log('Original ID from params:', id);
  console.log('Cleaned ID for API:', cleanId);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.date || !formData.project_name || !formData.taskOverview) {
      return toast.error('All fields are required');
    }
    
    if (formData.taskOverview.length < 20) {
      return toast.error('Task description must be at least 20 characters');
    }
    
    setIsSubmitting(true);
    
    try {
      // Use cleanId instead of id
      const apiUrl = `https://attendancemanagementbackend-gg9v.onrender.com/api/work/todays-work/${cleanId}`;
      console.log('Calling API:', apiUrl);
      
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Success response:', response.data);
      Swal.fire('Thankyou For Submiting Your Todays Task')
      setFormData({
        date: new Date().toISOString().split('T')[0],
        project_name: "",
        taskOverview: ""
      });
      
      toast.success('Thank you for submitting your today\'s task!');
      
    } catch(error) {
      console.error('Error details:', error);
      
      if (error.response) {
        const errorMessage = error.response.data.message || 'Failed to submit work';
        toast.error(errorMessage);
        
        if (error.response.status === 409) {
          toast.error('You have already submitted work for today!');
        }
      } else if (error.request) {
        toast.error('Cannot connect to server. Please check if backend is running on port 5000');
      } else {
        toast.error('Error submitting form. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <div style={styles.container}>
        <div style={styles.innerContainer}>
          <div style={styles.header}>
            <div style={styles.iconWrapper}>
              <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 style={styles.title}>Daily Work Update</h1>
            <p style={styles.subtitle}>Submit your today's work progress</p>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Work Submission Form</h2>
              <p style={styles.cardSubtitle}>Fill in your daily work details</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={styles.cardBody}>
                <div style={styles.row}>
                  <div style={styles.field}>
                    <label style={styles.label}>
                      Date <span style={styles.required}>*</span>
                    </label>
                    <div style={styles.inputWrapper}>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        style={styles.input}
                        required
                      />
                    </div>
                  </div>

                  <div style={styles.field}>
                    <label style={styles.label}>
                      Project Name <span style={styles.required}>*</span>
                    </label>
                    <input 
                      type="text" 
                      name="project_name"
                      value={formData.project_name} 
                      onChange={handleChange} 
                      style={styles.input} 
                      placeholder="Enter Project Name"
                      required
                    />
                  </div>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>
                    Task Description <span style={styles.required}>*</span>
                  </label>
                  <textarea
                    rows="4"
                    name="taskOverview"
                    value={formData.taskOverview}
                    onChange={handleChange}
                    placeholder="Describe your work in detail... (Minimum 20 characters)"
                    style={styles.textarea}
                    required
                  />
                  <p style={{
                    ...styles.hintText,
                    color: formData.taskOverview.length >= 20 ? '#10b981' : '#9ca3af'
                  }}>
                    {formData.taskOverview.length}/20 characters minimum
                  </p>
                </div>

                <div style={styles.buttonWrapper}>
                  <button 
                    type="submit" 
                    style={{
                      ...styles.submitButton,
                      opacity: isSubmitting ? 0.7 : 1,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Work Update'}
                  </button>
                  <p style={styles.disclaimer}>
                    By submitting, you confirm that this work update is accurate
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)',
    padding: '32px 16px',
  },
  innerContainer: {
    maxWidth: '896px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  iconWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    backgroundColor: '#e0e7ff',
    borderRadius: '16px',
    marginBottom: '16px',
  },
  icon: {
    width: '32px',
    height: '32px',
    color: '#4f46e5',
  },
  title: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#6b7280',
    marginTop: '8px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
  },
  cardHeader: {
    background: 'linear-gradient(to right, #4f46e5, #9333ea)',
    padding: '16px 24px',
  },
  cardTitle: {
    color: 'white',
    fontWeight: '600',
    fontSize: '18px',
    margin: 0,
  },
  cardSubtitle: {
    color: '#c7d2fe',
    fontSize: '14px',
    marginTop: '4px',
  },
  cardBody: {
    padding: '24px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '24px',
  },
  field: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px',
  },
  required: {
    color: '#ef4444',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    width: '100%',
    padding: '8px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '8px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  hintText: {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '4px',
  },
  buttonWrapper: {
    paddingTop: '16px',
  },
  submitButton: {
    width: '100%',
    background: 'linear-gradient(to right, #4f46e5, #9333ea)',
    color: 'white',
    fontWeight: '600',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '16px',
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '12px',
  },
};

export default EmployeWork;