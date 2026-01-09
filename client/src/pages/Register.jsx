import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../redux/slices/userSlice.js';
import axios from 'axios';
import { setCredentials } from '../redux/slices/userSlice.js';
import styles from './Auth.module.css';


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

    try {
      // Dispatch the thunk
      const resultAction = await dispatch(registerUser(form));

      if (registerUser.fulfilled.match(resultAction)) {
        // registration succeeded
        console.log('Registered user:', resultAction.payload);
        navigate('/'); // redirect to home
      } else {
        // registration failed
        console.error('Registration failed:', resultAction.payload);
        alert(resultAction.payload);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
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