import React from 'react';
import { useRouter } from 'next/router';
import { PageLayout } from '@/layouts/PageLayout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import ProductImages from '@/components/ProductImages';
import ProductDetails from '@/components/ProductDetails';
import Accordion from '@/components/Accordion';
// import ProductCarousel from '@/components/ProductCarousel';
import styles from '@/styles/ProductPage.module.scss';

// Статичные данные о товаре (позже заменить на API)
const product = {
    id: 1,
    name: 'Классическое пальто',
    price: 15000,
    images: [
        '/images/coat1.jpg',
        '/images/coat2.jpg',
        '/images/coat3.jpg',
        '/images/coat4.jpg',
    ],
    sizes: ['40', '42', '44', '46'],
    description: `Артикул: 5152005316 
Состав: 66% полиэстер, 34% полиамид 
Уход за изделием: Бережная стирка при максимальной температуре 30ºС, Не отбеливать, Машинная сушка запрещена, Глажение при 110ºС, Профессиональная сухая чистка. Мягкий режим., Стирка в специальном мешке, Стирать и гладить, вывернув наизнанку, С изделиями похожих цветов, Не скручивать, Рекомендовано вертикальное отпаривание`,
    similarProducts: [
        { id: 2, name: 'Пальто с поясом', image: '/images/coat5.jpg', price: 16000 },
        { id: 3, name: 'Шерстяное пальто', image: '/images/coat6.jpg', price: 17000 },
        { id: 4, name: 'Двубортное пальто', image: '/images/coat7.jpg', price: 18000 },
        { id: 5, name: 'Пальто оверсайз', image: '/images/coat8.jpg', price: 19000 },
    ],
    viewedProducts: [
        { id: 6, name: 'Пальто с капюшоном', image: '/images/coat1.jpg', price: 14000 },
        { id: 7, name: 'Пальто с мехом', image: '/images/coat2.jpg', price: 20000 },
        { id: 8, name: 'Пальто с принтом', image: '/images/coat3.jpg', price: 15500 },
        { id: 9, name: 'Пальто с карманами', image: '/images/coat4.jpg', price: 16500 },
    ],
};

// Хлебные крошки
const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Каталог', href: '/catalog' },
    { label: 'Пальто', href: '/catalog/palto' },
    { label: product.name, href: `/product/${product.id}` },
];

const ProductPage = () => {
    const router = useRouter();
    const { id } = router.query;

    // Здесь будет запрос к API по id в будущем

    return (
        <PageLayout>
            <div className={styles.productPage}>
                <Breadcrumbs items={breadcrumbs} />
                <div className={styles.productContainer}>
                    <ProductImages images={product.images} />
                    <div className={styles.detailsRight}>
                        <ProductDetails product={product} />
                        <Accordion />
                    </div>
                </div>
                {/* <ProductCarousel title="Похожие товары" products={product.similarProducts} />
                <ProductCarousel title="Просмотренные товары" products={product.viewedProducts} /> */}
            </div>
        </PageLayout>
    );
};

export default ProductPage;