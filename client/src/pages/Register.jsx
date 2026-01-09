import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setCredentials } from '../redux/slices/userSlice.js';
import styles from './Auth.module.css';

const API_BASE = 'http://localhost:3000/api/auth';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  // Update form state on input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Submit registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(`${API_BASE}/register`, form);

      // Update Redux state with user + token
      dispatch(setCredentials(res.data));

      // Save token to localStorage
      localStorage.setItem('token', res.data.token);

      // Redirect to home/dashboard
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Account</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form className={styles.controls} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />

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

        <button className={styles.button} type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
