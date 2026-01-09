import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/watchlists';

export const fetchWatchlists = createAsyncThunk(
  'watchlists/fetchWatchlists',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(API_BASE);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createWatchlist = createAsyncThunk(
  'watchlists/createWatchlist',
  async ({ name }, thunkAPI) => {
    try {
      const res = await axios.post(API_BASE, { name });
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
