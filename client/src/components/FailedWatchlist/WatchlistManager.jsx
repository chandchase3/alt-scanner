import { useState, useEffect } from 'react';
import { getWatchlist, saveWatchlist, editWatchlist, deleteTicker } from '../../api/customScannerApi';

export default function WatchlistManager({ onUpdate }) {
  const [tickers, setTickers] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const res = await getWatchlist();
      setTickers(res.data.tickers || []);
      onUpdate(); // trigger CoinTable refresh
    } catch (err) {
      console.error(err);
    }
  };

    const handleAdd = async () => {
        if (!input) return;
        try {
            await editWatchlist([input.toUpperCase()], []);
            setInput('');
            fetchWatchlist(); // update local tickers
            onUpdate();       // refresh CoinTable once
        } catch (err) {
            console.error(err);
        }
    };

    const handleRemove = async (ticker) => {
        try {
            await editWatchlist([], [ticker]);
            fetchWatchlist(); // update local tickers
            onUpdate();       // refresh CoinTable once
        } catch (err) {
            console.error(err);
        }
    };


  return (
    <div>
      <h2>Custom Watchlist</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter ticker (e.g. BTC)"
      />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {tickers.map((t) => (
          <li key={t}>
            {t} <button onClick={() => handleRemove(t)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
