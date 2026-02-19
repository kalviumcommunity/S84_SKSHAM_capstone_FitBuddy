import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { planAPI } from '../../services/api';

export const generatePlan = createAsyncThunk(
  'plan/generate',
  async (_, { rejectWithValue }) => {
    try {
      const res = await planAPI.generate();
      return res.data.plan;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to generate plan');
    }
  },
  {
    condition: (_, { getState }) => {
      const { plan } = getState();
      if (plan.generating) return false;
    },
  }
);

export const fetchCurrentPlan = createAsyncThunk(
  'plan/fetchCurrent',
  async (_, { rejectWithValue }) => {
    try {
      const res = await planAPI.getCurrent();
      return res.data.plan;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'No active plan');
    }
  },
  {
    condition: (_, { getState }) => {
      const { plan } = getState();
      if (plan.loading) return false;
    },
  }
);

const planSlice = createSlice({
  name: 'plan',
  initialState: {
    plan: null,
    loading: false,
    generating: false,
    error: null,
  },
  reducers: {
    clearPlan: (state) => {
      state.plan = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(generatePlan.pending, (state) => { state.generating = true; state.error = null; });
    builder.addCase(generatePlan.fulfilled, (state, action) => {
      state.generating = false;
      state.plan = action.payload;
    });
    builder.addCase(generatePlan.rejected, (state, action) => {
      state.generating = false;
      state.error = action.payload;
    });
    builder.addCase(fetchCurrentPlan.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(fetchCurrentPlan.fulfilled, (state, action) => {
      state.loading = false;
      state.plan = action.payload;
    });
    builder.addCase(fetchCurrentPlan.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearPlan } = planSlice.actions;
export default planSlice.reducer;
