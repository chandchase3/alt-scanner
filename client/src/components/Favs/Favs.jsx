import { coins as initialCoins, columns } from './data';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Favs.css';
import { FavControls, MarketData, Coin } from '.';
// import { columns } from './data';

const API_BASE = 'http://localhost:3000/api/fav-coins';

export default function Favs() {
  // const [watchlist, setWatchlist] = useState([]);
  const [watchlist, setWatchlist] = useState(initialCoins);


  // Fetch watchlist from backend on mount
  // useEffect(() => {
  //   const fetchWatchlist = async () => {
  //     try {
  //       const res = await axios.get(API_BASE);
  //       setWatchlist(res.data);
  //     } catch (err) {
  //       console.error('Failed to fetch watchlist', err);
  //     }
  //   };

  //   fetchWatchlist();
  // }, []);


  // Add coin to backend and update state
  const handleAdd = useCallback(async ({ coingeckoId }) => {
    try {
      const res = await axios.post(API_BASE, { coingeckoId });
      setWatchlist((prev) => [res.data, ...prev]); // prepend new coin
    } catch (err) {
      console.error('Failed to add coin', err);
      alert(err.response?.data?.message || 'Failed to add coin');
    }
  }, []);

  // === Placeholder Refresh handler ===
  const handleRefresh = useCallback(() => {
    console.log('Refresh clicked');
    // Future: fetch live market data for all coins
  }, []);

  // === Row click handler ===
  const handleRowClick = useCallback((ticker) => {
    alert(`You clicked ${ticker}`);
  }, []);

  // === Header click handler ===
  const handleHeaderClick = useCallback((key) => {
    console.log(`Header clicked: ${key}`);
  }, []);
  return (
    <div className="fav-container">
      <FavControls onAdd={handleAdd} onRefresh={handleRefresh} />

      <table className="fav-table">
        <MarketData columns={columns} onHeaderClick={handleHeaderClick} />
        <tbody>
          {watchlist.map((coin) => (
            <Coin key={coin._id} coin={coin} onClick={handleRowClick} />
          ))}
        </tbody>
      </table>
    </div>
  );
}











  // --- Fetch watchlist on mount ---
  // useEffect(() => {
  //   const fetchWatchlist = async () => {
  //     try {
  //       const res = await axios.get(API_BASE);
  //       setWatchlist(res.data);
  //     } catch (err) {
  //       console.error('Failed to fetch watchlist', err);
  //     }
  //   };
  //   fetchWatchlist();
  // }, []);
