'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './components/Navbar';
import UserForm from './components/UserForm';
import EditUserForm from './components/EditUserForm';
import DeleteModal from './components/DeleteModal';
import UserTable from './components/UserTable';
import Pagination from './components/Pagination';
import { fetchUsers as fetchUsersApi, addUser, updateUser, deleteUser } from './actions/users';
import styles from './dashboard.module.css';


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
      const response = await fetchUsersApi(token || '', currentPage);
      if (response && response.success) {
        let filtered = response.data;
        if (search) {
          filtered = filtered.filter((user: any) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.role.toLowerCase().includes(search.toLowerCase())
          );
        }
        setUsers(filtered);
        setTotalPages(response.pagination.last_page);
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

  // Automatically refresh users when token changes (e.g., after login)
  useEffect(() => {
    const handleStorageChange = () => {
      fetchUsers();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleUserAdded = async () => {
    await fetchUsers();
  };

  const handleUserUpdated = async (updatedUser?: any) => {
    if (updatedUser) {
      setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    } else {
      await fetchUsers();
    }
  };

  const handleDelete = async (userId: number) => {
    const token = localStorage.getItem('token');
    try {
      await deleteUser(token || '', userId);
      // Remove user from local state immediately
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      // Optionally update pagination if needed
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
      const response = await updateUser(token || '', editingUser.id, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
      });
      if (response && response.success && response.data) {
        await handleUserUpdated(response.data);
      } else {
        await handleUserUpdated();
      }
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar onLogout={handleLogout} />
      <div style={{ padding: '32px' }}>
        <div className={styles.topRow}>
          <button className={styles.addUserButton} onClick={() => setShowAddUserForm(true)}>
            + Add New User
          </button>
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <UserTable users={users} onEdit={handleEdit} onDelete={id => setUserToDelete(id)} />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
      {showAddUserForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', maxWidth: '500px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', position: 'relative', color: '#111' }}>
            <button
              onClick={() => setShowAddUserForm(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', fontSize: '1.5rem', color: '#888', cursor: 'pointer' }}
              aria-label="Close"
            >×</button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', color: '#111', textAlign: 'center' }}>Add New User</h2>
            <UserForm onClose={() => setShowAddUserForm(false)} onUserAdded={handleUserAdded} />
          </div>
        </div>
      )}
      {/* Modal Edit Form */}
      {showEditForm && editingUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', maxWidth: '500px', width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <EditUserForm editingUser={editingUser} onClose={() => setShowEditForm(false)} onEditSubmit={handleEditSubmit} setEditingUser={setEditingUser} />
          </div>
        </div>
      )}
      {/* Modal Delete Confirmation */}
      {userToDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', maxWidth: '400px', width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px', color: '#111827' }}>Confirm Deletion</h3>
            <p style={{ marginBottom: '24px', color: '#4b5563' }}>Are you sure you want to delete this user? This action cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white', color: '#111827', fontWeight: '500', cursor: 'pointer' }}
                onClick={() => setUserToDelete(null)}
              >Cancel</button>
              <button
                style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#ef4444', color: 'white', fontWeight: '500', cursor: 'pointer' }}
                onClick={() => handleDelete(userToDelete)}
              >Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;