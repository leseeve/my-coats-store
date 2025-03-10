import React from 'react';
import Head from 'next/head';
import AccountLayout from '@/components/AccountLayout';
import styles from '@/styles/Orders.module.scss';
import Link from 'next/link';
import Image from 'next/image';

interface Order {
    id: string;
    status: string;
    date: string;
    products: { id: string; image: string }[];
    total: number;
}

const orders: Order[] = [
    {
        id: '12345',
        status: 'Выполнен',
        date: 'от 10.02.2025 14:22:00',
        products: [
            { id: '1', image: '/images/coat1.jpg' },
            { id: '2', image: '/images/coat2.jpg' },
        ],
        total: 5999,
    },
    {
        id: '12346',
        status: 'Ожидает оплаты',
        date: 'от 09.02.2025 18:45:00',
        products: [
            { id: '3', image: '/images/coat3.jpg' },
            { id: '4', image: '/images/coat4.jpg' },
        ],
        total: 12999,
    },
];

const Orders: React.FC = () => {
    return (
        <>
            <Head>
                <title>Заказы | MyCoats</title>
            </Head>
            <AccountLayout>
                <div className={styles.orders}>
                    {orders.length > 0 ? (
                        <>
                            <h1>Мои заказы</h1>
                            <div className={styles.ordersList}>
                                {orders.map((order) => (
                                    <Link key={order.id} href={`/order/${order.id}`} className={styles.orderCard}>
                                        <div className={styles.orderHeader}>
                                            <span className={styles.orderStatus}>{order.status}</span>
                                            <span className={styles.orderId}>{order.id}</span>
                                            <span className={styles.orderDate}>{order.date}</span>
                                        </div>
                                        <div className={styles.orderProducts}>
                                            {order.products.map((product) => (
                                                <div key={product.id} className={styles.productImage}>
                                                    <Image
                                                        src={product.image}
                                                        alt={`product-${product.id}`}
                                                        width={60}
                                                        height={80}
                                                        objectFit="cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className={styles.orderTotal}>
                                            <span className={styles.totalPrice}>{order.total.toLocaleString()} ₽</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className={styles.emptyOrders}>
                            <p>Мои заказы</p>
                        </div>
                    )}
                </div>
            </AccountLayout>
        </>
    );
};

export default Orders;

