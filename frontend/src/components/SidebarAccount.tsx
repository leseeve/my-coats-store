// src/components/SidebarAccount.tsx
import React from 'react';
import Link from 'next/link';
import styles from '@/styles/SidebarAccount.module.scss';

const SidebarAccount: React.FC = () => {
    return (
        <div className={styles.sidebar}>
            <nav className={styles.nav}>
                <Link href="/profile" className={styles.navLink}>Мой профиль</Link>
                <Link href="/wishlist" className={styles.navLink}>Избранное</Link>
                <Link href="/orders" className={styles.navLink}>Заказы</Link>
                <Link href="/orders" className={styles.navLink}>Возврат</Link>
                <Link href="/orders" className={styles.navLink}>Доставка</Link>
                <Link href="/orders" className={styles.navLink}>Поддержка</Link>
                <Link href="/orders" className={styles.navLink}>Вопросы и ответы</Link>
            </nav>
        </div>
    );
};

export default SidebarAccount;
