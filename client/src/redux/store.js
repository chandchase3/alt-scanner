import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice.js';
// import watchlistsReducer from './slices/watchlistsSlice.js';
// import coinDataReducer from './slices/coinDataSlice.js';
// import alertsReducer from './slices/alertsSlice.js';
// import newsReducer from './slices/newsSlice.js';

const store = configureStore({
  reducer: {
    user: userReducer,
    // watchlists: watchlistsReducer,
    // coinData: coinDataReducer,
    // alerts: alertsReducer,
    // news: newsReducer,
  },
  devTools: true, // Redux DevTools
});

export default store;
