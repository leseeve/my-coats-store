import React, { useState, useEffect } from 'react';
import { RiCloseLargeFill } from 'react-icons/ri';
import { GoPerson, GoHeart, GoSearch } from 'react-icons/go';
import { IoBagOutline } from 'react-icons/io5';
import { RxHamburgerMenu } from 'react-icons/rx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { transliterate } from '@/utils/transliterate';
import styles from '@/styles/Header.module.scss';

export const Header = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();

  const handleToggleFilters = () => setFiltersOpen((prev) => !prev);
  const handleCloseFilters = () => setFiltersOpen(false);
  const handleOpenSearch = () => setSearchOpen(true);
  const handleCloseSearch = () => setSearchOpen(false);

  const handleApplySearch = () => {
    setSearchOpen(false);
    router.push('/catalog');
  };

  const handleCategoryClick = (category: string) => {
    setFiltersOpen(false);
    if (category === 'Каталог') {
      router.push('/catalog');
    } else {
      const slug = transliterate(category);
      router.push(`/catalog/${slug}`);
    }
  };

  useEffect(() => {
    if (!filtersOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Element;
      if (
        target &&
        !target.closest(`.${styles.filtersContainer}`) &&
        !target.closest(`.${styles.filtersButton}`)
      ) {
        setFiltersOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [filtersOpen]);

  useEffect(() => {
    document.body.style.overflow = filtersOpen ? 'hidden' : '';
  }, [filtersOpen]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.left}>
            <div className={styles.burgerIcon} onClick={handleToggleFilters}>
              <RxHamburgerMenu />
            </div>
            <div className={styles.logoMobile}>
              <Link href="/">UnholyPlace</Link>
            </div>
          </div>
          <div className={styles.center}>
            <div className={styles.logo}>
              <Link href="/">UnholyPlace</Link>
            </div>
          </div>
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
      </header>

      {searchOpen && (
        <div
          className={`${styles.searchOverlay} ${searchOpen ? styles.active : ''}`}
          onClick={handleCloseSearch}
        >
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
              Применить поиск
            </button>
            <button className={styles.closeBtn} onClick={handleCloseSearch}>
              Закрыть
            </button>
          </div>
        </div>
      )}

      <div
        className={`${styles.filtersOverlay} ${filtersOpen ? styles.active : ''}`}
        onClick={handleCloseFilters}
      >
        <div
          className={`${styles.filtersContainer} ${filtersOpen ? styles.active : ''}`}
        >
          <div className={styles.filtersHeader}>
            <button onClick={handleCloseFilters} className={styles.closeButton}>
              <RiCloseLargeFill />
            </button>
          </div>
          <ul>
            <li className={styles.catalogTitle} onClick={() => handleCategoryClick('Каталог')}>
              Каталог
            </li>
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
    </>
  );
};

export default Header;
