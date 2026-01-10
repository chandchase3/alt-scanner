import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/watchlists';

// Fetch all watchlists for the current user
export const fetchWatchlists = createAsyncThunk(
  'watchlists/fetchWatchlists',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data; // array of watchlists
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create a new watchlist
export const createWatchlist = createAsyncThunk(
  'watchlists/createWatchlist',
  async ({ name }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;
      const res = await axios.post(API_BASE, { name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const watchlistsSlice = createSlice({
  name: 'watchlists',
  initialState: {
    watchlists: [],
    selectedWatchlistId: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    selectWatchlist: (state, action) => {
      state.selectedWatchlistId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlists.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchWatchlists.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.watchlists = action.payload;
        if (!state.selectedWatchlistId && action.payload.length > 0) {
          state.selectedWatchlistId = action.payload[0]._id;
        }
      })
      .addCase(fetchWatchlists.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createWatchlist.fulfilled, (state, action) => {
        state.watchlists.push(action.payload);
        state.selectedWatchlistId = action.payload._id;
      });
  },
});

export const { selectWatchlist } = watchlistsSlice.actions;
export default watchlistsSlice.reducer;