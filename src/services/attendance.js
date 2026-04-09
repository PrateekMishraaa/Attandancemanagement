import api from './api';

export const markCheckIn = async (latitude, longitude, time) => {
  const response = await api.post('/attendance/checkin', {
    latitude,
    longitude,
    time
  });
  return response.data;
};

export const markCheckOut = async (latitude, longitude, time) => {
  const response = await api.post('/attendance/checkout', {
    latitude,
    longitude,
    time
  });
  return response.data;
};

export const getAttendanceHistory = async (limit = 30) => {
  const response = await api.get(`/attendance/history?limit=${limit}`);
  return response.data;
};

export const getTodayStatus = async () => {
  const response = await api.get('/attendance/today');
  return response.data;
};