import React, { useState } from 'react';
import styles from '@/styles/PaymentSection.module.scss';

const PaymentSection = () => {
    const [paymentMethod, setPaymentMethod] = useState('');

    return (
        <section className={styles.paymentSection}>
            <h3>Способ оплаты</h3>
            <label>
                <input
                    type="radio"
                    name="payment"
                    value="sbp"
                    checked={paymentMethod === 'sbp'}
                    onChange={() => setPaymentMethod('sbp')}
                />
                Оплата через СБП
            </label>
            <label>
                <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                />
                Оплата онлайн
            </label>
            <label>
                <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                />
                Оплата при получении
            </label>
        </section>
    );
};

export default PaymentSection;