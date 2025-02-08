import React from 'react';
import Head from 'next/head';
import Header from '@/components/HeaderNew';
import CategoriesSection from '@/components/CategoriesSection';
import NewSection from '@/components/NewSection';
import CompanyDesc from '@/components/CompanyDesc';
import Footer from '@/components/Footer';



const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Интернет-магазин одежды</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Header />
      <main>
        <CategoriesSection />
        <NewSection />
        <CompanyDesc />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;


