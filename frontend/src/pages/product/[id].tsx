// src/pages/product[id].tsx
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import SwiperCore, { Swiper as SwiperInstance } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from '@/styles/ProductPage.module.scss';
import { ProductCard } from '@/components/ProductCard';

// Регистрируем модули Swiper
SwiperCore.use([Navigation, Pagination]);

// Тип товара для заглушек
interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    delivery: string;
    composition: string;
    images: string[];
    availableSizes: { size: number; available: boolean }[];
}

const ProductPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    // Заглушка для текущего товара
    const product: Product = {
        id: 1,
        title: 'УТЕПЛЕННОЕ ПАЛЬТО',
        price: 2999,
        description:
            'Это подробное описание товара. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vitae magna id metus consectetur congue.',
        delivery: 'Доставка осуществляется в течение 3-5 рабочих дней. Бесплатная доставка при заказе свыше 3000 ₽.',
        composition: 'Состав: 100% шерсть. Теплое, удобное, долговечное.',
        images: ['/images/coat1.jpg', '/images/coat2.jpg', '/images/coat3.jpg'],
        availableSizes: [40, 42, 38, 44].map((s) => ({ size: s, available: true })),
    };

    // Выбираем минимальный размер по умолчанию
    const smallestSize = Math.min(...product.availableSizes.map((s) => s.size));
    const [selectedSize, setSelectedSize] = useState<number>(smallestSize);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const swiperRef = useRef<SwiperInstance | null>(null);

    // Заглушки для блоков "Похожие товары" и "Просмотренные товары"
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

    // Состояния для collapsible секций
    const [descOpen, setDescOpen] = useState(false);
    const [deliveryOpen, setDeliveryOpen] = useState(false);
    const [compOpen, setCompOpen] = useState(false);

    useEffect(() => {
        // Заглушка для похожих товаров: 10 элементов
        const similar: Product[] = Array.from({ length: 10 }, (_, i) => ({
            id: i + 101,
            title: `Похожий товар ${i + 1}`,
            price: 1000 + i * 100,
            description: 'Описание товара',
            delivery: 'Доставка 3-5 дней',
            composition: 'Состав товара',
            images: ['/images/coat1.jpg'],
            availableSizes: [{ size: 40, available: true }, { size: 42, available: true }],
        }));
        setSimilarProducts(similar);

        // Заглушка для просмотренных товаров: максимум 10 элементов (здесь 7 элементов для примера)
        const viewed: Product[] = Array.from({ length: 7 }, (_, i) => ({
            id: i + 201,
            title: `Просмотренный товар ${i + 1}`,
            price: 1500 + i * 50,
            description: 'Описание товара',
            delivery: 'Доставка 3-5 дней',
            composition: 'Состав товара',
            images: ['/images/coat2.jpg'],
            availableSizes: [{ size: 38, available: true }, { size: 40, available: true }],
        }));
        setRecentlyViewed(viewed);
    }, []);

    const handleThumbnailClick = (index: number) => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(index);
            setCurrentImageIndex(index);
        }
    };

    const handleSlideChange = (swiper: SwiperInstance) => {
        setCurrentImageIndex(swiper.activeIndex);
    };

    const handleAddToCart = () => {
        console.log('Добавляем товар в корзину, выбранный размер:', selectedSize);
    };

    const handleAddToFavorites = () => {
        console.log('Добавляем товар в избранное');
    };

    return (
        <>
            <Header />
            <div className={styles.productPage}>
                <div className={styles.container}>
                    {/* Левая колонка: изображения */}
                    <div className={styles.leftColumn}>
                        <div className={styles.imageGallery}>
                            <div className={styles.thumbnails}>
                                {product.images.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`${styles.thumbnail} ${index === currentImageIndex ? styles.active : ''}`}
                                        onClick={() => handleThumbnailClick(index)}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.title} миниатюра ${index + 1}`}
                                            width={60}
                                            height={80}
                                            objectFit="cover"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className={styles.mainSlider}>
                                <Swiper
                                    navigation
                                    pagination={{ clickable: true }}
                                    slidesPerView={1}
                                    onSlideChange={handleSlideChange}
                                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                                    className={styles.swiper}
                                >
                                    {product.images.map((img, index) => (
                                        <SwiperSlide key={index}>
                                            <div className={styles.mainImageWrapper}>
                                                <Image
                                                    src={img}
                                                    alt={`${product.title} изображение ${index + 1}`}
                                                    fill
                                                    objectFit="cover"
                                                    className={styles.mainImage}
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка: информация о товаре */}
                    <div className={styles.rightColumn}>
                        <h1 className={styles.title}>{product.title}</h1>
                        <p className={styles.price}>{product.price.toLocaleString()} ₽</p>
                        {/* Выбор размера с использованием нового класса для корректной высоты и серого выделения */}
                        <div className={styles.sizeSelector}>
                            <select
                                className={styles.customSizeDropdown}
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(Number(e.target.value))}
                            >
                                {product.availableSizes.map((s) => (
                                    <option key={s.size} value={s.size}>
                                        {s.size}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.actionsFullWidth}>
                            <button className={styles.addToCart} onClick={handleAddToCart}>
                                Добавить в корзину
                            </button>
                            <button className={styles.addToFavorites} onClick={handleAddToFavorites}>
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path
                                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                       2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 
                       14.76 3 16.5 3c3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 
                       11.54L12 21.35z"
                                        fill="none"
                                        stroke="#000"
                                        strokeWidth="2"
                                    />
                                </svg>
                            </button>
                        </div>
                        {/* Collapsible секции */}
                        <div className={styles.collapsibleSection}>
                            <div className={styles.collapsibleHeader} onClick={() => setDescOpen(!descOpen)}>
                                <h2>ОПИСАНИЕ</h2>
                                <svg
                                    className={`${styles.arrow} ${descOpen ? styles.open : ''}`}
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                >
                                    <path fill="#000" d="M12 16l-6-6h12z" />
                                </svg>
                            </div>
                            {descOpen && (
                                <div className={styles.collapsibleContent}>
                                    <p>{product.description}</p>
                                </div>
                            )}
                        </div>
                        <div className={styles.collapsibleSection}>
                            <div className={styles.collapsibleHeader} onClick={() => setDeliveryOpen(!deliveryOpen)}>
                                <h2>ДОСТАВКА</h2>
                                <svg
                                    className={`${styles.arrow} ${deliveryOpen ? styles.open : ''}`}
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                >
                                    <path fill="#000" d="M12 16l-6-6h12z" />
                                </svg>
                            </div>
                            {deliveryOpen && (
                                <div className={styles.collapsibleContent}>
                                    <p>{product.delivery}</p>
                                </div>
                            )}
                        </div>
                        <div className={styles.collapsibleSection}>
                            <div className={styles.collapsibleHeader} onClick={() => setCompOpen(!compOpen)}>
                                <h2>СОСТАВ И СВОЙСТВА</h2>
                                <svg
                                    className={`${styles.arrow} ${compOpen ? styles.open : ''}`}
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                >
                                    <path fill="#000" d="M12 16l-6-6h12z" />
                                </svg>
                            </div>
                            {compOpen && (
                                <div className={styles.collapsibleContent}>
                                    <p>{product.composition}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Блок "Похожие товары" */}
                <div className={styles.fullWidthBlock}>
                    <h2>Похожие товары</h2>
                    <Swiper
                        loop={true}
                        slidesPerView={4}
                        spaceBetween={10}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            0: { slidesPerView: 2 },
                            768: { slidesPerView: 4 },
                        }}
                        className={styles.carouselSwiper}
                    >
                        {similarProducts.map((prod) => (
                            <SwiperSlide key={prod.id}>
                                <ProductCard
                                    id={prod.id}
                                    title={prod.title}
                                    price={prod.price}
                                    images={prod.images}
                                    availableSizes={prod.availableSizes}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Блок "Просмотренные товары" */}
                <div className={styles.fullWidthBlock}>
                    <h2>Недавно просмотренные товары</h2>
                    <Swiper
                        loop={true}
                        slidesPerView={4}
                        spaceBetween={10}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            0: { slidesPerView: 2 },
                            768: { slidesPerView: 4 },
                        }}
                        className={styles.carouselSwiper}
                    >
                        {recentlyViewed.map((prod) => (
                            <SwiperSlide key={prod.id}>
                                <ProductCard
                                    id={prod.id}
                                    title={prod.title}
                                    price={prod.price}
                                    images={prod.images}
                                    availableSizes={prod.availableSizes}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProductPage;