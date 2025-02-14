// src/layouts/PageLayout.tsx
import React from 'react';
import Footer from '@/components/Footer';
import { Header } from '@/components/Header';
import styles from '@/styles/PageLayout.module.scss';

export const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.mainContent}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;