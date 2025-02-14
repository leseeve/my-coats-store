import React, { useState } from 'react';
import { useCart } from '@/context/CartContext'; // Используем контекст корзины
import styles from '@/styles/SummarySection.module.scss';

const SummarySection = () => {
    const { items, total } = useCart();

    if (!items || total === undefined) {
        return <p>Корзина пуста.</p>;
    }

    const [promoCode, setPromoCode] = useState('');
    const shippingCost = total >= 10000 ? 0 : 300;
    const finalPrice = total + shippingCost;

    const handleCheckout = () => {
        console.log(`Заказ оформлен. Итог: ${finalPrice.toLocaleString()} ₽`);
    };

    return (
        <section className={styles.summarySection}>
            <h2>Сумма заказа</h2>

            {/* Поле ввода промокода */}
            <div className={styles.promoCodeContainer}>
                <input
                    type="text"
                    placeholder="Введите промокод"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className={styles.promoInput}
                />
                <button className={styles.applyPromo}>→</button>
            </div>

            {/* Стоимость товаров */}
            <div className={styles.orderDetails}>
                <p>
                    Товары:
                    <span>{total.toLocaleString()} ₽</span>
                </p>
                <p>
                    Доставка:
                    <span>{shippingCost === 0 ? 'Бесплатно' : `${shippingCost} ₽`}</span>
                </p>
            </div>

            {/* Итоговая сумма */}
            <h3>ИТОГО: {finalPrice.toLocaleString()} ₽</h3>

            {/* Кнопка оплаты */}
            <button className={styles.checkoutButton} onClick={handleCheckout}>
                Оплатить
            </button>

        </section>
    );
};

export default SummarySection;

