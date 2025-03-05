import React, { useState, useEffect, useRef } from 'react';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import styles from '@/styles/ProductDetails.module.scss';

interface ProductDetailsProps {
    product: {
        name: string;
        price: number;
        sizes: string[];
    };
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);

    const dropdownRef = useRef<HTMLUListElement>(null);

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const selectSize = (size: string) => {
        setSelectedSize(size);
        setIsSizeDropdownOpen(false);
    };

    // Закрытие списка по клику вне блока
    const handleOutsideClick = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setIsSizeDropdownOpen(false);
        }
    };

    useEffect(() => {
        if (isSizeDropdownOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isSizeDropdownOpen]);

    return (
        <div className={styles.productDetails}>
            <h1 className={styles.productName}>{product.name}</h1>
            <p className={styles.productPrice}>{product.price} ₽</p>

            {/* Контейнер для кнопки + списка */}
            <div
                className={`${styles.sizeSelector} ${isSizeDropdownOpen ? styles.active : ''
                    }`}
            >
                <button
                    className={styles.sizeButton}
                    onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
                >
                    {selectedSize ? `Размер: ${selectedSize}` : 'Выберите размер'}
                </button>

                {isSizeDropdownOpen && (
                    <>
                        {/* Оверлей */}
                        <div
                            className={styles.overlay}
                            onClick={() => setIsSizeDropdownOpen(false)}
                        />
                        <ul ref={dropdownRef} className={styles.sizeList}>
                            {product.sizes.map((size) => (
                                <li key={size} onClick={() => selectSize(size)}>
                                    {size}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>

            <div className={styles.buttonsContainer}>
                <button className={styles.addToCartButton}>Добавить в корзину</button>
                <div className={styles.favoriteButtonContainer}>
                    <button className={styles.favoriteButton} onClick={toggleFavorite}>
                        {isFavorite ? <GoHeartFill /> : <GoHeart />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
