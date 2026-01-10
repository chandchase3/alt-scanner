import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/auth/Register.jsx';
import Login from './pages/auth/Login.jsx';
import Favs from './pages/Favs/Favs.jsx'; // create a simple placeholder
import Lists from './pages/watchlists/Lists.jsx'; // create a simple placeholder

export default function App() {
  return (
    <Routes>
      <Route path="/lists" element={<Lists />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/favs" element={<Favs />} />
    </Routes>
  );
}
