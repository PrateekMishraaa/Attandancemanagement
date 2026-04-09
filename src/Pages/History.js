import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  CircularProgress
} from '@mui/material';
import { getAttendanceHistory } from '../services/attendance';
import Navbar from '../Components/Layout/Navbar.js';

const History = () => {
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const result = await getAttendanceHistory();
    if (result.success) {
      setHistory(result.data);
      setSummary(result.summary);
    }
    setLoading(false);
  };

  const getStatusChip = (status) => {
    const colors = {
      present: 'success',
      late: 'warning',
      absent: 'error'
    };
    return <Chip label={status.toUpperCase()} color={colors[status] || 'default'} size="small" />;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Summary Cards */}
        {summary && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Summary</Typography>
            <Box display="flex" gap={3} flexWrap="wrap">
              <Box>
                <Typography variant="body2" color="textSecondary">Present</Typography>
                <Typography variant="h4" color="success.main">{summary.totalPresent}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Late</Typography>
                <Typography variant="h4" color="warning.main">{summary.totalLate}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Absent</Typography>
                <Typography variant="h4" color="error.main">{summary.totalAbsent}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Total Hours</Typography>
                <Typography variant="h4" color="primary">{summary.totalWorkingHours}</Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {/* History Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#3498db' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Check In</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Check Out</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Working Hours</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.checkInTime || '--:--'}</TableCell>
                  <TableCell>{record.checkOutTime || '--:--'}</TableCell>
                  <TableCell>{getStatusChip(record.status)}</TableCell>
                  <TableCell>{record.workingHours?.toFixed(2) || '0'} hrs</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default History;