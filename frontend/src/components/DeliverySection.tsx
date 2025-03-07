import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/styles/DeliverySection.module.scss';

interface DaDataSuggestion {
    value: string;
    data: {
        street_with_type?: string; // Улица с типом
        street_fias_id?: string;
        city_fias_id?: string;
        [key: string]: string | undefined;
    };
}

const DeliverySection = () => {
    // Состояния для города
    const [city, setCity] = useState('');
    const [citySuggestions, setCitySuggestions] = useState<DaDataSuggestion[]>([]);
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [cityFiasId, setCityFiasId] = useState('');

    // Состояния для улицы
    const [street, setStreet] = useState('');
    const [streetSuggestions, setStreetSuggestions] = useState<DaDataSuggestion[]>([]);
    const [showStreetDropdown, setShowStreetDropdown] = useState(false);

    // Состояния для дома и квартиры
    const [house, setHouse] = useState('');
    const [apartment, setApartment] = useState('');

    // Способ доставки
    const [deliveryMethod, setDeliveryMethod] = useState('');
    const cityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const streetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Ref для обёртки поля города (для клика вне)
    const cityWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (cityWrapperRef.current && !cityWrapperRef.current.contains(e.target as Node)) {
                setShowCityDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Загрузка городов
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
        // Сброс зависимых полей
        setStreet('');
        setHouse('');
        setApartment('');
        if (cityTimeoutRef.current) clearTimeout(cityTimeoutRef.current);
        cityTimeoutRef.current = setTimeout(() => fetchCities(value), 300);
    };

    const handleCitySelect = (item: DaDataSuggestion) => {
        // Выполняем замену, чтобы "г " стало "г. "
        const replacedValue = item.value.replace(/(?:^|\s)(г)\s/gi, (match, g) => {
            const prefix = match.startsWith(' ') ? ' ' : '';
            return prefix + 'г. ';
        });
        setCity(replacedValue);
        setCityFiasId(item.data.fias_id || '');
        setShowCityDropdown(false);
        setCitySuggestions([]);
    };

    const clearCity = () => {
        setCity('');
        setCityFiasId('');
        setCitySuggestions([]);
        setShowCityDropdown(false);
        setStreet('');
        setHouse('');
        setApartment('');
    };

    // Загрузка улиц только для выбранного города
    const fetchStreets = async (query: string) => {
        if (!cityFiasId || query.length < 2) return;
        try {
            const response = await fetch('/api/utils/dadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query,
                    count: 10,
                    locations: [{ fias_id: cityFiasId }],
                    from_bound: { value: 'street' },
                    to_bound: { value: 'street' },
                }),
            });
            const data = await response.json();
            // Фильтруем только улицы и формируем отображаемое значение
            const filtered = data.suggestions
                .filter((sug: DaDataSuggestion) => sug.data.street_with_type)
                .map((sug: DaDataSuggestion) => ({
                    ...sug,
                    value: sug.data.street_with_type || '',
                }));
            setStreetSuggestions(filtered);
            setShowStreetDropdown(filtered.length > 0);
        } catch (error) {
            console.error('Ошибка загрузки улиц:', error);
            setStreetSuggestions([]);
        }
    };

    const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setStreet(value);
        setHouse('');
        setApartment('');
        if (streetTimeoutRef.current) clearTimeout(streetTimeoutRef.current);
        streetTimeoutRef.current = setTimeout(() => fetchStreets(value), 300);
    };

    const handleStreetSelect = (item: DaDataSuggestion) => {
        if (!item.data.street_with_type) return;
        setStreet(item.data.street_with_type);
        setShowStreetDropdown(false);
        setStreetSuggestions([]);
    };

    const handleHouseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHouse(e.target.value);
    };

    const clearStreet = () => {
        setStreet('');
        setStreetSuggestions([]);
        setShowStreetDropdown(false);
        setHouse('');
        setApartment('');
    };

    const clearHouse = () => {
        setHouse('');
        setApartment('');
    };

    return (
        <section className={styles.deliverySection}>
            <h3>Способ доставки</h3>
            {/* Поле ввода города */}
            <div className={styles.formRow}>
                <label>Город*</label>
                <div className={styles.inputWrapper} ref={cityWrapperRef}>
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
                            {citySuggestions.map((sug, i) => {
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

            {/* Блоки способов доставки отображаются только при выборе города */}
            {cityFiasId && (
                <>
                    {/* Курьерская доставка */}
                    <div
                        className={
                            deliveryMethod === 'courier'
                                ? `${styles.deliveryBlock} ${styles.deliveryBlockActive}`
                                : styles.deliveryBlock
                        }
                        onClick={() => setDeliveryMethod('courier')}
                    >
                        <div className={styles.deliveryHeader}>
                            <input
                                type="radio"
                                name="delivery"
                                value="courier"
                                checked={deliveryMethod === 'courier'}
                                onChange={() => setDeliveryMethod('courier')}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <div className={styles.deliveryInfo}>
                                <div className={styles.deliveryTitle}>Курьерская доставка</div>
                                <div className={styles.deliverySubtitle}>
                                    Бесплатно от 3000 рублей, от 1 дня
                                </div>
                            </div>
                        </div>
                        {deliveryMethod === 'courier' && (
                            <div
                                className={styles.deliveryFields}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Улица */}
                                <div className={styles.formRow}>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            type="text"
                                            placeholder="Улица"
                                            value={street}
                                            disabled={!cityFiasId}
                                            onChange={handleStreetChange}
                                            onFocus={() => {
                                                if (streetSuggestions.length > 0)
                                                    setShowStreetDropdown(true);
                                            }}
                                        />
                                        {street && (
                                            <button
                                                className={styles.clearBtn}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    clearStreet();
                                                }}
                                            >
                                                ✖
                                            </button>
                                        )}
                                        {showStreetDropdown && streetSuggestions.length > 0 && (
                                            <ul className={styles.dropdown}>
                                                {streetSuggestions.map((item, idx) => (
                                                    <li
                                                        key={idx}
                                                        className={styles.dropdownOption}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStreetSelect(item);
                                                        }}
                                                    >
                                                        {item.value}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                {/* Дом + Квартира */}
                                <div className={styles.twoFieldsRow} onClick={(e) => e.stopPropagation()}>
                                    <div className={styles.formRow}>
                                        <div className={styles.inputWrapper}>
                                            <input
                                                type="text"
                                                placeholder="Дом"
                                                value={house}
                                                disabled={!street}
                                                onChange={handleHouseChange}
                                            />
                                            {house && (
                                                <button
                                                    className={styles.clearBtn}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        clearHouse();
                                                    }}
                                                >
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
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setApartment('');
                                                    }}
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

                    {/* Пункт самовывоза */}
                    <div
                        className={
                            deliveryMethod === 'pickup'
                                ? `${styles.deliveryBlock} ${styles.deliveryBlockActive}`
                                : styles.deliveryBlock
                        }
                        onClick={() => setDeliveryMethod('pickup')}
                    >
                        <div className={styles.deliveryHeader}>
                            <input
                                type="radio"
                                name="delivery"
                                value="pickup"
                                checked={deliveryMethod === 'pickup'}
                                onChange={() => setDeliveryMethod('pickup')}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <div className={styles.deliveryInfo}>
                                <div className={styles.deliveryTitle}>Пункт самовывоза</div>
                                <div className={styles.deliverySubtitle}>
                                    Бесплатно от 3000 рублей, от 1 дня
                                </div>
                            </div>
                        </div>
                        {deliveryMethod === 'pickup' && (
                            <div className={styles.deliveryFields} onClick={(e) => e.stopPropagation()}>
                                <Link href="/pickup-points" className={styles.pickupLink}>
                                    Выбрать пункт выдачи
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </section>
    );
};

export default DeliverySection;
