// src/pages/order/[id].tsx
import React from 'react';
import Head from 'next/head';
import AccountLayout from '@/components/AccountLayout';
import styles from '@/styles/OrderDetails.module.scss';
import Image from 'next/image';

interface OrderProduct {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    sku: string;
    size: string;
}

interface OrderDetails {
    id: string;
    status: string;
    deliveryDate: string;
    deliveryMethod: string;
    paymentMethod: string;
    address: string;
    productsCost: number;
    shippingCost: number;
    total: number;
    products: OrderProduct[];
}

// Заглушка для данных заказа; в будущем данные будут приходить из бэка
const order: OrderDetails = {
    id: '12345',
    status: 'Выполнен',
    deliveryDate: '10.02.2025 14:22:00',
    deliveryMethod: 'Доставка курьером',
    paymentMethod: 'Онлайн',
    address: 'ул. Пушкина, д. 10, Москва',
    productsCost: 5000,
    shippingCost: 0,
    total: 5000,
    products: [
        {
            id: '1',
            name: 'Тренч из натуральной кожи',
            image: '/images/coat1.jpg',
            price: 3000,
            quantity: 1,
            sku: 'SKU-12345',
            size: '42'
        },
        {
            id: '2',
            name: 'Пальто с меховым воротником',
            image: '/images/coat3.jpg',
            price: 2000,
            quantity: 1,
            sku: 'SKU-67890',
            size: '44'
        },
    ],
};

const OrderDetailsPage: React.FC = () => {
    return (
        <>
            <Head>
                <title>Заказ {order.id} | MyCoats</title>
                <meta name="description" content={`Подробности заказа ${order.id}`} />
            </Head>
            <AccountLayout>
                <div className={styles.container}>
                    {/* Номер заказа */}
                    <div className={styles.orderNumber}>
                        {order.id}
                    </div>

                    {/* Блок информации о заказе */}
                    <div className={styles.orderInfo}>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Статус:</span>
                            <span className={styles.value}>{order.status}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Дата доставки:</span>
                            <span className={styles.value}>{order.deliveryDate}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Доставка и оплата:</span>
                            <span className={styles.value}>
                                {order.deliveryMethod} / {order.paymentMethod} <br />
                                {order.address}
                            </span>
                        </div>
                    </div>

                    {/* Блок с суммой заказа */}
                    <div className={styles.orderSummary}>
                        <h2 className={styles.summaryHeader}>Сумма заказа</h2>
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>Стоимость товаров:</span>
                            <span className={styles.summaryValue}>{order.productsCost.toLocaleString()} ₽</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>Доставка:</span>
                            <span className={styles.summaryValue}>
                                {order.shippingCost === 0 ? 'Бесплатно' : `${order.shippingCost.toLocaleString()} ₽`}
                            </span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>Итого:</span>
                            <span className={styles.summaryValue}>{order.total.toLocaleString()} ₽</span>
                        </div>
                    </div>

                    {/* Блок с карточками товаров */}
                    <div className={styles.orderProducts}>
                        {order.products.map((prod) => (
                            <div key={prod.id} className={styles.productCard}>
                                <div className={styles.productImage}>
                                    <Image
                                        src={prod.image}
                                        alt={prod.name}
                                        width={100}
                                        height={120}
                                        objectFit="cover"
                                    />
                                </div>
                                <div className={styles.productDetails}>
                                    <div className={styles.detailsLeft}>
                                        <span className={styles.productName}>{prod.name}</span>
                                        <div className={styles.productInfo}>
                                            <span className={styles.productSku}>Артикул: {prod.sku}</span>
                                            <span className={styles.productSize}>Размер: {prod.size}</span>
                                        </div>
                                    </div>
                                    <div className={styles.detailsRight}>
                                        <span className={styles.productQuantity}>x {prod.quantity}</span>
                                        <span className={styles.productPrice}>
                                            {(prod.price * prod.quantity).toLocaleString()} ₽
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AccountLayout>
        </>
    );
};

export default OrderDetailsPage;
