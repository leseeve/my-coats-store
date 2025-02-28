// src/pages/contacts.tsx
import React from 'react';
import Head from 'next/head';
import AccountLayout from '@/components/AccountLayout';
import styles from '@/styles/Contacts.module.scss';

const Contacts: React.FC = () => {
    return (
        <>
            <Head>
                <title>Контакты | MyCoats</title>
                <meta name="description" content="Свяжитесь с нами через Telegram, WhatsApp, Instagram, email или по адресу." />
            </Head>
            <AccountLayout>
                <div className={styles.container}>
                    <h1>Контакты</h1>
                    <p>Мы всегда рады помочь! Свяжитесь с нами удобным для вас способом.</p>
                    <div className={styles.contactDetails}>
                        <div className={styles.contactItem}>
                            <h2>Телеграм</h2>
                            <a href="https://t.me/YourTelegram" target="_blank" rel="noopener noreferrer">
                                t.me/YourTelegram
                            </a>
                        </div>
                        <div className={styles.contactItem}>
                            <h2>WhatsApp</h2>
                            <a href="https://wa.me/71234567890" target="_blank" rel="noopener noreferrer">
                                +7 (123) 456-78-90
                            </a>
                        </div>
                        <div className={styles.contactItem}>
                            <h2>Instagram</h2>
                            <a href="https://instagram.com/YourInstagram" target="_blank" rel="noopener noreferrer">
                                @YourInstagram
                            </a>
                        </div>
                        <div className={styles.contactItem}>
                            <h2>Email</h2>
                            <a href="mailto:info@mycoatsstore.ru">info@mycoatsstore.ru</a>
                        </div>
                    </div>
                    <div className={styles.additionalInfo}>
                        <h2>Адрес</h2>
                        <p>ул. Ленина, д. 1, Москва, Россия</p>
                        <h2>Режим работы</h2>
                        <p>
                            Мы работаем с понедельника по пятницу с 9:00 до 18:00. В выходные дни поддержка доступна через онлайн-чат.
                        </p>
                        <h2>FAQ</h2>
                        <p>
                            Если у вас возникли вопросы, пожалуйста, ознакомьтесь с разделом FAQ или свяжитесь с нами напрямую.
                        </p>
                    </div>
                </div>
            </AccountLayout>
        </>
    );
};

export default Contacts;
