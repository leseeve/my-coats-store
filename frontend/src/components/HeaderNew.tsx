import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/HeaderNew.module.scss';

const HeaderNew: React.FC = () => {
    const headerRef = useRef<HTMLElement>(null);
    const topBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const headerEl = headerRef.current;
        const topBarEl = topBarRef.current;
        if (!headerEl || !topBarEl) return;

        const handleScroll = () => {
            const videoHeight = headerEl.offsetHeight / 2;
            if (window.scrollY > videoHeight) {
                topBarEl.classList.add(styles.scrolled);
            } else {
                topBarEl.classList.remove(styles.scrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScrollDown = () => {
        const headerEl = headerRef.current;
        if (!headerEl) return;
        const topBarHeight = 80;
        window.scrollTo({ top: headerEl.offsetHeight - topBarHeight, behavior: 'smooth' });
    };

    return (
        <header ref={headerRef} className={styles.header}>
            <div className={styles.videoContainer}>
                <video src="/videos/uzori.mp4" autoPlay muted loop playsInline></video>
            </div>
            <div ref={topBarRef} className={styles.topBar}>
                <div className={styles.headerContainer}>
                    <div className={styles.logo}>
                        <Link href="/">UnholyPlace</Link>
                    </div>
                    <div className={styles.iconLinks}>
                        <Link href="/catalog">
                            <Image src="/icons/search.svg" alt="Поиск" width={24} height={24} />
                        </Link>
                        <Link href="/orders">
                            <Image src="/icons/user.svg" alt="Личный кабинет" width={24} height={24} />
                        </Link>
                        <Link href="/wishlist">
                            <Image src="/icons/heart.svg" alt="Избранное" width={24} height={24} />
                        </Link>
                        <Link href="/cart">
                            <Image src="/icons/cart.svg" alt="Корзина" width={24} height={24} />
                        </Link>
                    </div>
                </div>
            </div>
            <button className={styles.scrollDownBtn} onClick={handleScrollDown}>
                <span>К покупкам</span>
            </button>
        </header>
    );
};

export default HeaderNew;

