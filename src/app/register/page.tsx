"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user', // default role
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const router = useRouter();

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    try {
      const response = await axios.post('http://localhost:8000/api/register', formData);
      if (response.data.success && response.data.token) {
        // Registration successful, redirect to login page
        router.push('/login');
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setError('Registration failed');
      }
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
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center', color: '#2563eb' }}>Register</h2>
        {error && <p style={{ color: '#ef4444', marginBottom: '16px', textAlign: 'center', fontSize: '1rem' }}>{error}</p>}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: '#2563eb', marginBottom: '8px', fontWeight: '500' }}>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: fieldErrors.name ? '1.5px solid #ef4444' : '1.5px solid #2563eb',
              fontSize: '1rem',
              color: '#2563eb',
              background: '#fff',
              outline: 'none',
            }}
          />
          {fieldErrors.name && <p style={{ color: '#ef4444', fontSize: '0.95rem', marginTop: '4px' }}>{fieldErrors.name}</p>}
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: '#2563eb', marginBottom: '8px', fontWeight: '500' }}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            
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
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: '#2563eb', marginBottom: '8px', fontWeight: '500' }}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            
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
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', color: '#2563eb', marginBottom: '8px', fontWeight: '500' }}>Confirm Password</label>
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: fieldErrors.password_confirmation ? '1.5px solid #ef4444' : '1.5px solid #2563eb',
              fontSize: '1rem',
              color: '#2563eb',
              background: '#fff',
              outline: 'none',
            }}
          />
          {fieldErrors.password_confirmation && <p style={{ color: '#ef4444', fontSize: '0.95rem', marginTop: '4px' }}>{fieldErrors.password_confirmation}</p>}
        </div>
        {/* Role is hidden, default is 'user' */}
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
          Register
        </button>
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <span style={{ color: '#4b5563', fontSize: '1rem' }}>Have an account? </span>
          <a href="/login" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'underline', fontSize: '1rem' }}>Login</a>
        </div>
      </form>
    </div>
  );
}
