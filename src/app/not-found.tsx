import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f9fafb',
      color: '#111827',
      fontFamily: 'inherit',
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '24px' }}>404</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '32px' }}>Page Not Found</p>
     
    </div>
  );
}
