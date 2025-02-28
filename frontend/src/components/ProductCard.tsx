import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from '@/styles/ProductCard.module.scss';

interface ProductCardProps {
  id: number | string;
  title: string;
  price: number;
  images: string[];
  availableSizes: { size: number; available: boolean }[];
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  images,
  availableSizes,
}) => {
  const [favorite, setFavorite] = useState(false);

  // Регистрируем SwiperCore непосредственно в теле компонента
  SwiperCore.use([Navigation]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorite((prev) => !prev);
  };

  const handleSizeClick = (size: number) => {
    console.log(`Добавляем товар размера ${size} в корзину`);
  };

  return (
    <div className={styles.card}>
      {/* Область с изображением – кликабельная */}
      <Link href={`/product/${id}`} className={styles.clickableArea}>
        <div className={styles.imageContainer}>
          <Swiper
            navigation
            spaceBetween={0}
            slidesPerView={1}
            className={styles.swiper}
          >
            {images.map((img, index) => (
              <SwiperSlide key={index}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={img}
                    alt={title}
                    layout="fill"
                    objectFit="cover"
                    className={styles.image}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Стрелочки и блок "В КОРЗИНУ" */}
          <div className={styles.cartOverlay}>
            <div className={styles.cartContent}>
              <span className={styles.cartText}>В КОРЗИНУ</span>
              <div className={styles.cartSizes}>
                {availableSizes.map((s) =>
                  s.available ? (
                    <button
                      key={s.size}
                      className={styles.sizeButton}
                      onClick={() => handleSizeClick(s.size)}
                    >
                      {s.size}
                    </button>
                  ) : (
                    <span key={s.size} className={styles.sizeDisabled}>
                      {s.size}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Кнопка "Избранное" */}
      <button className={styles.favButton} onClick={handleFavoriteClick}>
        {favorite ? (
          <svg viewBox="0 0 24 24" fill="#000">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                     2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 
                     14.76 3 16.5 3c3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 
                     11.54L12 21.35z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                     2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 
                     14.76 3 16.5 3c3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 
                     11.54L12 21.35z" />
          </svg>
        )}
      </button>

      {/* Область с информацией о товаре */}
      <Link href={`/product/${id}`} className={styles.clickableArea}>
        <div className={styles.info}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.price}>{price.toLocaleString()} ₽</p>
        </div>
      </Link>
    </div>
  );
};
