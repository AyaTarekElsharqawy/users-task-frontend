import React from 'react';
import styles from '../dashboard.module.css';

interface EditUserFormProps {
  editingUser: any;
  onClose: () => void;
  onEditSubmit: (e: React.FormEvent) => void;
  setEditingUser: (user: any) => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ editingUser, onClose, onEditSubmit, setEditingUser }) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  if (!editingUser) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!editingUser.name || !editingUser.name.trim()) newErrors.name = 'Name is required';
    if (!editingUser.email || !editingUser.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingUser.email)) newErrors.email = 'Please enter a valid email';
    if (!editingUser.role || !['user', 'admin'].includes(editingUser.role)) newErrors.role = 'Role is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onEditSubmit(e);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100px' }}>
      <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.10)', width: '100%', maxWidth: '500px', border: '2px solid #2563eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>Edit User</h2>
          <button style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }} onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#111827' }}>Name</label>
            <input type="text" name="name" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: errors.name ? '1px solid #ef4444' : '1px solid #d1d5db', fontSize: '1rem', color: '#111827' }} />
            {errors.name && <p style={{ color: '#ef4444', fontSize: '0.95rem', marginTop: '4px' }}>{errors.name}</p>}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#111827' }}>Email</label>
            <input type="email" name="email" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db', fontSize: '1rem', color: '#111827' }} />
            {errors.email && <p style={{ color: '#ef4444', fontSize: '0.95rem', marginTop: '4px' }}>{errors.email}</p>}
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#111827' }}>Role</label>
            <select name="role" value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: errors.role ? '1px solid #ef4444' : '1px solid #d1d5db', fontSize: '1rem', backgroundColor: 'white', color: '#111827' }}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <p style={{ color: '#ef4444', fontSize: '0.95rem', marginTop: '4px' }}>{errors.role}</p>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white', color: '#111827', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: '#2563eb', color: 'white', fontWeight: '500', cursor: 'pointer' }}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserForm;
