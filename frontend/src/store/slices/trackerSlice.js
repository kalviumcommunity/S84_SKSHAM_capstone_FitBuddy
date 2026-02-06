import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { trackerAPI } from '../../services/api';

export const fetchDailyLog = createAsyncThunk('tracker/fetchDaily', async (date, { rejectWithValue }) => {
  try {
    const res = await trackerAPI.getByDate(date);
    return res.data.log;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch log');
  }
});

export const toggleExercise = createAsyncThunk('tracker/toggleExercise', async (data, { rejectWithValue }) => {
  try {
    const res = await trackerAPI.toggleExercise(data);
    return res.data.log;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const toggleMeal = createAsyncThunk('tracker/toggleMeal', async (data, { rejectWithValue }) => {
  try {
    const res = await trackerAPI.toggleMeal(data);
    return res.data.log;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const updateWater = createAsyncThunk('tracker/updateWater', async (data, { rejectWithValue }) => {
  try {
    const res = await trackerAPI.updateWater(data);
    return res.data.log;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

const trackerSlice = createSlice({
  name: 'tracker',
  initialState: {
    dailyLog: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDailyLog.pending, (state) => { state.loading = true; });
    builder.addCase(fetchDailyLog.fulfilled, (state, action) => {
      state.loading = false;
      state.dailyLog = action.payload;
    });
    builder.addCase(fetchDailyLog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // All toggle/update actions return updated log
    const updateLog = (state, action) => { state.dailyLog = action.payload; };
    builder.addCase(toggleExercise.fulfilled, updateLog);
    builder.addCase(toggleMeal.fulfilled, updateLog);
    builder.addCase(updateWater.fulfilled, updateLog);
  },
});

export default trackerSlice.reducer;
