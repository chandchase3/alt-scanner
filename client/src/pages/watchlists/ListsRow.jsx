import React from 'react';

export default function ListsRow({ list, onClick }){
  return (
    <tr
      className="inputRow"
      onClick={() => onClick(list.ticker)}
    >
      <td>{list.name}</td>
      <td>{list.length}</td>
      <td>{list.created}</td>
      <td>{list.lastEdit}</td>
    </tr>
  );
};
