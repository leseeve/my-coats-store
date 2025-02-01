import React, { useState } from 'react';
import Image from 'next/image';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  title: string;
  price: number;
  images: string[];
  availableSizes: { size: number; available: boolean }[];
}

export const ProductCard: React.FC<ProductCardProps> = ({ title, price, images, availableSizes }) => {
  const [showButton, setShowButton] = useState(false);

  return (
    <div
      className={styles.card}
      onMouseEnter={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(false)}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={images[0]}
          alt={title}
          layout="fill"
          sizes="(max-width: 768px) 100vw, 300px"
          objectFit="cover"
        />
        {showButton && (
          <button className={styles.addToCart}>В корзину</button>
        )}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.price}>{price.toLocaleString()} ₽</p>

      {/* Список доступных размеров */}
      <ul className={styles.sizes}>
        {availableSizes.map((size) => (
          <li key={size.size}>
            Размер: {size.size} - {size.available ? 'В наличии' : 'Нет в наличии'}
          </li>
        ))}
      </ul>
    </div>
  );
};


