import React, { useState, useEffect } from 'react';
import { RiCloseLargeFill } from 'react-icons/ri';
import { GoPerson, GoHeart, GoSearch } from 'react-icons/go';
import { IoBagOutline } from 'react-icons/io5';
import { RxHamburgerMenu } from 'react-icons/rx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { transliterate } from '@/pages/api/utils/transliterate';
import styles from '@/styles/Header.module.scss';

export const Header = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Каталог');
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
    setActiveCategory(category);
    if (category === 'Каталог') {
      router.push('/catalog');
    } else {
      const slug = transliterate(category);
      router.push(`/catalog/${slug}`);
    }
  };

  // Синхронизация activeCategory с параметром маршрута
  useEffect(() => {
    if (router.query.category) {
      const categories = ['Пальто', 'Платья', 'Пиджаки', 'Рубашки', 'Блузы', 'Юбки', 'Брюки', 'Жакеты', 'Плащи', 'Куртки'];
      const queryCategory = router.query.category as string;
      const found = categories.find(cat => transliterate(cat) === queryCategory);
      if (found) {
        setActiveCategory(found);
      } else {
        setActiveCategory('Каталог');
      }
    } else {
      setActiveCategory('Каталог');
    }
  }, [router.query.category]);

  // Закрытие фильтров при клике вне контейнера
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

  // Блокировка скролла при открытых фильтрах
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
            <li
              className={`${styles.catalogTitle} ${activeCategory === 'Каталог' ? styles.active : ''}`}
              onClick={() => handleCategoryClick('Каталог')}
            >
              Каталог
            </li>
            <li
              className={activeCategory === 'Пальто' ? styles.active : ''}
              onClick={() => handleCategoryClick('Пальто')}
            >
              Пальто
            </li>
            <li
              className={activeCategory === 'Платья' ? styles.active : ''}
              onClick={() => handleCategoryClick('Платья')}
            >
              Платья
            </li>
            <li
              className={activeCategory === 'Пиджаки' ? styles.active : ''}
              onClick={() => handleCategoryClick('Пиджаки')}
            >
              Пиджаки
            </li>
            <li
              className={activeCategory === 'Рубашки' ? styles.active : ''}
              onClick={() => handleCategoryClick('Рубашки')}
            >
              Рубашки
            </li>
            <li
              className={activeCategory === 'Блузы' ? styles.active : ''}
              onClick={() => handleCategoryClick('Блузы')}
            >
              Блузы
            </li>
            <li
              className={activeCategory === 'Юбки' ? styles.active : ''}
              onClick={() => handleCategoryClick('Юбки')}
            >
              Юбки
            </li>
            <li
              className={activeCategory === 'Брюки' ? styles.active : ''}
              onClick={() => handleCategoryClick('Брюки')}
            >
              Брюки
            </li>
            <li
              className={activeCategory === 'Жакеты' ? styles.active : ''}
              onClick={() => handleCategoryClick('Жакеты')}
            >
              Жакеты
            </li>
            <li
              className={activeCategory === 'Плащи' ? styles.active : ''}
              onClick={() => handleCategoryClick('Плащи')}
            >
              Плащи
            </li>
            <li
              className={activeCategory === 'Куртки' ? styles.active : ''}
              onClick={() => handleCategoryClick('Куртки')}
            >
              Куртки
            </li>
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
