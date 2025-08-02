import React from 'react';
import styles from '../dashboard.module.css';

interface UserTableProps {
  users: any[];
  onEdit: (user: any) => void;
  onDelete: (userId: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => (
  <div className={styles.tableContainer}>
    <table className={styles.table}>
      <thead>
        <tr className={styles.theadRow}>
          <th className={styles.th}>Name</th>
          <th className={styles.th}>Email</th>
          <th className={styles.th}>Role</th>
          <th className={styles.th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, idx) => (
          <tr key={user.id} style={{ background: idx % 2 === 0 ? '#fff' : '#f9fafb' }}>
            <td className={styles.td}>{user.name}</td>
            <td className={styles.td}>{user.email}</td>
            <td className={styles.td}>{user.role}</td>
            <td className={styles.td}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className={`${styles.actionButton} ${styles.editButton}`} onClick={() => onEdit(user)}>Edit</button>
                <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => onDelete(user.id)}>Delete</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default UserTable;
