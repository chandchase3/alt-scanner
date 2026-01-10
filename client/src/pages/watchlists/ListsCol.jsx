import React from 'react';

export default function ListsCol({ listInfo, onHeaderClick }) {
  return (
    <thead>
      <tr>
        {listInfo.map((col) => (
          <th
            key={col.key}
            className="headerCell"
            onClick={() => onHeaderClick(col.key)}
          >
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};