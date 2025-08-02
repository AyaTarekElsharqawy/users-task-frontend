import React from 'react';
import styles from '../dashboard.module.css';

interface DeleteModalProps {
  onCancel: () => void;
  onDelete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ onCancel, onDelete }) => (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      <h3 className={styles.modalTitle}>Confirm Deletion</h3>
      <p className={styles.modalText}>Are you sure you want to delete this user? This action cannot be undone.</p>
      <div className={styles.formActions}>
        <button className={styles.cancelButton} onClick={onCancel}>Cancel</button>
        <button className={styles.deleteButton} onClick={onDelete}>Delete</button>
      </div>
    </div>
  </div>
);

export default DeleteModal;
