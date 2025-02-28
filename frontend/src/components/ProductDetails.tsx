import React, { useState } from 'react';
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

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const selectSize = (size: string) => {
        setSelectedSize(size);
        setIsSizeDropdownOpen(false);
    };

    return (
        <div className={styles.productDetails}>
            <h1 className={styles.productName}>{product.name}</h1>
            <p className={styles.productPrice}>{product.price} ₽</p>
            <div className={styles.sizeSelector}>
                <button
                    className={styles.sizeButton}
                    onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
                >
                    {selectedSize ? `Размер: ${selectedSize}` : 'Выберите размер'}
                </button>
                {isSizeDropdownOpen && (
                    <ul className={styles.sizeList}>
                        {product.sizes.map((size) => (
                            <li key={size} onClick={() => selectSize(size)}>
                                {size}
                            </li>
                        ))}
                    </ul>
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