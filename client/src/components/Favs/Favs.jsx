import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './Favs.css';
import { FavControls, MarketData, Coin } from '.';
import { columns } from './data';

const API_BASE = 'http://localhost:3000/api/fav-coins';

export default function Favs() {
  const [coinList, setCoinList] = useState([]);  // watchlist from DB
  const [coinData, setCoinData] = useState({});  // market data

  // ------------------------------
  // Load watchlist from backend on mount
  // ------------------------------
  useEffect(() => {
    const fetchCoinList = async () => {
      try {
        const res = await axios.get(API_BASE);
        const list = Array.isArray(res.data) ? res.data : res.data.coins || [];
        console.log(list)
        setCoinList(list);
      } catch (err) {
        console.error('Failed to fetch coin list', err);
      }
    };

    fetchCoinList();
  }, []); // run once on mount

  // Fetch market data for current watchlist
  const fetchMarketData = useCallback(async () => {
    if (!coinList.length) return;
    try {
      const res = await axios.get(`${API_BASE}/market-data`);
      setCoinData(res.data);
    } catch (err) {
      console.error('Failed to fetch market data', err);
    }
  }, [coinList]);

  // Add a new coin
  const handleAdd = useCallback(async ({ coingeckoId }) => {
    try {
      const res = await axios.post(API_BASE, { coingeckoId });
      const newCoin = res.data;
      setCoinList(prev => [newCoin, ...prev]);

      // Optionally fetch market data immediately
      const marketRes = await axios.get(`${API_BASE}/market-data`);
      setCoinData(marketRes.data);
    } catch (err) {
      console.error('Failed to add coin', err);
      alert(err.response?.data?.message || 'Failed to add coin');
    }
  }, []);

  // Refresh button
  const handleRefresh = useCallback(() => {
    console.log('coin', coinList)
    console.log(coinData)
    fetchMarketData();
  }, [fetchMarketData]);

  // Row click
  const handleRowClick = useCallback(ticker => alert(`You clicked ${ticker}`), []);

  // Header click
  const handleHeaderClick = useCallback(key => console.log(`Header clicked: ${key}`), []);

  return (
    <div className="fav-container">
      <FavControls onAdd={handleAdd} onRefresh={handleRefresh} />

      <table className="fav-table">
        <MarketData columns={columns} onHeaderClick={handleHeaderClick} />
        <tbody>
          {coinList.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                No coins in watchlist
              </td>
            </tr>
          ) : (
            coinList.map(coin => (
              <Coin
                key={coin._id || coin.coingeckoId}
                coin={{ ...coin, market: coinData[coin.coingeckoId] || {} }}
                onClick={handleRowClick}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
