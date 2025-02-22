import React, { useState } from 'react';
import Link from 'next/link';
import { GoPerson, GoHeart, GoSearch, } from "react-icons/go";
import { IoBagOutline } from "react-icons/io5";
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