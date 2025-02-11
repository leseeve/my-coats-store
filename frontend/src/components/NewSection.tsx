// src/components/NewSection.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import styles from '@/styles/NewSection.module.scss';

// Регистрируем модуль навигации
SwiperCore.use([Navigation]);

const newProducts = [
    { id: 1, image: '/images/coat1.jpg', title: 'Объемные серьги-кольца', price: '1 299 ₽' },
    { id: 2, image: '/images/coat2.jpg', title: 'Трикотажная юбка-карандаш', price: '4 599 ₽' },
    { id: 3, image: '/images/coat3.jpg', title: 'Дубленка из искусственной замши', price: '14 999 ₽' },
    { id: 4, image: '/images/coat4.jpg', title: 'Сумка из фактурной экокожи', price: '4 999 ₽' },
];

const NewSection: React.FC = () => {
    return (
        <section className={styles.newSection}>
            <div className={styles.newTop}>
                <h2>Новинки</h2>
                <Link href="/catalog" className={styles.seeAll}>Смотреть все</Link>
            </div>
            <div className={styles.swiperContainer}>
                <Swiper
                    navigation={{
                        nextEl: `.${styles.newNext}`,
                        prevEl: `.${styles.newPrev}`,
                    }}
                    slidesPerView="auto"
                    spaceBetween={4}
                    freeMode
                    slidesPerGroup={1}
                    className={styles.newSwiper}
                >
                    {newProducts.map((prod) => (
                        <SwiperSlide key={prod.id} className={styles.swiperSlide}>
                            <div className={styles.newCard}>
                                {/* Ссылка на страницу продукта (можно настроить URL) */}
                                <Link href="/product-detail">
                                    <Image
                                        src={prod.image}
                                        alt="Новинка"
                                        width={450}
                                        height={600}
                                        className={styles.newImage}
                                    />
                                </Link>
                                {/* Обёртываем блок с текстом в ссылку */}
                                <Link href="/product-detail" className={styles.cardCaptionsLink}>
                                    <div className={styles.cardCaptions}>
                                        <div className={styles.newTitle}>{prod.title}</div>
                                        <div className={styles.newPrice}>{prod.price}</div>
                                    </div>
                                </Link>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className={`${styles.newPrev} ${styles.swiperButtonPrev}`}></div>
                <div className={`${styles.newNext} ${styles.swiperButtonNext}`}></div>
            </div>
        </section>
    );
};

export default NewSection;

