import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import toast, {Toaster} from "react-hot-toast"
import axios from 'axios';

const Login = () => {
 
const [formData,setFormData] = useState({
  employeeId:"",
  password:""
})
console.log('this is form data login',formData)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.employeeId || !formData.password){
      return toast.error('Invalid credentials')
    }
    try{
      const response = await axios.post('http://localhost:3500/api/auth/login',formData,{
        headers:{
          "Content-Type":"application/json"
        }
      })
      console.log('response',response.data)
      // setFormData(response.data.ta.a)
      toast.success('Employee has been login successfully')
      localStorage.setItem('token',response.data.token)
      setTimeout(()=>{
        navigate('/dashboard')
      },4000)
    }catch(error){
      console.log('error',error)
      return toast.error('Something went wrong')
    }
  }

  return (
   <>
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#3498db' }}>
          Attendance System
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Employee Login
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Employee ID"
            name='employeeId'
            value={formData.employeeId}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            name='password'
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, bgcolor: '#3498db' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </form>
      </Paper>
    </Container>
    <Toaster/>
   </>
  );
};

export default Login;