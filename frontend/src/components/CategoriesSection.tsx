import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/CategoriesSection.module.scss';

const categories = [
    { id: 1, image: '/images/coat1.jpg', title: 'Пальто' },
    { id: 2, image: '/images/coat2.jpg', title: 'Платья' },
    { id: 3, image: '/images/coat3.jpg', title: 'Пиджаки' },
    { id: 4, image: '/images/coat4.jpg', title: 'Рубашки' },
    { id: 5, image: '/images/coat5.jpg', title: 'Блузы' },
    { id: 6, image: '/images/coat1.jpg', title: 'Юбки' },
    { id: 7, image: '/images/coat2.jpg', title: 'Брюки' },
    { id: 8, image: '/images/coat3.jpg', title: 'Жакеты' },
    { id: 9, image: '/images/coat4.jpg', title: 'Плащи' },
    { id: 10, image: '/images/coat5.jpg', title: 'Куртки' },
];

const CategoriesSection: React.FC = () => {
    // Регистрируем SwiperCore внутри компонента
    SwiperCore.use([Navigation]);

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
                                {/* Ссылка для изображения */}
                                <Link href="#">
                                    <Image
                                        src={cat.image}
                                        alt="Категория"
                                        width={360}
                                        height={480}
                                        className={styles.catImage}
                                    />
                                </Link>
                                {/* Ссылка для подписи */}
                                <Link href="#" className={styles.catCaptionLink}>
                                    <div className={styles.catCaption}>
                                        <div className={styles.catTitle}>{cat.title}</div>
                                    </div>
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

