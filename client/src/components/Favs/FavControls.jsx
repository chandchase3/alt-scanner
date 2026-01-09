import { useState } from 'react';

export default function FavControls({ onAdd, onRefresh }) {
  const [input, setInput] = useState('');

  const handleAddClick = () => {
    const coingeckoId = input.trim().toLowerCase(); // user types coingeckoId
    if (!coingeckoId) return;

    onAdd({ coingeckoId }); // send to parent
    setInput(''); // clear input
  };

  return (
    <div className="fav-add-coin">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter CoinGecko"
      />
      <button onClick={handleAddClick}>Add</button>
      <button onClick={onRefresh}>Refresh</button>
    </div>
  );
}
