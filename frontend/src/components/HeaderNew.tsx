import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { RiCloseLargeFill } from 'react-icons/ri';  // Импорт новой иконки
import { GoPerson, GoHeart, GoSearch } from 'react-icons/go';
import { IoBagOutline } from 'react-icons/io5';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useRouter } from 'next/router';
import { transliterate } from '@/pages/api/utils/transliterate';
import styles from '@/styles/HeaderNew.module.scss';

const HeaderNew: React.FC = () => {
    const [searchOpen, setSearchOpen] = useState(false);
    const [catalogOpen, setCatalogOpen] = useState(false);
    const router = useRouter();

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

    // Открытие/закрытие меню (каталога)
    const handleToggleCatalog = () => {
        setCatalogOpen((prev) => !prev);
    };

    // Закрыть меню (каталога)
    const handleCloseCatalog = () => {
        setCatalogOpen(false);
    };

    // Обработчик кнопки "Применить поиск"
    const handleApplySearch = () => {
        setSearchOpen(false);
        router.push('/catalog');
    };

    // Переход на страницу выбранной категории
    const handleCategoryClick = (category: string) => {
        setCatalogOpen(false);
        if (category === 'Каталог') {
            router.push('/catalog');
        } else {
            const slug = transliterate(category);
            router.push(`/catalog/${slug}`);
        }
    };

    const handleScrollDown = () => {
        const headerEl = headerRef.current;
        if (!headerEl) return;
        const topBarHeight = 80;
        window.scrollTo({ top: headerEl.offsetHeight - topBarHeight, behavior: 'smooth' });
    };

    return (
        <header ref={headerRef} className={styles.header}>
            {/* Фоновое видео */}
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
                        {/* Мобильный логотип */}
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
                            <Link href="/profile" className={styles.LinkIcon}>
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
                    <div className={`${styles.searchWrapper} ${searchOpen ? styles.active : ''}`}
                        onClick={(e) => e.stopPropagation()}>
                        <div
                            className={`${styles.searchContent} ${searchOpen ? styles.active : ''}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <input
                                type="text"
                                placeholder="Поиск..."
                                className={styles.searchInput}
                            />
                            <button className={styles.applySearchBtn} onClick={handleApplySearch}>
                                Найти
                            </button>
                        </div>
                    </div>
                </div>
            )
            }

            {/* Панель меню (каталога) */}
            <div
                className={`${styles.filtersOverlay} ${catalogOpen ? styles.active : ''}`}
                onClick={handleCloseCatalog}
            >
                <div
                    className={`${styles.filtersContainer} ${catalogOpen ? styles.active : ''}`}
                >
                    <div className={styles.filtersHeader}>
                        <button onClick={handleCloseCatalog} className={styles.closeButton}>
                            <RiCloseLargeFill />
                        </button>
                    </div>
                    <ul>
                        <li className={styles.catalogTitle} onClick={() => handleCategoryClick('Каталог')}>Каталог</li>
                        <li onClick={() => handleCategoryClick('Пальто')}>Пальто</li>
                        <li onClick={() => handleCategoryClick('Платья')}>Платья</li>
                        <li onClick={() => handleCategoryClick('Пиджаки')}>Пиджаки</li>
                        <li onClick={() => handleCategoryClick('Рубашки')}>Рубашки</li>
                        <li onClick={() => handleCategoryClick('Блузы')}>Блузы</li>
                        <li onClick={() => handleCategoryClick('Юбки')}>Юбки</li>
                        <li onClick={() => handleCategoryClick('Брюки')}>Брюки</li>
                        <li onClick={() => handleCategoryClick('Жакеты')}>Жакеты</li>
                        <li onClick={() => handleCategoryClick('Плащи')}>Плащи</li>
                        <li onClick={() => handleCategoryClick('Куртки')}>Куртки</li>
                    </ul>
                    <hr />
                    <ul>
                        <li>Доставка и Возврат</li>
                        <li>Служба Поддержки</li>
                    </ul>
                </div>
            </div>

            {/* Кнопка прокрутки вниз */}
            <button className={styles.scrollDownBtn} onClick={handleScrollDown}>
                <span>К покупкам</span>
            </button>
        </header >
    );
};

export default HeaderNew;
