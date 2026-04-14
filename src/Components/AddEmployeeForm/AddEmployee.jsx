import React, { useState } from 'react'
import toast, {Toaster} from "react-hot-toast"
import axios from "axios"
import { useNavigate } from 'react-router-dom'

const AddEmployee = () => {
    const navigate = useNavigate()
    const [formData,setFormData] = useState({
        employeeId:"",
        name:"",
        email:"",
        password:"",
        phone:""
    });
    console.log('this is attendance form',formData)

    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }
    
    const handleSubmit=async(e)=>{
        e.preventDefault()
        if(!formData.employeeId || !formData.email || !formData.name || !formData.password){
            return toast.error('All fields are required')
        }
        try{
            const response = await axios.post('http://localhost:3500/api/auth/register',formData,{
                headers:{
                    "Content-Type":"application/json"
                }
            })
            console.log('response',response)
            toast.success('Employee has been Added Successfully ! ')
            setTimeout(()=>{
                navigate('/admin/dashboard')
            },2000)
        }catch(error){
            console.log('error',error)
            return toast.error('Internal server error')
        }
    }
    
  const styles = {
    container: {
      width: '100%',
      maxWidth: '1200px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '32px',
      margin: '0 auto',
      marginLeft:"265px"
    },
    header: {
      marginBottom: '32px',
      borderBottom: '2px solid #e5e7eb',
      paddingBottom: '16px'
    },
    headerTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '8px'
    },
    headerSubtitle: {
      fontSize: '14px',
      color: '#6b7280'
    },
    section: {
      marginBottom: '32px'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '20px',
      paddingBottom: '8px',
      borderBottom: '1px solid #e5e7eb'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px'
    },
    requiredStar: {
      color: '#ef4444',
      marginLeft: '4px'
    },
    input: {
      padding: '10px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.2s'
    },
    select: {
      padding: '10px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: '#ffffff',
      outline: 'none'
    },
    fileInput: {
      padding: '8px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: '#ffffff'
    },
    buttonContainer: {
      display: 'flex',
      gap: '16px',
      paddingTop: '24px',
      borderTop: '1px solid #e5e7eb',
      marginTop: '8px'
    },
    btnPrimary: {
      padding: '10px 24px',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    btnSecondary: {
      padding: '10px 24px',
      backgroundColor: '#e5e7eb',
      color: '#374151',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    btnSuccess: {
      padding: '10px 24px',
      backgroundColor: '#16a34a',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      marginLeft: 'auto',
      transition: 'background-color 0.2s'
    }
  }

  return (
   <>
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>Add New Employee</h2>
        <p style={styles.headerSubtitle}>Fill in the employee details below</p>
      </div>

      {/* Personal Information Section */}
      <form onSubmit={handleSubmit}>
        <div style={styles.section}>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Employee Id<span style={styles.requiredStar}>*</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter employee ID" 
                style={styles.input}
                name='employeeId'
                onChange={handleChange}
                value={formData.employeeId}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Full Name <span style={styles.requiredStar}>*</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter full name" 
                style={styles.input}
                name='name'
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Email Address <span style={styles.requiredStar}>*</span>
              </label>
              <input 
                type="email" 
                placeholder="employee@company.com" 
                style={styles.input}
                name='email'
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Password <span style={styles.requiredStar}>*</span>
              </label>
              <input 
                type="password" 
                placeholder="********" 
                style={styles.input}
                name='password'
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Phone Number
              </label>
              <input 
                type="tel" 
                placeholder="Enter phone number" 
                style={styles.input}
                name='phone'
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Submit Button Section */}
        <div style={styles.buttonContainer}>
          <button 
            type="button" 
            style={styles.btnSecondary}
            onClick={() => navigate('/admin/dashboard')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            style={styles.btnPrimary}
          >
            Add Employee
          </button>
        </div>
      </form>
    </div>
    <Toaster/>
   </>
  )
}

export default AddEmployee