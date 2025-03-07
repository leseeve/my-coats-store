import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import AccountLayout from '@/components/AccountLayout';
import styles from '@/styles/Profile.module.scss';

interface DaDataSuggestion {
    value: string;
    data: {
        fias_id?: string;
        city_with_type?: string;
        settlement_with_type?: string;
        [key: string]: string | undefined;
    };
}

const Profile: React.FC = () => {
    // Состояния для города
    const [city, setCity] = useState('');
    const [citySuggestions, setCitySuggestions] = useState<DaDataSuggestion[]>([]);
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [cityFiasId, setCityFiasId] = useState('');

    const cityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const cityWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (cityWrapperRef.current && !cityWrapperRef.current.contains(event.target as Node)) {
                setShowCityDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchCities = async (query: string) => {
        if (query.length < 2) {
            setCitySuggestions([]);
            setShowCityDropdown(false);
            return;
        }
        try {
            const response = await fetch('/api/utils/dadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query,
                    count: 10,
                    from_bound: { value: 'city' },
                    to_bound: { value: 'city' },
                }),
            });
            if (!response.ok) throw new Error('Ошибка загрузки городов');
            const data = await response.json();
            // Фильтруем только города и поселки (без улиц)
            const filtered = data.suggestions.filter((sug: DaDataSuggestion) =>
                (sug.data.city_with_type || sug.data.settlement_with_type) && !sug.data.street
            );
            setCitySuggestions(filtered);
            setShowCityDropdown(filtered.length > 0);
        } catch (error) {
            console.error('Ошибка получения городов:', error);
            setCitySuggestions([]);
        }
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCity(value);
        setCityFiasId('');
        if (cityTimeoutRef.current) clearTimeout(cityTimeoutRef.current);
        cityTimeoutRef.current = setTimeout(() => fetchCities(value), 300);
    };

    const handleCitySelect = (item: DaDataSuggestion) => {
        // Заменяем "г " или "Г " на "г. " для корректного отображения
        const displayedValue = item.value.replace(/(?:^|\s)(г)\s/gi, (match, g) => {
            const prefix = match.startsWith(' ') ? ' ' : '';
            return prefix + 'г. ';
        });
        setCity(displayedValue);
        setCityFiasId(item.data.fias_id || '');
        setShowCityDropdown(false);
        setCitySuggestions([]);
    };

    const clearCity = () => {
        setCity('');
        setCityFiasId('');
        setCitySuggestions([]);
        setShowCityDropdown(false);
    };

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
                            <div className={styles.inputWrapper} ref={cityWrapperRef}>
                                <input
                                    type="text"
                                    placeholder="Город"
                                    required
                                    className={styles.cityInput}
                                    value={city}
                                    onChange={handleCityChange}
                                    onFocus={() => {
                                        if (citySuggestions.length > 0) setShowCityDropdown(true);
                                    }}
                                />
                                {city && (
                                    <button
                                        type="button"
                                        className={styles.clearBtn}
                                        onClick={clearCity}
                                    >
                                        ✖
                                    </button>
                                )}
                                {showCityDropdown && citySuggestions.length > 0 && (
                                    <ul className={styles.dropdown}>
                                        {citySuggestions.map((sug, i) => {
                                            // Для отображения в списке делаем замену, как и в handleCitySelect
                                            const displayedValue = sug.value.replace(/(?:^|\s)(г)\s/gi, (match, g) => {
                                                const prefix = match.startsWith(' ') ? ' ' : '';
                                                return prefix + 'г. ';
                                            });
                                            return (
                                                <li
                                                    key={i}
                                                    className={styles.dropdownOption}
                                                    onClick={() => handleCitySelect(sug)}
                                                >
                                                    {displayedValue}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
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


