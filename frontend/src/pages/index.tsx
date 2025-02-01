import Head from 'next/head';
import { useEffect } from 'react';
import { PageLayout } from '@/layouts/PageLayout';
import styles from '@/styles/Home.module.scss';

export default function Home() {
  useEffect(() => {
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
  }, []);

  return (
    <>
      <Head>
        <title>MyCoats - Главная</title>
        <meta name="description" content="Магазин верхней одежды" />
      </Head>
      <PageLayout>
        <section className={styles.hero}>
          <div className={styles.content}>
            <h1>Добро пожаловать в MyCoats!</h1>
            <p>Магазин стильной и качественной верхней одежды для всех.</p>
            <button>Посмотреть каталог</button>
          </div>
        </section>
      </PageLayout>
    </>
  );
}

