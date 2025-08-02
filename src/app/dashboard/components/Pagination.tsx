import React from 'react';
import styles from '../dashboard.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => (
  <div className={styles.pagination}>
    <button
      onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
      className={currentPage === 1 ? `${styles.pageButton} ${styles.pageButtonDisabled}` : `${styles.pageButton} ${styles.pageButtonActive}`}
    >Previous</button>
    <span className={styles.pageInfo}>Page {currentPage} of {totalPages}</span>
    <button
      onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages}
      className={currentPage === totalPages ? `${styles.pageButton} ${styles.pageButtonDisabled}` : `${styles.pageButton} ${styles.pageButtonActive}`}
    >Next</button>
  </div>
);

export default Pagination;
