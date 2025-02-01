import React from 'react';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};