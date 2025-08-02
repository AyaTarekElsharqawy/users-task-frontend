'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

function UserForm({ onClose, onUserAdded }: { onClose: () => void, onUserAdded: () => void }) {
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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>Add New User</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#111827' }}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: errors.name ? '1px solid #ef4444' : '1px solid #d1d5db',
                fontSize: '1rem',
                color: '#111827' // Set text color to black
              }}
            />
            {errors.name && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px' }}>{errors.name}</p>}
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#111827' }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db',
                fontSize: '1rem',
                color: '#111827' // Set text color to black
              }}
            />
            {errors.email && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px' }}>{errors.email}</p>}
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#111827' }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: errors.password ? '1px solid #ef4444' : '1px solid #d1d5db',
                fontSize: '1rem',
                color: '#111827' // Set text color to black
              }}
            />
            {errors.password && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px' }}>{errors.password}</p>}
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#111827' }}>Confirm Password</label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: errors.password_confirmation ? '1px solid #ef4444' : '1px solid #d1d5db',
                fontSize: '1rem',
                color: '#111827' // Set text color to black
              }}
            />
            {errors.password_confirmation && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px' }}>{errors.password_confirmation}</p>}
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#111827' }}>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '1rem',
                backgroundColor: 'white',
                color: '#111827' // Set text color to black
              }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                background: 'white',
                color: '#111827',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '10px 20px',
                borderRadius: '6px',
                border: 'none',
                background: '#2563eb',
                color: 'white',
                fontWeight: '500',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const router = useRouter();

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:8000/api/users?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.success) {
        let filtered = response.data.data;
        if (search) {
          filtered = filtered.filter((user: any) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.role.toLowerCase().includes(search.toLowerCase())
          );
        }
        setUsers(filtered);
        setTotalPages(response.data.pagination.last_page);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error(error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, search]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleUserAdded = () => {
    fetchUsers();
  };

  const handleUserUpdated = (updatedUser?: any) => {
    if (updatedUser) {
      setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    } else {
      fetchUsers();
    }
  };

  const handleDelete = async (userId: number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setUserToDelete(null);
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setShowEditForm(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`http://localhost:8000/api/users/${editingUser.id}`, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data && response.data.success && response.data.data) {
        handleUserUpdated(response.data.data);
      } else {
        handleUserUpdated();
      }
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px', background: '#2563eb', color: 'white', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', boxShadow: '0 2px 8px rgba(37,99,235,0.08)' }}>
        <span style={{ fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: '1px' }}>User Management</span>
        <button
          style={{
            background: 'white',
            color: '#2563eb',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 18px',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
            transition: 'background 0.2s',
          }}
          onClick={handleLogout}
        >
          Log Out
        </button>
      </nav>

      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <button
            style={{
              padding: '10px 24px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 2px 8px rgba(37,99,235,0.1)',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onClick={() => setShowAddUserForm(true)}
          >
            + Add New User
          </button>
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '1rem',
              color: '#111827',
              width: '300px',
              marginLeft: '16px',
              background: '#f9fafb',
            }}
          />
        </div>
        <div style={{ overflowX: 'auto', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', borderRadius: '12px', background: '#fff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'inherit' }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{ padding: '16px', color: '#111827', fontWeight: 'bold', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Name</th>
                <th style={{ padding: '16px', color: '#111827', fontWeight: 'bold', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Email</th>
                <th style={{ padding: '16px', color: '#111827', fontWeight: 'bold', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Role</th>
                <th style={{ padding: '16px', color: '#111827', fontWeight: 'bold', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any, idx: number) => (
                <tr key={user.id} style={{ background: idx % 2 === 0 ? '#fff' : '#f9fafb' }}>
                  <td style={{ padding: '16px', color: '#111827', borderBottom: '1px solid #e5e7eb' }}>{user.name}</td>
                  <td style={{ padding: '16px', color: '#111827', borderBottom: '1px solid #e5e7eb' }}>{user.email}</td>
                  <td style={{ padding: '16px', color: '#111827', borderBottom: '1px solid #e5e7eb' }}>{user.role}</td>
                  <td style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEdit(user)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setUserToDelete(user.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '32px', gap: '12px' }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: currentPage === 1 ? '#e5e7eb' : '#2563eb',
              color: currentPage === 1 ? '#6b7280' : 'white',
              fontWeight: 'bold',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >Previous</button>
          <span style={{ color: '#111827', fontWeight: 'bold', fontSize: '1rem' }}>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: currentPage === totalPages ? '#e5e7eb' : '#2563eb',
              color: currentPage === totalPages ? '#6b7280' : 'white',
              fontWeight: 'bold',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >Next</button>
        </div>
      </div>

      {showAddUserForm && (
        <UserForm 
          onClose={() => setShowAddUserForm(false)} 
          onUserAdded={handleUserAdded}
        />
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px', color: '#111827' }}>Confirm Deletion</h3>
            <p style={{ marginBottom: '24px', color: '#4b5563' }}>Are you sure you want to delete this user? This action cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setUserToDelete(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  background: 'white',
                  color: '#111827',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(userToDelete)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#ef4444',
                  color: 'white',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Form */}
      {showEditForm && editingUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>Edit User</h2>
              <button 
                onClick={() => setShowEditForm(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#111827' }}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '1rem',
                    color: '#111827'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#111827' }}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '1rem',
                    color: '#111827'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#111827' }}>Role</label>
                <select
                  name="role"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    color: '#111827'
                  }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    background: 'white',
                    color: '#111827',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    background: '#2563eb',
                    color: 'white',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;