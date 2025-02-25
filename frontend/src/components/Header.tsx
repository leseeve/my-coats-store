import React, { useState } from 'react';
import Link from 'next/link';
import { RiCloseLargeFill } from 'react-icons/ri';  // Импортируем новую иконку
import { GoPerson, GoHeart, GoSearch } from 'react-icons/go';
import { IoBagOutline } from 'react-icons/io5';
import { RxHamburgerMenu } from 'react-icons/rx';
import styles from '@/styles/Header.module.scss';

export const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);

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

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          {/* Левая колонка */}
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
      </header>

      {/* Оверлей поиска */}
      {searchOpen && (
        <div className={styles.searchOverlay} onClick={handleCloseSearch}>
          <div
            className={styles.searchContent}
            onClick={(e) => e.stopPropagation()}
          >
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
          <RiCloseLargeFill size={25} />  {/* Новый крестик с размером 25px */}
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
    </>
  );
};

export default Header;
