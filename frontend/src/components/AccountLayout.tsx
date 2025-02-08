// src/components/AccountLayout.tsx
import React, { useState } from 'react';
import SidebarAccount from './SidebarAccount';
import styles from '@/styles/AccountLayout.module.scss';

interface AccountLayoutProps {
    children: React.ReactNode;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    return (
        <div className={styles.accountLayout}>
            <div className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.open : ''}`}>
                <SidebarAccount />
            </div>
            <div className={`${styles.contentWrapper} ${sidebarOpen ? styles.hidden : ''}`}>
                {/* Toggle-кнопка видна только на маленьких экранах */}
                <button className={styles.sidebarToggle} onClick={toggleSidebar}>
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <path fill="#333" d="M12 16l-6-6h12z" />
                    </svg>
                    <span className={styles.toggleText}>Мой кабинет</span>
                </button>
                {children}
            </div>
        </div>
    );
};

export default AccountLayout;
