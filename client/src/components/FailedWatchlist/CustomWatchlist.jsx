// src/components/CustomWatchlist.jsx
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function CustomWatchlist() {
  const [data, setData] = useState({ tickers: [], coins: {} });
  const [newTicker, setNewTicker] = useState('');
  const [timer, setTimer] = useState(20); // countdown
  const intervalRef = useRef();

  const POLL_INTERVAL = 20;

const fetchWatchlist = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/custom-scanner');

    const tickers = Array.isArray(res.data?.tickers) ? res.data.tickers : [];
    const backendCoins = res.data?.coins || {};

    // Map backend data using ticker names from tickers array
    const coins = {};
    tickers.forEach(ticker => {
      // Try exact match first
      let coin = backendCoins[ticker];
      if (!coin) {
        // fallback: case-insensitive search
        const key = Object.keys(backendCoins).find(k => k.toLowerCase() === ticker.toLowerCase());
        coin = key ? backendCoins[key] : {};
      }

      coins[ticker.toUpperCase()] = {
        price: coin.price ?? '-',
        change24h: coin.change24h ?? '-',
        volume24h: coin.volume24h ?? '-',
        marketCap: coin.marketCap ?? '-',
        high24h: coin.high24h ?? '-',
        low24h: coin.low24h ?? '-',
        symbol: coin.symbol ?? ticker.toUpperCase()
      };
    });

    setData({ tickers, coins });
    setTimer(POLL_INTERVAL);
  } catch (err) {
    console.error('Failed to fetch watchlist:', err);
  }
};



const handleAddTicker = async () => {
  if (!newTicker.trim()) return;
  try {
    await axios.patch('http://localhost:3000/api/custom-scanner', {
      add: [newTicker.trim()]
    });
    setNewTicker('');
    fetchWatchlist();
  } catch (err) {
    console.error('Failed to add coin:', err);
  }
};

const handleRemoveTicker = async (ticker) => {
  if (!ticker) return;
  try {
    await axios.patch('http://localhost:3000/api/custom-scanner', {
      remove: [ticker.toUpperCase()]
    });
    fetchWatchlist();
  } catch (err) {
    console.error('Failed to remove ticker:', err);
  }
};

// useEffect(() => {
//   fetchWatchlist();

//   intervalRef.current = setInterval(() => {
//     setTimer(prev => {
//       if (prev <= 1) {
//         fetchWatchlist();
//         return POLL_INTERVAL;
//       }
//       return prev - 1;
//     });
//   }, 1000);

//   return () => clearInterval(intervalRef.current);
// }, []);

const formatVolume = (num) => {
  if (num === null || num === undefined) return '-';
  let value, suffix = '';
  if (num < 1_000) value = num.toString();
  else if (num < 1_000_000) { value = (num / 1_000).toFixed(1); suffix = 'k'; }
  else if (num < 1_000_000_000) { value = (num / 1_000_000).toFixed(1); suffix = 'M'; }
  else { value = (num / 1_000_000_000).toFixed(1); suffix = 'B'; }

  return (
    <>
      {value}<span className="volume-letter">{suffix}</span>
    </>
  );
};

console.log(data)

return (
<div className="custom-watchlist">
  <h2>Custom Watchlist</h2>

  <div className="controls">
  <input
    type="text"
    value={newTicker}
    onChange={(e) => setNewTicker(e.target.value)}
    placeholder="Add ticker or coin name"
  />
  <button onClick={handleAddTicker}>Add</button>

  {/* Manual refresh */}
  <button onClick={fetchWatchlist} style={{ marginLeft: '0.5rem' }}>
    Refresh Watchlist
  </button>
</div>


  <div className="controls">
    <input
      type="text"
      value={newTicker}
      onChange={e => setNewTicker(e.target.value)}
      placeholder="Add ticker or coin name"
    />
    <button onClick={handleAddTicker}>Add</button>
  </div>

  <p>Next update in: {timer} second{timer !== 1 ? 's' : ''}</p>

  {data.tickers.length === 0 ? (
    <p className="empty">No coins in your watchlist</p>
  ) : (
  <table>
    <thead>
      <tr>
        <th>Ticker</th>
        <th>Price (USD)</th>
        <th>24h Change (%)</th>
        <th>24h Volume</th>
        <th>Actions</th>
      </tr>
    </thead>

<tbody>
  {data.tickers.map((userInput) => {
    // Normalize: match user input to coin key in data.coins
    const coinKey = Object.keys(data.coins).find(
      (k) => k.toLowerCase() === userInput.toLowerCase()
    );
    const coin = coinKey ? data.coins[coinKey] : {};
    const change = coin?.change24h;

    return (
      <tr key={userInput}>
        <td>{coin?.symbol?.toUpperCase() || userInput}</td>
        <td>{coin?.price != null ? coin.price.toLocaleString() : '-'}</td>
        <td className={change >= 0 ? 'positive' : 'negative'}>
          {change != null ? change.toFixed(2) : '-'}
        </td>
        <td>{formatVolume(coin?.volume24h)}</td>
        <td className="action-cell">
          <button className="delete-btn" onClick={() => handleRemoveTicker(userInput)}>
            Remove
          </button>
        </td>
      </tr>
    );
  })}
</tbody>
  </table>
  )}
</div>
);
}

export default CustomWatchlist;
