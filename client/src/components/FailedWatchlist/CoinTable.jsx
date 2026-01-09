import { useState, useEffect } from 'react';
import { getWatchlist } from '../../api/customScannerApi';

export default function CoinTable({ refresh }) {
  const [coins, setCoins] = useState({});
  const [tickers, setTickers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false; // prevent state update after unmount
    const fetchCoins = async () => {
      setLoading(true);
      try {
        const res = await getWatchlist();
        if (cancelled) return;

        setTickers(res.data.tickers || []);
        setCoins(res.data.coins || {});
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCoins();

    return () => {
      cancelled = true;
    };
  }, [refresh]); // only fetch when `refresh` changes

  if (loading) return <p>Loading coins...</p>;
  if (tickers.length === 0) return <p>No tickers in your watchlist.</p>;

  return (
    <table border="1" cellPadding="5">
      <thead>
        <tr>
          <th>Ticker</th>
          <th>Price ($)</th>
          <th>24h Change (%)</th>
          <th>24h Volume</th>
          <th>Market Cap</th>
        </tr>
      </thead>
      <tbody>
        {tickers.map((t) => (
          <tr key={t}>
            <td>{t}</td>
            <td>{coins[t]?.price?.toFixed(2) || '-'}</td>
            <td>{coins[t]?.change24h?.toFixed(2) || '-'}</td>
            <td>{coins[t]?.volume24h?.toLocaleString() || '-'}</td>
            <td>{coins[t]?.marketCap?.toLocaleString() || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
