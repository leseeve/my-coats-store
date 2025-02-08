// src/pages/orders.tsx
import React from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccountLayout from '@/components/AccountLayout';
import styles from '@/styles/Orders.module.scss';

const orders = [
    { id: 1, title: 'Заказ №1', date: '2024-01-01', total: '3599 ₽' },
    { id: 2, title: 'Заказ №2', date: '2024-02-01', total: '10999 ₽' },
];

const Orders: React.FC = () => {
    return (
        <>
            <Head>
                <title>Заказы | Unholy Place</title>
            </Head>
            <Header />
            <AccountLayout>
                <div className={styles.orders}>
                    <h1>Заказы</h1>
                    <div className={styles.ordersList}>
                        {orders.map((order) => (
                            <div key={order.id} className={styles.orderCard}>
                                <h2>{order.title}</h2>
                                <p>Дата: {order.date}</p>
                                <p>Сумма: {order.total}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </AccountLayout>
            <Footer />
        </>
    );
};

export default Orders;
