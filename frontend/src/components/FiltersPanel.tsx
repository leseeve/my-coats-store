import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { RiCloseLargeFill } from 'react-icons/ri';
import { PiSlidersHorizontal } from 'react-icons/pi';
import styles from '@/styles/FiltersPanel.module.scss';

interface FiltersPanelProps {
    onReset: () => void;
    priceRange: [number, number];
    onPriceRangeChange: (value: [number, number]) => void;
    minPrice: number;
    maxPrice: number;
    selectedColors: string[];
    onColorChange: (color: string) => void;
    onResetColors: () => void;
    selectedSizes: number[];
    onSizeChange: (size: number) => void;
    onResetSizes: () => void;
    loadedProductsCount: number;
    toggleFilters: () => void; // Добавлен проп toggleFilters
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
    onReset,
    priceRange,
    onPriceRangeChange,
    minPrice,
    maxPrice,
    selectedColors,
    onColorChange,
    onResetColors,
    selectedSizes,
    onSizeChange,
    onResetSizes,
    loadedProductsCount,
}) => {
    const [visible, setVisible] = useState(false);
    const [colorListOpen, setColorListOpen] = useState(false);
    const [sizeListOpen, setSizeListOpen] = useState(false);

    const toggleFilters = () => {
        setVisible(!visible);
    };

    useEffect(() => {
        if (!visible) return;
        const handleOutsideClick = (e: MouseEvent) => {
            const target = e.target as Element;
            if (
                target &&
                !target.closest(`.${styles.filtersContainer}`) &&
                !target.closest(`.${styles.filtersButton}`)
            ) {
                setVisible(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [visible]);

    useEffect(() => {
        document.body.style.overflow = visible ? 'hidden' : '';
    }, [visible]);

    return (
        <>
            {/* Кнопка фильтра с обновлёнными стилями */}
            <button onClick={toggleFilters} className={styles.filtersButton}>
                <span className={styles.filtersIcon}>
                    <PiSlidersHorizontal />
                </span>
                <span className={styles.filtersText}>Фильтры</span>
            </button>

            {/* Оверлей и панель фильтров */}
            <div className={`${styles.filtersOverlay} ${visible ? styles.active : ''}`}>
                <div className={`${styles.filtersContainer} ${visible ? styles.active : ''}`}>
                    <div className={styles.filtersHeader}>
                        <h3>Фильтры</h3>
                        <button onClick={toggleFilters} className={styles.closeButton}>
                            <RiCloseLargeFill />
                        </button>
                    </div>

                    <button onClick={onReset} className={styles.resetButton}>
                        Сбросить все
                    </button>

                    <div className={styles.priceFilter}>
                        <label>Цена</label>
                        <div className={styles.rangeWrapper}>
                            <Slider
                                range
                                min={minPrice}
                                max={maxPrice}
                                step={200}
                                allowCross={false}
                                value={priceRange}
                                onChange={(value) => {
                                    if (Array.isArray(value)) {
                                        onPriceRangeChange([value[0], value[1]]);
                                    }
                                }}
                            />
                        </div>
                        <div>
                            от {priceRange[0]} ₽ до {priceRange[1]} ₽
                        </div>
                    </div>

                    <div className={styles.colorFilter}>
                        <div
                            className={styles.filterHeader}
                            onClick={() => setColorListOpen(!colorListOpen)}
                        >
                            <span className={styles.filterToggle}>
                                {colorListOpen ? '-' : '+'}
                            </span>
                            <span className={styles.filterTitle}>Цвет</span>
                            <button
                                className={styles.resetButtonFilter}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onResetColors();
                                }}
                            >
                                Сбросить
                            </button>
                        </div>
                        {colorListOpen && (
                            <div className={styles.filterOptions}>
                                {['бежевый', 'белый', 'бирюзовый'].map((color) => (
                                    <label key={color}>
                                        <input
                                            type="checkbox"
                                            checked={selectedColors.includes(color)}
                                            onChange={() => onColorChange(color)}
                                        />
                                        {color}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.sizeFilter}>
                        <div
                            className={styles.filterHeader}
                            onClick={() => setSizeListOpen(!sizeListOpen)}
                        >
                            <span className={styles.filterToggle}>
                                {sizeListOpen ? '-' : '+'}
                            </span>
                            <span className={styles.filterTitle}>Размер</span>
                            <button
                                className={styles.resetButtonFilter}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onResetSizes();
                                }}
                            >
                                Сбросить
                            </button>
                        </div>
                        {sizeListOpen && (
                            <div className={styles.filterOptions}>
                                {[40, 42, 44, 46, 48].map((size) => (
                                    <label key={size}>
                                        <input
                                            type="checkbox"
                                            checked={selectedSizes.includes(size)}
                                            onChange={() => onSizeChange(size)}
                                        />
                                        {size}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.showProductsButtonContainer}>
                        <button className={styles.showProductsButton}>
                            Показать {loadedProductsCount} товаров
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
