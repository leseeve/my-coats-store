import React, { useState } from 'react';
import Link from 'next/link';
import { PatternFormat } from 'react-number-format'; // Для маски ввода
import styles from '@/styles/ContactSection.module.scss';

const ContactSection = () => {
    const [phoneDigits, setPhoneDigits] = useState(''); // Храним только цифры (до 10)
    const [isAuthorized, setIsAuthorized] = useState(false);
    // Данные пользователя после авторизации
    const [userData, setUserData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '', // Здесь будем копировать phoneDigits при авторизации
    });

    const handlePhoneChange = (value: string) => {
        // Оставляем только цифры, максимум 10 (коды РФ без 8?)
        setPhoneDigits(value.replace(/\D/g, '').slice(0, 10));
    };

    const handleAuthorize = () => {
        // Здесь потом будет реальная авторизация/регистрация
        setIsAuthorized(true);
        // Копируем в userData.phone отформатированный номер
        setUserData((prev) => ({
            ...prev,
            phone: phoneDigits,
        }));
    };

    const handleChangeUserData = (
        field: 'name' | 'surname' | 'email' | 'phone',
        value: string
    ) => {
        setUserData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <section className={styles.contactSection}>
            <h3>Контактные данные</h3>
            {/* Если НЕ авторизованы — показываем поле телефона и кнопку */}
            {!isAuthorized && (
                <div className={styles.phoneRow}>
                    <PatternFormat
                        format="+7 (###) ###-##-##" // Маска для номера телефона
                        mask="_" // Заполнитель для пустых символов
                        value={phoneDigits}
                        onValueChange={({ value }) => handlePhoneChange(value)}
                        placeholder="+7 (___) ___-__-__"
                        className={styles.phoneInput} // Стиль для поля ввода
                    />
                    <button onClick={handleAuthorize}>Далее</button>
                </div>
            )}
            {/* Если авторизованы — показываем 4 поля в сетке 2x2: Имя, Фамилия, Email, Телефон */}
            {isAuthorized && (
                <div className={styles.userGrid}>
                    <div className={styles.formItem}>
                        <input
                            type="text"
                            placeholder="Имя*"
                            value={userData.name}
                            onChange={(e) => handleChangeUserData('name', e.target.value)}
                        />
                    </div>
                    <div className={styles.formItem}>
                        <input
                            type="text"
                            placeholder="Фамилия*"
                            value={userData.surname}
                            onChange={(e) => handleChangeUserData('surname', e.target.value)}
                        />
                    </div>
                    <div className={styles.formItem}>
                        <input
                            type="email"
                            placeholder="Email*"
                            value={userData.email}
                            onChange={(e) => handleChangeUserData('email', e.target.value)}
                        />
                    </div>
                    <div className={styles.formItem}>
                        {/* Телефон, уже введённый ранее */}
                        <PatternFormat
                            format="+7 (###) ###-##-##" // Маска для номера телефона
                            mask="_" // Заполнитель для пустых символов
                            value={userData.phone}
                            onValueChange={({ value }) =>
                                handleChangeUserData(
                                    'phone',
                                    value.replace(/\D/g, '').slice(0, 10)
                                )
                            }
                            placeholder="+7 (___) ___-__-__"
                            className={styles.phoneInput} // Стиль для поля ввода
                        />
                    </div>
                </div>
            )}
            {/* Условно убираем блок с политикой, если авторизованы */}
            {!isAuthorized && (
                <p className={styles.disclaimer}>
                    Нажимая на кнопку &quot;Далее&quot;, вы соглашаетесь с{' '}
                    <Link href="/privacy">политикой конфиденциальности</Link> и{' '}
                    <Link href="/terms">правилами работы магазина</Link>.
                </p>
            )}
        </section>
    );
};

export default ContactSection;