import React from 'react';
import styles from '../dashboard.module.css';

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => (
  <nav className={styles.navbar}>
    <span className={styles.navTitle}>User Management</span>
    <button className={styles.logoutButton} onClick={onLogout}>Log Out</button>
  </nav>
);

export default Navbar;
