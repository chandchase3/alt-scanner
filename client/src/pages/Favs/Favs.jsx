import React, { useState } from 'react';
import axios from 'axios';
import { FavControls, MarketData, Coin } from './';
import { columns } from './data';

const API_BASE = 'http://localhost:3000/api/fav-coins';

export default function Favs() {
  const [coinList, setCoinList] = useState([]);   // Watchlist from backend
  const [coinData, setCoinData] = useState([]);   // Watchlist from backend

  // Fetch watchlist from backend
  const fetchCoinList = async () => {
    try {
      const res = await axios.get(API_BASE);
      const list = Array.isArray(res.data) ? res.data : res.data.coins || [];
      console.log("fetchCoinList:", list)
      setCoinList(list);
      return list
    } catch (err) {
      console.error('Failed to fetch watchlist', err);
    }
  };

    // Fetch watchlist from backend
   const fetchCoinData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/market-data`);
      const list = Array.isArray(res.data) ? res.data : res.data.coins || [];
      console.log("market data:", list)
      setCoinData(list);
    } catch (err) {
      console.error('Failed to fetch market data', err);
    }
  };

  const getCoins = async () => {
    const list = await fetchCoinList();
    console.log("get coins", list)
    if (list.length > 0) {
      await fetchCoinData();
    }
  };

  // Add coin to watchlist
  const handleAdd = async ({ coingeckoId }) => {
    if (!coingeckoId) return;
    try {
      await axios.post(API_BASE, { coingeckoId });
      fetchCoinList();  // Refresh watchlist after adding
    } catch (err) {
      console.error('Failed to add coin', err);
      alert(err.response?.data?.message || 'Failed to add coin');
    }
  };

  // Refresh button handler
  const handleRefresh = () => getCoins();

  // Row click handler
  const handleRowClick = ticker => alert(`You clicked ${ticker}`);

  // Header click handler
  const handleHeaderClick = key => console.log(`Header clicked: ${key}`);

  return (
    <div className="lists-container">
      <FavControls onAdd={handleAdd} onRefresh={handleRefresh} />

      <table className="lilsts-table">
        <MarketData columns={columns} onHeaderClick={handleHeaderClick} />
        <tbody>
          {coinList.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                No coins in watchlist
              </td>
            </tr>
          ) : (
            coinData.map(coin => (
              <Coin
                key={coin._id || coin.coingeckoId}
                coin={coin}
                onClick={handleRowClick}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
