// src/pages/wishlist.tsx
import React from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccountLayout from '@/components/AccountLayout';
import { ProductCard } from '@/components/ProductCard';
import styles from '@/styles/Wishlist.module.scss';

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
    // Добавьте другие товары по необходимости
];

const Wishlist: React.FC = () => {
    return (
        <>
            <Head>
                <title>Избранное | Unholy Place</title>
            </Head>
            <Header />
            <AccountLayout>
                <div className={styles.wishlist}>
                    <h1>Избранное</h1>
                    <div className={styles.productsGrid}>
                        {products.map((p) => (
                            <ProductCard
                                key={p.id}
                                id={p.id}
                                title={p.title}
                                price={p.price}
                                images={p.images}
                                availableSizes={p.availableSizes}
                            />
                        ))}
                    </div>
                </div>
            </AccountLayout>
            <Footer />
        </>
    );
};

export default Wishlist;

