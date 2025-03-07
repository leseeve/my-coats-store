// ProductImages.tsx
import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/thumbs';
import Image from 'next/image';
import styles from '@/styles/ProductImages.module.scss';

interface ProductImagesProps {
    images: string[];
}

const ProductImages = ({ images }: ProductImagesProps) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const mainSwiperRef = useRef<any>(null);

    return (
        <div className={styles.productImages}>
            {/* Слайдер миниатюр (thumbs) */}
            <div className={styles.thumbsContainer}>
                <Swiper
                    onSwiper={setThumbsSwiper}
                    watchSlidesProgress
                    slideToClickedSlide
                    spaceBetween={10}
                    slidesPerView={4}
                    direction="vertical"
                    modules={[Thumbs]}
                    className={styles.thumbsSwiper}
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={index}>
                            <Image
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className={styles.thumbImage}
                                width={90}
                                height={120}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Основной слайдер */}
            <div className={styles.mainContainer}>
                <Swiper
                    ref={mainSwiperRef}
                    spaceBetween={0}
                    navigation={{
                        nextEl: `.${styles.swiperButtonNext}`,
                        prevEl: `.${styles.swiperButtonPrev}`,
                    }}
                    thumbs={{ swiper: thumbsSwiper }}
                    modules={[Navigation, Thumbs]}
                    className={styles.mainSwiper}
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={index}>
                            <Image
                                src={image}
                                alt={`Product image ${index + 1}`}
                                className={styles.mainImage}
                                layout="responsive"
                                width={600}
                                height={800}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className={`${styles.swiperButtonPrev} ${styles.swiperButton}`}></div>
                <div className={`${styles.swiperButtonNext} ${styles.swiperButton}`}></div>
            </div>
        </div>
    );
};

export default ProductImages;

