import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Header.module.scss';

export const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  const handleOpenSearch = () => {
    setSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setSearchOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.logo}>
            <Link href="/">UnholyPlace</Link>
          </div>
          <div className={styles.iconLinks}>
            <button onClick={handleOpenSearch}>
              <Image src="/icons/search.svg" alt="Поиск" width={24} height={24} />
            </button>
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
      </header>
      {searchOpen && (
        <div className={styles.searchOverlay} onClick={handleCloseSearch}>
          <div className={styles.searchContent} onClick={(e) => e.stopPropagation()}>
            <input type="text" placeholder="Поиск..." className={styles.searchInput} />
            <button className={styles.closeBtn} onClick={handleCloseSearch}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;