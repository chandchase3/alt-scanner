import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../redux/slices/userSlice.js';
import styles from './Auth.module.css';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Fake login response
    const fakeUser = { id: '1', username: 'DemoUser', email: form.email };
    const fakeToken = 'fake-jwt-token';
    dispatch(setCredentials({ user: fakeUser, token: fakeToken }));
    navigate('/dashboard');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      <form className={styles.controls} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          className={styles.input}
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button className={styles.button} type="submit">Login</button>
      </form>
    </div>
  );
}
