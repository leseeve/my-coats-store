import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/CategoriesSection.module.scss';

// Регистрируем модуль навигации
SwiperCore.use([Navigation]);

const categories = [
    { id: 1, image: '/images/coat1.jpg', title: 'Свитеры и джемперы' },
    { id: 2, image: '/images/coat2.jpg', title: 'Экошубы' },
    { id: 3, image: '/images/coat3.jpg', title: 'Пальто' },
    { id: 4, image: '/images/coat4.jpg', title: 'Пальто' },
    { id: 5, image: '/images/coat5.jpg', title: 'Свитеры и джемперы' },
];

const CategoriesSection: React.FC = () => {
    return (
        <section id="categories" className={styles.categoriesSection}>
            <div className={styles.swiperContainer}>
                <Swiper
                    navigation={{
                        nextEl: `.${styles.catNext}`,
                        prevEl: `.${styles.catPrev}`,
                    }}
                    slidesPerView="auto"
                    spaceBetween={4}
                    freeMode
                    slidesPerGroup={1}
                    className={styles.categoriesSwiper}
                >
                    {categories.map((cat) => (
                        <SwiperSlide key={cat.id} className={styles.swiperSlide}>
                            <div className={styles.categoryCard}>
                                <Link href="#">
                                    <Image src={cat.image} alt="Категория" width={450} height={600} className={styles.catImage} />
                                    <div className={styles.catTitle}>{cat.title}</div>
                                </Link>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className={`${styles.catPrev} ${styles.swiperButtonPrev}`}></div>
                <div className={`${styles.catNext} ${styles.swiperButtonNext}`}></div>
            </div>
        </section>
    );
};

export default CategoriesSection;
