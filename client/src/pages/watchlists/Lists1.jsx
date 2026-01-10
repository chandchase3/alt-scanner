import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWatchlists } from '../../redux/slices/watchlistsSlice';

import ListsRow from './ListsRow';
import ListsControls from './ListsControls';
import ListsCol from './ListsCol';

export default function Lists() {
  const dispatch = useDispatch();

  const { watchlists, status } = useSelector((state) => state.watchlists);

  const listInfo = [
    { key: 'name', label: 'Name' },
    { key: 'length', label: 'Length' },
    { key: 'createdAt', label: 'Created' },
    { key: 'updatedAt', label: 'Last edit' },
  ];

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchWatchlists());
    }
  }, [dispatch, status]);

  const handleAdd = () => console.log('add list');
  const handleRefresh = () => dispatch(fetchWatchlists());
  const handleHeaderClick = (key) => console.log('header click:', key);
  const handleRowClick = (list) => console.log('row click:', list);

  return (
    <div className="lists-container">
      <ListsControls onAdd={handleAdd} onRefresh={handleRefresh} />

      <table className="lists-table">
        <ListsCol listInfo={listInfo} onHeaderClick={handleHeaderClick} />

        <tbody>
          {status === 'loading' ? (
            <tr>
              <td colSpan={listInfo.length} style={{ textAlign: 'center' }}>
                Loading...
              </td>
            </tr>
          ) : watchlists.length === 0 ? (
            <tr>
              <td colSpan={listInfo.length} style={{ textAlign: 'center' }}>
                No watchlists
              </td>
            </tr>
          ) : (
            watchlists.map((list) => (
              <ListsRow
                key={list._id}
                list={{
                  name: list.name,
                  length: list.coins?.length || 0,
                  created: list.createdAt,
                  lastEdit: list.updatedAt,
                }}
                onClick={() => handleRowClick(list)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
