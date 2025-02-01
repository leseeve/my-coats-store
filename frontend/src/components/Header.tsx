import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.scss';

export const Header = () => {
  // Состояние для оверлея поиска
  const [searchOpen, setSearchOpen] = useState(false);

  // При клике на «Поиск»
  const handleOpenSearch = () => {
    setSearchOpen(true);
  };

  // Закрыть поиск (клик по фону или ESC и т.д.)
  const handleCloseSearch = () => {
    setSearchOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          {/* Лого по центру */}
          <div className={styles.logo}>
            <Link href="/">UnholyPlace</Link>
          </div>
          {/* Справа четыре ссылки-иконки */}
          <div className={styles.iconLinks}>
            {/* Поиск */}
            <button onClick={handleOpenSearch}>
              <Image
                src="/icons/search.svg"
                alt="Поиск"
                width={24}
                height={24}
              />
            </button>
            {/* Личный кабинет */}
            <Link href="/orders">
              <Image
                src="/icons/user.svg"
                alt="Личный кабинет"
                width={24}
                height={24}
              />
            </Link>
            {/* Избранное */}
            <Link href="/wishlist">
              <Image
                src="/icons/heart.svg"
                alt="Избранное"
                width={24}
                height={24}
              />
            </Link>
            {/* Корзина */}
            <Link href="/cart">
              <Image
                src="/icons/cart.svg"
                alt="Корзина"
                width={24}
                height={24}
              />
            </Link>
          </div>
        </div>
      </header>
      {/* Оверлей поиска */}
      {searchOpen && (
        <div className={styles.searchOverlay} onClick={handleCloseSearch}>
          {/* Останавливаем всплытие клика, чтобы клик внутри поля не закрывал */}
          <div className={styles.searchContent} onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              placeholder="Поиск..."
              className={styles.searchInput}
            />
            {/* Закрыть оверлей кнопкой (при желании) */}
            <button className={styles.closeBtn} onClick={handleCloseSearch}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
};