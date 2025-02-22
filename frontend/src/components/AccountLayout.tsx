// src/components/AccountLayout.tsx
import React, { useState } from 'react';
import SidebarAccount from './SidebarAccount';
import Header from './Header';
import Footer from './Footer';
import styles from '@/styles/AccountLayout.module.scss';

interface AccountLayoutProps {
    children: React.ReactNode;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.accountLayout}>
                <Header />
                <div className={styles.mainContentWrapper}>
                    <div className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.open : ''}`}>
                        <SidebarAccount />
                    </div>
                    <div className={`${styles.contentWrapper} ${sidebarOpen ? styles.hidden : ''}`}>
                        <button className={styles.sidebarToggle} onClick={toggleSidebar}>
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path fill="#333" d="M12 16l-6-6h12z" />
                            </svg>
                            <span className={styles.toggleText}>Мой кабинет</span>
                        </button>
                        {children}
                    </div>
                </div>
            </div>
            <div className={styles.footerWrapper}>
                <Footer />
            </div>
        </div>
    );
};

export default AccountLayout;
