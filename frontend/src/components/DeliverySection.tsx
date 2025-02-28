import React, { useState, useRef } from 'react';
import Link from 'next/link';
import styles from '@/styles/DeliverySection.module.scss';

// Интерфейс для данных DaData
interface DaDataSuggestion {
    value: string;
    data: {
        fias_id?: string;
        street_fias_id?: string;
        city_with_type?: string;
        settlement_with_type?: string;
        [key: string]: string | undefined; // Более конкретный тип вместо any
    };
}

const DeliverySection = () => {
    // Город
    const [city, setCity] = useState('');
    const [citySuggestions, setCitySuggestions] = useState<DaDataSuggestion[]>([]);
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [cityFiasId, setCityFiasId] = useState('');
    // Способ доставки
    const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'pickup' | ''>('');
    // Поля для курьера
    const [street, setStreet] = useState('');
    const [streetSuggestions, setStreetSuggestions] = useState<DaDataSuggestion[]>([]);
    const [showStreetDropdown, setShowStreetDropdown] = useState(false);
    const [house, setHouse] = useState('');
    const [houseSuggestions, setHouseSuggestions] = useState<DaDataSuggestion[]>([]);
    const [showHouseDropdown, setShowHouseDropdown] = useState(false);
    const [apartment, setApartment] = useState('');
    // Debounce refs
    const cityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const streetTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const houseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Методы загрузки DaData (упрощённо)
    const fetchCities = async (query: string) => {
        if (query.length < 2) {
            setCitySuggestions([]);
            setShowCityDropdown(false);
            return;
        }
        try {
            const resp = await fetch('/api/utils/dadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, count: 10 }),
            });
            if (!resp.ok) throw new Error(`City error: ${resp.status}`);
            const data = await resp.json();

            // Логирование полученных данных для дебага
            console.log('City data:', data);

            // Фильтруем только города и поселки, исключая улицы
            const arr = data.suggestions.filter((sug: DaDataSuggestion) => {
                // Фильтруем только города и поселки
                return sug.data.city_with_type || sug.data.settlement_with_type;
            }) || [];
            setCitySuggestions(arr);
            setShowCityDropdown(arr.length > 0);
        } catch (err) {
            console.error('City fetch error:', err);
            setCitySuggestions([]);
            setShowCityDropdown(false);
        }
    };

    const fetchStreets = async (query: string, fiasId: string) => {
        if (query.length < 2 || !fiasId) {
            setStreetSuggestions([]);
            setShowStreetDropdown(false);
            return;
        }
        try {
            const resp = await fetch('/api/utils/dadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, count: 10, fias_id: fiasId }),
            });
            if (!resp.ok) throw new Error(`Street error: ${resp.status}`);
            const data = await resp.json();

            // Логирование полученных данных для дебага
            console.log('Street data:', data);

            const arr = data.suggestions || [];
            setStreetSuggestions(arr);
            setShowStreetDropdown(arr.length > 0);
        } catch (err) {
            console.error('Street fetch error:', err);
            setStreetSuggestions([]);
            setShowStreetDropdown(false);
        }
    };

    // Handlers
    const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCity(val);
        setCityFiasId('');
        setStreet('');
        setHouse('');
        setApartment('');
        if (cityTimeoutRef.current) clearTimeout(cityTimeoutRef.current);
        cityTimeoutRef.current = setTimeout(() => {
            fetchCities(val);
        }, 300);
    };

    const handleCitySelect = (item: DaDataSuggestion) => {
        setCity(item.value);
        setCitySuggestions([]);
        setShowCityDropdown(false);
        if (item.data.fias_id) setCityFiasId(item.data.fias_id);
        setStreet('');
        setHouse('');
        setApartment('');
    };

    const clearCity = () => {
        setCity('');
        setCitySuggestions([]);
        setShowCityDropdown(false);
        setCityFiasId('');
        setStreet('');
        setHouse('');
        setApartment('');
    };

    const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setStreet(val);
        setHouse('');
        setApartment('');
        if (streetTimeoutRef.current) clearTimeout(streetTimeoutRef.current);
        streetTimeoutRef.current = setTimeout(() => {
            fetchStreets(val, cityFiasId);
        }, 300);
    };

    const handleStreetSelect = (item: DaDataSuggestion) => {
        setStreet(item.value);
        setStreetSuggestions([]);
        setShowStreetDropdown(false);
        setHouse('');
        setApartment('');
    };

    const clearStreet = () => {
        setStreet('');
        setStreetSuggestions([]);
        setShowStreetDropdown(false);
        setHouse('');
        setHouseSuggestions([]);
        setShowHouseDropdown(false);
        setApartment('');
    };

    const handleHouseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setHouse(val);
        setApartment('');
        if (houseTimeoutRef.current) clearTimeout(houseTimeoutRef.current);
        houseTimeoutRef.current = setTimeout(() => {
            // fetchHouses(val, streetFiasId) — опционально
        }, 300);
    };

    const clearHouse = () => {
        setHouse('');
        setHouseSuggestions([]);
        setShowHouseDropdown(false);
        setApartment('');
    };

    return (
        <section className={styles.deliverySection}>
            <h3>Способ доставки</h3>
            {/* Город (отдельно) */}
            <div className={styles.formRow}>
                <label>Город*</label>
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        placeholder="Город"
                        value={city}
                        onChange={handleCityChange}
                        onFocus={() => {
                            if (citySuggestions.length > 0) setShowCityDropdown(true);
                        }}
                    />
                    {city && (
                        <button className={styles.clearBtn} onClick={clearCity}>
                            ✖
                        </button>
                    )}
                    {showCityDropdown && citySuggestions.length > 0 && (
                        <ul className={styles.dropdown}>
                            {citySuggestions.map((sug, i) => (
                                <li
                                    key={i}
                                    className={styles.dropdownOption}
                                    onClick={() => handleCitySelect(sug)}
                                >
                                    {sug.value}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* КУРЬЕРСКАЯ ДОСТАВКА */}
            <div
                className={
                    deliveryMethod === 'courier'
                        ? `${styles.deliveryBlock} ${styles.deliveryBlockActive}`
                        : styles.deliveryBlock
                }
            >
                {/* Шапка (радио + слова) */}
                <div className={styles.deliveryHeader}>
                    <input
                        type="radio"
                        name="delivery"
                        value="courier"
                        checked={deliveryMethod === 'courier'}
                        onChange={() => setDeliveryMethod('courier')}
                    />
                    <div className={styles.deliveryInfo}>
                        <div className={styles.deliveryTitle}>Курьерская доставка</div>
                        <div className={styles.deliverySubtitle}>
                            Бесплатно от 3000 рублей, от 1 дня
                        </div>
                    </div>
                </div>
                {/* Поля ниже, в отдельном контейнере */}
                {deliveryMethod === 'courier' && (
                    <div className={styles.deliveryFields}>
                        {/* Улица (одна широкая строка) */}
                        <div className={styles.formRow}>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    placeholder="Улица"
                                    value={street}
                                    disabled={!cityFiasId}
                                    onChange={handleStreetChange}
                                    onFocus={() => {
                                        if (streetSuggestions.length > 0) setShowStreetDropdown(true);
                                    }}
                                />
                                {street && (
                                    <button className={styles.clearBtn} onClick={clearStreet}>
                                        ✖
                                    </button>
                                )}
                                {showStreetDropdown && streetSuggestions.length > 0 && (
                                    <ul className={styles.dropdown}>
                                        {streetSuggestions.map((item, idx) => (
                                            <li
                                                key={idx}
                                                className={styles.dropdownOption}
                                                onClick={() => handleStreetSelect(item)}
                                            >
                                                {item.value}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        {/* Дом + Квартира (в одну строку) */}
                        <div className={styles.twoFieldsRow}>
                            <div className={styles.formRow}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        placeholder="Дома"
                                        value={house}
                                        disabled={!street}
                                        onChange={handleHouseChange}
                                    />
                                    {house && (
                                        <button className={styles.clearBtn} onClick={clearHouse}>
                                            ✖
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        placeholder="Квартира/офис"
                                        value={apartment}
                                        disabled={!house}
                                        onChange={(e) => setApartment(e.target.value)}
                                    />
                                    {apartment && (
                                        <button
                                            className={styles.clearBtn}
                                            onClick={() => setApartment('')}
                                        >
                                            ✖
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ПУНКТ САМОВЫВОЗА */}
            <div
                className={
                    deliveryMethod === 'pickup'
                        ? `${styles.deliveryBlock} ${styles.deliveryBlockActive}`
                        : styles.deliveryBlock
                }
            >
                {/* Шапка (радио + слова) */}
                <div className={styles.deliveryHeader}>
                    <input
                        type="radio"
                        name="delivery"
                        value="pickup"
                        checked={deliveryMethod === 'pickup'}
                        onChange={() => setDeliveryMethod('pickup')}
                    />
                    <div className={styles.deliveryInfo}>
                        <div className={styles.deliveryTitle}>Пункт самовывоза</div>
                        <div className={styles.deliverySubtitle}>
                            Бесплатно от 3000 рублей, от 1 дня
                        </div>
                    </div>
                </div>
                {/* Ссылка ниже */}
                {deliveryMethod === 'pickup' && (
                    <div className={styles.deliveryFields}>
                        <Link href="/pickup-points" className={styles.pickupLink}>
                            Выбрать пункт выдачи
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default DeliverySection;

