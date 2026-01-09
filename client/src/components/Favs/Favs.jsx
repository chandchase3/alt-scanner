import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Favs.css';
import { FavControls, MarketData, Coin } from '.';
import { coins as initialCoins, columns } from './data';

const API_BASE = 'http://localhost:3000/api/fav-coins';

export default function Favs() {
  const [watchlist, setWatchlist] = useState(initialCoins);

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

  // --- Placeholder handlers ---
  const handleAdd = () => console.log('Add clicked');
  const handleRefresh = () => console.log('Refresh clicked');
  const handleRowClick = (ticker) => alert(`You clicked ${ticker}`);
  const handleHeaderClick = (key) => console.log(`Header clicked: ${key}`);

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
