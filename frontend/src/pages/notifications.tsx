// src/pages/notifications.tsx
import React, { useState } from 'react';
import Head from 'next/head';
import AccountLayout from '@/components/AccountLayout';
import styles from '@/styles/Notifications.module.scss';

const Notifications: React.FC = () => {
    const [pushEnabled, setPushEnabled] = useState<boolean>(false);
    const [emailEnabled, setEmailEnabled] = useState<boolean>(false);
    const [smsEnabled, setSmsEnabled] = useState<boolean>(false);

    return (
        <AccountLayout>
            <Head>
                <title>Настройка уведомлений | MyCoats</title>
                <meta name="description" content="Настройка уведомлений: push, email, sms." />
            </Head>
            <div className={styles.container}>
                <h1>Настройка уведомлений</h1>
                <div className={styles.toggleGroup}>
                    <label className={styles.toggleLabel}>
                        <input
                            type="checkbox"
                            checked={pushEnabled}
                            onChange={() => setPushEnabled(!pushEnabled)}
                        />
                        Push-уведомления
                    </label>
                    <label className={styles.toggleLabel}>
                        <input
                            type="checkbox"
                            checked={emailEnabled}
                            onChange={() => setEmailEnabled(!emailEnabled)}
                        />
                        Email-уведомления
                    </label>
                    <label className={styles.toggleLabel}>
                        <input
                            type="checkbox"
                            checked={smsEnabled}
                            onChange={() => setSmsEnabled(!smsEnabled)}
                        />
                        SMS-уведомления
                    </label>
                </div>
            </div>
        </AccountLayout>
    );
};

export default Notifications;

