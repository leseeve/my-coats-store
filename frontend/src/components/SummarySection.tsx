import React from 'react';
import { useCart } from '@/context/CartContext'; // <-- Важно
import styles from '@/styles/SummarySection.module.scss';

const SummarySection = () => {
    const { items, total } = useCart();

    // Проверка на undefined
    if (!items || total === undefined) {
        return <p>Корзина пуста.</p>;
    }

    // Пример логики доставки:
    const shippingCost = total >= 10000 ? 0 : 300;
    const finalPrice = total + shippingCost;

    const handleCheckout = () => {
        // Здесь будет реальная логика оформления заказа.
        console.log(`Заказ оформлен. Итог: ${finalPrice.toLocaleString()} ₽`);
        // Можно сделать fetch('/api/orders') или открыть модальное окно.
    };

    return (
        <section className={styles.summarySection}>
            <h2>Ваш заказ</h2>
            {/* Покажем суммарную стоимость товаров */}
            <p>Товары: {total.toLocaleString()} ₽</p>
            {/* Стоимость доставки */}
            <p>Доставка: {shippingCost === 0 ? 'Бесплатно' : `${shippingCost} ₽`}</p>
            <h3>ИТОГО: {finalPrice.toLocaleString()} ₽</h3>
            <button
                className={styles.checkoutButton}
                onClick={handleCheckout}
            >
                Оплатить
            </button>
        </section>
    );
};

export default SummarySection;
