import React from 'react';

const MarketData = ({ columns, onHeaderClick }) => {
  return (
    <thead>
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            className="market-data"
            onClick={() => onHeaderClick(col.key)}
          >
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default MarketData;