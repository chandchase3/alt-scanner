import React from 'react';

const FavControls = ({ onAdd, onRefresh }) => {
  return (
    <div className="fav-add-coin">
      <input type="text" placeholder="Add ticker or coin" />
      <button onClick={onAdd}>Add</button>
      <button onClick={onRefresh} style={{ marginLeft: '0.5rem' }}>Refresh</button>
    </div>
  );
};

export default FavControls;