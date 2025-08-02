import React, { useState } from 'react';
import axios from 'axios';
import styles from './userform.module.css';

export default function UserForm({ onClose, onUserAdded }: { onClose: () => void, onUserAdded: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:8000/api/users', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        onUserAdded();
        onClose();
      }
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error('Error adding user:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.userformModal}>
      <div className={styles.userformContainer}>
        <div className={styles.userformHeader}>
          <h2 className={styles.userformTitle}>Add New User</h2>
          <button 
            onClick={onClose}
            className={styles.userformClose}
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label className={styles.userformLabel}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`${styles.userformInput}${errors.name ? ' ' + styles.error : ''}`}
              required
            />
            {errors.name && <p className={styles.userformError}>{errors.name}</p>}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label className={styles.userformLabel}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.userformInput}${errors.email ? ' ' + styles.error : ''}`}
              required
            />
            {errors.email && <p className={styles.userformError}>{errors.email}</p>}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label className={styles.userformLabel}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`${styles.userformInput}${errors.password ? ' ' + styles.error : ''}`}
              required
            />
            {errors.password && <p className={styles.userformError}>{errors.password}</p>}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label className={styles.userformLabel}>Confirm Password</label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className={styles.userformInput}
              required
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label className={styles.userformLabel}>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={styles.userformInput}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className={styles.userformActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.userformBtnCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.userformBtnSubmit}
            >
              {isSubmitting ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
