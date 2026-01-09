import { useState } from 'react';

export default function FavControls({ onAdd, onRefresh }) {
  const [input, setInput] = useState('');

  const handleAddClick = () => {
    const coingeckoId = input.trim().toLowerCase(); // user types coingeckoId
    if (!coingeckoId) return;

    onAdd({ coingeckoId }); // just send coingeckoId to parent
    setInput('');
  };

  return (
    <div className="fav-controls">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter CoinGecko ID (e.g., bitcoin)"
      />
      <button onClick={handleAddClick}>Add</button>
      <button onClick={onRefresh}>Refresh</button>
    </div>
  );
}
