import React from 'react';
import Head from 'next/head';
import AccountLayout from '@/components/AccountLayout';
import styles from '@/styles/Profile.module.scss';

const Profile: React.FC = () => {
    return (
        <>
            <Head>
                <title>Мой кабинет | Unholy Place</title>
            </Head>
            <AccountLayout>
                <div className={styles.profile}>
                    <h1>Мой профиль</h1>
                    <form className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>Личная информация</label>
                            <input type="text" placeholder="Фамилия" required />
                            <input type="text" placeholder="Имя" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Город</label>
                            <input type="text" placeholder="Город" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Контакты</label>
                            <input type="tel" placeholder="Телефон" required />
                            <input type="email" placeholder="Почта" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.consent}>
                                <input type="checkbox" required />
                                Я даю согласие на получение рекламных рассылок в виде e-mail, sms, push или в мессенджерах
                            </label>
                        </div>
                        <button type="submit">Сохранить</button>
                    </form>
                </div>
            </AccountLayout>
        </>
    );
};

export default Profile;