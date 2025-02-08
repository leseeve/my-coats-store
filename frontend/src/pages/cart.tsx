import React from 'react';
import { PageLayout } from '@/layouts/PageLayout';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import styles from '@/styles/Cart.module.scss';
import DeliverySection from '@/components/DeliverySection';
import ContactSection from '@/components/ContactSection';
import PaymentSection from '@/components/PaymentSection';
import SummarySection from '@/components/SummarySection';

const Cart = () => {
    const { items, removeItem, addItem } = useCart();

    return (
        <PageLayout>
            <div className={styles.cartContainer}>
                {items.length > 0 ? (
                    <div className={styles.mainContent}>
                        <div className={styles.leftSection}>
                            <section className={styles.itemsSection}>
                                <h1>Корзина</h1>
                                <ul>
                                    {items.map((item) => (
                                        <li key={item.id} className={styles.itemRow}>
                                            <div className={styles.imageWrapper}>
                                                {/* Замена <img> на <Image> */}
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={300} // Укажите ширину изображения
                                                    height={400} // Укажите высоту изображения
                                                    className={styles.itemImage}
                                                />
                                            </div>
                                            <div className={styles.details}>
                                                <p className={styles.itemName}>{item.name}</p>
                                                <p className={styles.itemMeta}>Арт: {item.sku}</p>
                                                <p className={styles.itemMeta}>Размер: {item.size}</p>
                                                <div className={styles.quantityControls}>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        disabled={item.quantity === 1}
                                                    >
                                                        –
                                                    </button>
                                                    <input type="text" value={item.quantity} readOnly />
                                                    <button onClick={() => addItem(item)}>
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <p className={styles.itemPrice}>{item.price.toLocaleString()} ₽</p>
                                            <button
                                                className={styles.removeButton}
                                                onClick={() => removeItem(item.id)}
                                            >
                                                ✖
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                            <DeliverySection />
                            <ContactSection />
                            <PaymentSection />
                        </div>
                        <div className={styles.rightSection}>
                            <SummarySection />
                        </div>
                    </div>
                ) : (
                    <p>Корзина пуста</p>
                )}
            </div>
        </PageLayout>
    );
};

export default Cart;