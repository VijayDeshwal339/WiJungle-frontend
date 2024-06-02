import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAlerts = createAsyncThunk('alerts/fetchAlerts', async () => {
  const response = await axios.get('https://wijungle-backend.onrender.com/api/alerts');
  return response.data;
});

const alertsSlice = createSlice({
  name: 'alerts',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default alertsSlice.reducer;
