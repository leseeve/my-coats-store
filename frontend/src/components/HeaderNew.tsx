import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { RiCloseLargeFill } from 'react-icons/ri';  // Импортируем новую иконку
import { GoPerson, GoHeart, GoSearch } from 'react-icons/go';
import { IoBagOutline } from 'react-icons/io5';
import { RxHamburgerMenu } from 'react-icons/rx';
import styles from '@/styles/HeaderNew.module.scss';

const HeaderNew: React.FC = () => {
    const [searchOpen, setSearchOpen] = useState(false);
    const [catalogOpen, setCatalogOpen] = useState(false);

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

    const handleOpenSearch = () => setSearchOpen(true);
    const handleCloseSearch = () => setSearchOpen(false);

    // Открытие/закрытие каталога
    const handleToggleCatalog = () => {
        setCatalogOpen((prev) => !prev);
    };

    // Закрыть каталог (клик по оверлею/крестику)
    const handleCloseCatalog = () => {
        setCatalogOpen(false);
    };

    const handleScrollDown = () => {
        const headerEl = headerRef.current;
        if (!headerEl) return;
        const topBarHeight = 80;
        window.scrollTo({ top: headerEl.offsetHeight - topBarHeight, behavior: 'smooth' });
    };

    return (
        <header ref={headerRef} className={styles.header}>
            {/* Видео фоновая картинка */}
            <div className={styles.videoContainer}>
                <video src="/videos/uzori.mp4" autoPlay muted loop playsInline></video>
            </div>

            {/* Верхняя панель */}
            <div ref={topBarRef} className={styles.topBar}>
                <div className={styles.headerContainer}>
                    {/* Левая колонка (бургер-иконка и мобильный логотип) */}
                    <div className={styles.left}>
                        {/* Бургер-иконка */}
                        <div className={styles.burgerIcon} onClick={handleToggleCatalog}>
                            <RxHamburgerMenu />
                        </div>

                        {/* Логотип для мобильных (скрыт на десктопе) */}
                        <div className={styles.logoMobile}>
                            <Link href="/">UnholyPlace</Link>
                        </div>
                    </div>

                    {/* Центральная колонка (логотип для десктопа) */}
                    <div className={styles.center}>
                        <div className={styles.logo}>
                            <Link href="/">UnholyPlace</Link>
                        </div>
                    </div>

                    {/* Правая колонка (иконки) */}
                    <div className={styles.right}>
                        <div className={styles.iconLinks}>
                            <button onClick={handleOpenSearch}>
                                <GoSearch />
                            </button>
                            <Link href="/orders" className={styles.LinkIcon}>
                                <GoPerson />
                            </Link>
                            <Link href="/wishlist" className={styles.LinkIcon}>
                                <GoHeart />
                            </Link>
                            <Link href="/cart" className={styles.LinkIcon}>
                                <IoBagOutline />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Оверлей поиска */}
            {searchOpen && (
                <div className={styles.searchOverlay} onClick={handleCloseSearch}>
                    <div className={styles.searchContent} onClick={(e) => e.stopPropagation()}>
                        <input
                            type="text"
                            placeholder="Поиск..."
                            className={styles.searchInput}
                        />
                        <button className={styles.closeBtn} onClick={handleCloseSearch}>
                            Закрыть
                        </button>
                    </div>
                </div>
            )}

            {/* Боковая панель каталога */}
            <div
                className={`${styles.sideNav} ${catalogOpen ? styles.sideNavOpen : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Кнопка закрытия (крестик) */}
                <button className={styles.closeNavBtn} onClick={handleCloseCatalog}>
                    <RiCloseLargeFill size={25} />
                </button>

                <nav className={styles.sideNavContent}>
                    <ul>
                        <li className={styles.catalogTitle}>Каталог</li>
                        <li>Пальто</li>
                        <li>Платья</li>
                        <li>Пиджаки</li>
                        <li>Рубашки</li>
                        <li>Блузы</li>
                        <li>Юбки</li>
                        <li>Брюки</li>
                        <li>Жакеты</li>
                        <li>Плащи</li>
                        <li>Куртки</li>
                    </ul>
                    <hr />
                    <ul>
                        <li>Доставка и Возврат</li>
                        <li>Служба Поддержки</li>
                    </ul>
                </nav>
            </div>

            {/* Полупрозрачный фон (overlay) */}
            {catalogOpen && (
                <div className={styles.fadeOverlay} onClick={handleCloseCatalog}></div>
            )}

            {/* Кнопка прокрутки вниз */}
            <button className={styles.scrollDownBtn} onClick={handleScrollDown}>
                <span>К покупкам</span>
            </button>
        </header>
    );
};

export default HeaderNew;
