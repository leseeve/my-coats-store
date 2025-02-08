import React, { useState, useRef } from 'react';
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

// Регистрируем модули Swiper
SwiperCore.use([Navigation, Pagination]);

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    delivery: string;
    composition: string;
    images: string[];
    availableSizes: number[];
}

const ProductPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    // Фиктивные данные товара (замените на реальные при подключении API)
    const product: Product = {
        id: 1,
        title: 'УТЕПЛЕННОЕ ПАЛЬТО',
        price: 2999,
        description:
            'Это подробное описание товара. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vitae magna id metus consectetur congue.',
        delivery:
            'Доставка осуществляется в течение 3-5 рабочих дней. Бесплатная доставка при заказе свыше 3000 ₽.',
        composition:
            'Состав: 100% шерсть. Свойства: теплое, удобное, долговечное.',
        images: [
            '/images/coat1.jpg',
            '/images/coat2.jpg',
            '/images/coat3.jpg'
        ],
        availableSizes: [40, 42, 38, 44],
    };

    // Автоматически выбираем минимальный размер
    const smallestSize = Math.min(...product.availableSizes);
    const [selectedSize, setSelectedSize] = useState<number>(smallestSize);

    // Состояние для текущего индекса большого изображения
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    // Сохраняем экземпляр Swiper
    const swiperRef = useRef<SwiperInstance | null>(null);

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

    // Состояния для collapsible секций
    const [descOpen, setDescOpen] = useState(false);
    const [deliveryOpen, setDeliveryOpen] = useState(false);
    const [compOpen, setCompOpen] = useState(false);

    return (
        <>
            <Header />
            <div className={styles.productPage}>
                <div className={styles.container}>
                    {/* Левая колонка: изображения */}
                    <div className={styles.leftColumn}>
                        <div className={styles.imageGallery}>
                            {/* Миниатюры (только для десктопа) */}
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
                            {/* Основной слайдер */}
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
                        {/* Выбор размера через выпадающий список */}
                        <div className={styles.sizeSelector}>
                            <select
                                className={styles.sizeDropdown}
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(Number(e.target.value))}
                            >
                                {product.availableSizes.map((size) => (
                                    <option key={size} value={size}>
                                        {size}{/* Можно добавить пометку для отсутствующих размеров, если нужно */}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Блок с кнопками (на всю ширину) */}
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
                                <h2>Описание</h2>
                                <svg
                                    className={`${styles.arrow} ${descOpen ? styles.open : ''}`}
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                >
                                    <path fill="#000" d="M12 16l-6-6h12z" />
                                </svg>
                            </div>
                            {descOpen && <div className={styles.collapsibleContent}><p>{product.description}</p></div>}
                        </div>

                        <div className={styles.collapsibleSection}>
                            <div className={styles.collapsibleHeader} onClick={() => setDeliveryOpen(!deliveryOpen)}>
                                <h2>Доставка</h2>
                                <svg
                                    className={`${styles.arrow} ${deliveryOpen ? styles.open : ''}`}
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                >
                                    <path fill="#000" d="M12 16l-6-6h12z" />
                                </svg>
                            </div>
                            {deliveryOpen && <div className={styles.collapsibleContent}><p>{product.delivery}</p></div>}
                        </div>

                        <div className={styles.collapsibleSection}>
                            <div className={styles.collapsibleHeader} onClick={() => setCompOpen(!compOpen)}>
                                <h2>Состав и свойства</h2>
                                <svg
                                    className={`${styles.arrow} ${compOpen ? styles.open : ''}`}
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                >
                                    <path fill="#000" d="M12 16l-6-6h12z" />
                                </svg>
                            </div>
                            {compOpen && <div className={styles.collapsibleContent}><p>{product.composition}</p></div>}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProductPage;

