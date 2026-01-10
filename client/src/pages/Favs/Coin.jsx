import React from 'react';

const Coin = ({ coin, onClick }) => {
  return (
    <tr
      className="lilsts-row"
      onClick={() => onClick(coin.ticker)}
    >
      <td>{coin.ticker}</td>
      <td>{coin.price}</td>
      <td className={coin.change24h.startsWith('+') ? 'positive' : 'negative'}>
        {coin.change24h}
      </td>
      <td>{coin.volume24h}</td>
    </tr>
  );
};

export default Coin;
