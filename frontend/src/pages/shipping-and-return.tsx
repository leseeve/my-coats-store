// src/pages/shipping-and-return.tsx
import React from 'react';
import Head from 'next/head';
import AccountLayout from '@/components/AccountLayout';
import styles from '@/styles/ShippingAndReturn.module.scss';

const ShippingAndReturn: React.FC = () => {
    return (
        <AccountLayout>
            <Head>
                <title>Доставка и возврат | MyCoats</title>
                <meta name="description" content="Информация о заказе, оплате, доставке и возврате товаров." />
            </Head>
            <div className={styles.container}>
                <h1>Доставка и возврат</h1>
                <section className={styles.section}>
                    <h2>Как сделать заказ</h2>
                    <p>
                        Выберите товар, добавьте его в корзину и заполните форму оформления заказа. После подтверждения заказа, мы свяжемся с вами для уточнения деталей.
                    </p>
                </section>
                <section className={styles.section}>
                    <h2>Оплата заказа</h2>
                    <p>
                        Оплата может производиться онлайн картой, через электронные платежи или наличными при получении заказа.
                    </p>
                </section>
                <section className={styles.section}>
                    <h2>Доставка заказа</h2>
                    <p>
                        Доставка осуществляется в течение 3–5 рабочих дней по всей России. Бесплатная доставка при заказе от 3000 ₽.
                    </p>
                </section>
                <section className={styles.section}>
                    <h2>Условия доставки</h2>
                    <p>
                        При оформлении заказа убедитесь, что адрес доставки указан правильно. В случае необходимости изменения, пожалуйста, свяжитесь с нашей службой поддержки.
                    </p>
                </section>
                <section className={styles.section}>
                    <h2>Получение заказа</h2>
                    <p>
                        Вы можете получить заказ через курьерскую доставку или забрать его в пункте самовывоза. Проверьте целостность товара при получении.
                    </p>
                </section>
                <section className={styles.section}>
                    <h2>Отмена и возврат</h2>
                    <p>
                        Возврат товаров возможен в течение 14 дней с момента получения, если товар не подошёл или имеет дефекты. Ознакомьтесь с подробными условиями на странице возврата.
                    </p>
                </section>
            </div>
        </AccountLayout>
    );
};

export default ShippingAndReturn;
