import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { trackerAPI } from '../../services/api';

const WATER_MAX = 8;

// Track in-flight requests to prevent race conditions
let exerciseInflight = new Set();
let mealInflight = new Set();
let waterInflight = false;

export const fetchDailyLog = createAsyncThunk('tracker/fetchDaily', async (date, { rejectWithValue }) => {
  try {
    const res = await trackerAPI.getByDate(date);
    return res.data.log;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch log');
  }
});

export const toggleExercise = createAsyncThunk(
  'tracker/toggleExercise',
  async (data, { rejectWithValue }) => {
    try {
      const res = await trackerAPI.toggleExercise(data);
      return res.data.log;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed');
    } finally {
      exerciseInflight.delete(data.exerciseName);
    }
  },
  {
    // Block duplicate requests for the same exercise
    condition: (data) => {
      if (exerciseInflight.has(data.exerciseName)) return false;
      exerciseInflight.add(data.exerciseName);
      return true;
    },
  }
);

export const toggleMeal = createAsyncThunk(
  'tracker/toggleMeal',
  async (data, { rejectWithValue }) => {
    try {
      const res = await trackerAPI.toggleMeal(data);
      return res.data.log;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed');
    } finally {
      mealInflight.delete(data.mealName);
    }
  },
  {
    condition: (data) => {
      if (mealInflight.has(data.mealName)) return false;
      mealInflight.add(data.mealName);
      return true;
    },
  }
);

export const addActualMeal = createAsyncThunk(
  'tracker/addActualMeal',
  async (data, { rejectWithValue }) => {
    try {
      const res = await trackerAPI.addActualMeal(data);
      return res.data.log;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed');
    }
  }
);

export const removeActualMeal = createAsyncThunk(
  'tracker/removeActualMeal',
  async ({ date, mealId }, { rejectWithValue }) => {
    try {
      const res = await trackerAPI.removeActualMeal(date, mealId);
      return res.data.log;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed');
    }
  }
);

export const updateWater = createAsyncThunk(
  'tracker/updateWater',
  async (data, { rejectWithValue }) => {
    try {
      const res = await trackerAPI.updateWater(data);
      return res.data.log;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed');
    } finally {
      waterInflight = false;
    }
  },
  {
    condition: (data, { getState }) => {
      if (waterInflight) return false;
      // Also prevent going beyond bounds locally
      const current = getState().tracker.dailyLog?.waterIntake ?? 0;
      if (data.delta > 0 && current >= WATER_MAX) return false;
      if (data.delta < 0 && current <= 0) return false;
      waterInflight = true;
      return true;
    },
  }
);

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

    // ── Optimistic Exercise Toggle (immediate UI, server syncs on fulfilled) ──
    builder.addCase(toggleExercise.pending, (state, action) => {
      if (state.dailyLog) {
        const name = action.meta.arg.exerciseName;
        const list = state.dailyLog.completedExercises || [];
        const idx = list.indexOf(name);
        if (idx > -1) {
          state.dailyLog.completedExercises = list.filter((n) => n !== name);
        } else {
          state.dailyLog.completedExercises = [...list, name];
        }
      }
    });
    builder.addCase(toggleExercise.fulfilled, (state, action) => {
      // Sync with server truth only if no other toggles are in-flight
      if (exerciseInflight.size === 0) {
        state.dailyLog = action.payload;
      }
    });
    builder.addCase(toggleExercise.rejected, (state, action) => {
      state.error = action.payload;
    });

    // ── Optimistic Meal Toggle ──
    builder.addCase(toggleMeal.pending, (state, action) => {
      if (state.dailyLog) {
        const name = action.meta.arg.mealName;
        const list = state.dailyLog.mealsConsumed || [];
        const idx = list.indexOf(name);
        if (idx > -1) {
          state.dailyLog.mealsConsumed = list.filter((n) => n !== name);
        } else {
          state.dailyLog.mealsConsumed = [...list, name];
        }
      }
    });
    builder.addCase(toggleMeal.fulfilled, (state, action) => {
      if (mealInflight.size === 0) {
        state.dailyLog = action.payload;
      }
    });
    builder.addCase(toggleMeal.rejected, (state, action) => {
      state.error = action.payload;
    });

    // ── Actual Meals ──
    builder.addCase(addActualMeal.fulfilled, (state, action) => {
      state.dailyLog = action.payload;
    });
    builder.addCase(addActualMeal.rejected, (state, action) => {
      console.error('addActualMeal rejected:', action.payload);
      state.error = action.payload;
    });
    builder.addCase(removeActualMeal.fulfilled, (state, action) => {
      state.dailyLog = action.payload;
    });
    builder.addCase(removeActualMeal.rejected, (state, action) => {
      console.error('removeActualMeal rejected:', action.payload);
      state.error = action.payload;
    });

    // ── Optimistic Water Update (clamped 0..8) ──
    builder.addCase(updateWater.pending, (state, action) => {
      if (state.dailyLog) {
        const delta = action.meta.arg.delta;
        const current = state.dailyLog.waterIntake || 0;
        state.dailyLog.waterIntake = Math.max(0, Math.min(WATER_MAX, current + delta));
      }
    });
    builder.addCase(updateWater.fulfilled, (state, action) => {
      if (!waterInflight) {
        state.dailyLog = action.payload;
      }
    });
    builder.addCase(updateWater.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export default trackerSlice.reducer;
