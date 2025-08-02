'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const router = useRouter();

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f9fafb',
      fontFamily: 'inherit',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'white',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(37,99,235,0.10)',
          width: '100%',
          maxWidth: '400px',
          border: '2px solid #2563eb',
        }}
      >
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center', color: '#2563eb' }}>Login</h2>

        {error && <p style={{ color: '#ef4444', marginBottom: '16px', textAlign: 'center', fontSize: '1rem' }}>{error}</p>}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: '#2563eb', marginBottom: '8px', fontWeight: '500' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: fieldErrors.email ? '1.5px solid #ef4444' : '1.5px solid #2563eb',
              fontSize: '1rem',
              color: '#2563eb',
              background: '#fff',
              outline: 'none',
            }}
          />
          {fieldErrors.email && <p style={{ color: '#ef4444', fontSize: '0.95rem', marginTop: '4px' }}>{fieldErrors.email}</p>}
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', color: '#2563eb', marginBottom: '8px', fontWeight: '500' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: fieldErrors.password ? '1.5px solid #ef4444' : '1.5px solid #2563eb',
              fontSize: '1rem',
              color: '#2563eb',
              background: '#fff',
              outline: 'none',
            }}
          />
          {fieldErrors.password && <p style={{ color: '#ef4444', fontSize: '0.95rem', marginTop: '4px' }}>{fieldErrors.password}</p>}
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            background: '#2563eb',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          Login
        </button>
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <span style={{ color: '#4b5563', fontSize: '1rem' }}>Don't have an account? </span>
          <a href="/register" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'underline', fontSize: '1rem' }}>Register</a>
        </div>
      </form>
    </div>
  );
}
