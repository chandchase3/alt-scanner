import React, { useState } from 'react';
import './FavCoins.css';
import { coins as initialCoins, columns } from './data';
import { FavControls, MarketData, CoinRow } from './';

const FavCoins = () => {
  const [coins, setCoins] = useState(initialCoins);

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
          {coins.map((coin) => (
            <CoinRow key={coin.ticker} coin={coin} onClick={handleRowClick} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FavCoins;
