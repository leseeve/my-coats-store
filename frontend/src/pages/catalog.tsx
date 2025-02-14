// src/pages/catalog.tsx
import Head from 'next/head';
import { PageLayout } from '@/layouts/PageLayout';
import { ProductCard } from '@/components/ProductCard';
import styles from '@/styles/Catalog.module.scss';

export default function Catalog() {
  const products = [
    {
      id: 1,
      title: 'Жилет',
      price: 3599,
      images: ['/images/coat1.jpg', '/images/coat1_2.jpg'],
      availableSizes: [
        { size: 40, available: true },
        { size: 42, available: false },
        { size: 44, available: true },
      ],
    },
    {
      id: 2,
      title: 'Куртка',
      price: 10999,
      images: ['/images/coat2.jpg', '/images/coat2_2.jpg'],
      availableSizes: [
        { size: 40, available: true },
        { size: 42, available: false },
        { size: 44, available: true },
      ],
    },
    {
      id: 3,
      title: 'Пальто',
      price: 4999,
      images: ['/images/coat3.jpg', '/images/coat3_2.jpg'],
      availableSizes: [
        { size: 40, available: true },
        { size: 42, available: true },
        { size: 44, available: true },
      ],
    },
    {
      id: 4,
      title: 'Шуба',
      price: 12999,
      images: ['/images/coat4.jpg', '/images/coat4_2.jpg'],
      availableSizes: [
        { size: 40, available: true },
        { size: 42, available: false },
        { size: 44, available: true },
      ],
    },
    {
      id: 1,
      title: 'Жилет',
      price: 3599,
      images: ['/images/coat1.jpg', '/images/coat1_2.jpg'],
      availableSizes: [
        { size: 40, available: true },
        { size: 42, available: false },
        { size: 44, available: true },
      ],
    },
    {
      id: 2,
      title: 'Куртка',
      price: 10999,
      images: ['/images/coat2.jpg', '/images/coat2_2.jpg'],
      availableSizes: [
        { size: 40, available: true },
        { size: 42, available: false },
        { size: 44, available: true },
      ],
    },
    {
      id: 3,
      title: 'Пальто',
      price: 4999,
      images: ['/images/coat3.jpg', '/images/coat3_2.jpg'],
      availableSizes: [
        { size: 40, available: true },
        { size: 42, available: true },
        { size: 44, available: true },
      ],
    },
    {
      id: 4,
      title: 'Шуба',
      price: 12999,
      images: ['/images/coat4.jpg', '/images/coat4_2.jpg'],
      availableSizes: [
        { size: 40, available: true },
        { size: 42, available: false },
        { size: 44, available: true },
      ],
    },
    {
      id: 1,
      title: 'Жилет',
      price: 3599,
      images: ['/images/coat1.jpg', '/images/coat1_2.jpg'],
      availableSizes: [
        { size: 40, available: true },
        { size: 42, available: false },
        { size: 44, available: true },
      ],
    },
    {
      id: 2,
      title: 'Куртка',
      price: 10999,
      images: ['/images/coat2.jpg', '/images/coat2_2.jpg'],
      availableSizes: [
        { size: 40, available: true },
        { size: 42, available: false },
        { size: 44, available: true },
      ],
    },
    {
      id: 3,
      title: 'Пальто',
      price: 4999,
      images: ['/images/coat3.jpg', '/images/coat3_2.jpg'],
      availableSizes: [
        { size: 40, available: true },
        { size: 42, available: true },
        { size: 44, available: true },
      ],
    },
    {
      id: 4,
      title: 'Шуба',
      price: 12999,
      images: ['/images/coat4.jpg', '/images/coat4_2.jpg'],
      availableSizes: [
        { size: 40, available: true },
        { size: 42, available: false },
        { size: 44, available: true },
      ],
    },
    // Дополнительные товары можно добавить по необходимости
  ];

  return (
    <>
      <Head>
        <title>Каталог | MyCoats</title>
        <meta name="description" content="Каталог стильной верхней одежды" />
      </Head>
      <PageLayout>
        <section className={styles.catalog}>
          <h1>КАТАЛОГ ЖЕСКОЙ ОДЕЖДЫ</h1>
          <div className={styles.categories}>
            <button>Куртки</button>
            <button>Шубы</button>
            <button>Пальто</button>
          </div>
          <div className={styles.catalogGrid}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                images={product.images}
                availableSizes={product.availableSizes}
              />
            ))}
          </div>
        </section>
      </PageLayout>
    </>
  );
}




