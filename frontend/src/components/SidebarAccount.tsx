// src/components/SidebarAccount.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/styles/SidebarAccount.module.scss';

interface NavItem {
    label: string;
    href: string;
}

const primaryNavItems: NavItem[] = [
    { label: 'МОЙ ПРОФИЛЬ', href: '/profile' },
    { label: 'ИЗБРАННОЕ', href: '/wishlist' },
    { label: 'МОИ ЗАКАЗЫ', href: '/orders' },
];

const secondaryNavItems: NavItem[] = [
    { label: 'ДОСТАВКА И ВОЗВРАТ', href: '/shipping-and-return' },
    { label: 'УВЕДОМЛЕНИЯ', href: '/notifications' },
    { label: 'СЛУЖБА ПОДДЕРЖКИ', href: '/contacts' },
    { label: 'ВЫЙТИ', href: '/logout' },
];

const SidebarAccount: React.FC = () => {
    const router = useRouter();

    const handleLogout = () => {
        // Здесь можно добавить логику очистки сессии/токенов, если необходимо
        // Например: localStorage.removeItem('authToken');
        router.push('/'); // Перенаправляем на главную страницу
    };

    return (
        <div className={styles.sidebar}>
            <nav className={styles.nav}>
                <div className={styles.primaryGroup}>
                    {primaryNavItems.map((item) => {
                        const isActive = router.pathname === item.href;
                        return (
                            <Link
                                href={item.href}
                                key={item.href}
                                className={`${styles.primaryNavLink} ${isActive ? styles.active : ''}`}
                            >
                                <span className={styles.linkText}>{item.label}</span>
                                <span className={styles.indicator}></span>
                            </Link>
                        );
                    })}
                </div>
                <div className={styles.secondaryGroup}>
                    {secondaryNavItems.map((item) => {
                        const isActive = router.pathname === item.href;
                        if (item.label === 'ВЫЙТИ') {
                            // Рендерим кнопку вместо ссылки для выхода
                            return (
                                <button
                                    key={item.href}
                                    onClick={handleLogout}
                                    className={`${styles.secondaryNavLink} ${isActive ? styles.active : ''}`}
                                >
                                    <span className={styles.linkText}>{item.label}</span>
                                    <span className={styles.indicator}></span>
                                </button>
                            );
                        }
                        return (
                            <Link
                                href={item.href}
                                key={item.href}
                                className={`${styles.secondaryNavLink} ${isActive ? styles.active : ''}`}
                            >
                                <span className={styles.linkText}>{item.label}</span>
                                <span className={styles.indicator}></span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default SidebarAccount;

