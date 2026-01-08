import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/custom-scanner';

export const getWatchlist = () => axios.get(BASE_URL);
export const saveWatchlist = (tickers) => axios.post(BASE_URL, { tickers });
export const editWatchlist = (add = [], remove = []) =>
  axios.patch(BASE_URL, { add, remove });
export const deleteTicker = (ticker) => axios.delete(`${BASE_URL}/${ticker}`);
export const deleteWatchlist = () => axios.delete(BASE_URL);
