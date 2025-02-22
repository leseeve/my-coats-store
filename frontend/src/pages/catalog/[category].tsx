import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { PageLayout } from '@/layouts/PageLayout';
import { ProductCard } from '@/components/ProductCard';
import styles from '@/styles/2Catalog.module.scss';
import Link from 'next/link';

// Массив с товарами (пример)
const products = [
    {
        id: 1,
        title: 'Пальто №1',
        price: 4999,
        images: ['/images/coat3.jpg', '/images/coat3_2.jpg'],
        availableSizes: [
            { size: 40, available: true },
            { size: 42, available: true },
            { size: 44, available: true },
        ],
    },
    {
        id: 2,
        title: 'Пальто №2',
        price: 5999,
        images: ['/images/coat3.jpg', '/images/coat3_2.jpg'],
        availableSizes: [
            { size: 40, available: true },
            { size: 42, available: true },
            { size: 44, available: true },
        ],
    },
    // ... и т.д.
];

// Массив всех категорий на русском
const allCategories = [
    'Пальто',
    'Платья',
    'Пиджаки',
    'Рубашки',
    'Блузы',
    'Юбки',
    'Брюки',
    'Жакеты',
    'Плащи',
    'Куртки',
];

const transliterate = (text: string) => {
    const map: { [key: string]: string } = {
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh', 'З': 'Z', 'И': 'I',
        'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
        'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch', 'Ъ': '', 'Ы': 'Y', 'Э': 'E',
        'Ю': 'Yu', 'Я': 'Ya', 'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
        'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '',
        'ы': 'y', 'э': 'e', 'ю': 'yu', 'я': 'ya', ' ': '-', '-': '-'
    };

    // Основная транслитерация
    let result = text.split('').map((char) => map[char] || char).join('').toLowerCase();

    // Убираем символ 'ь' из строки после основной транслитерации
    result = result.replace(/ь/g, '').replace(/Ь/g, '');

    return result;
};

export default function CategoryCatalog() {
    const router = useRouter();
    const { category } = router.query;

    // 1) Если нет category или оно не string — вернём пустую строку (или можем сделать redirect / 404).
    if (typeof category !== 'string') {
        return null;
    }

    // 2) Ищем в массиве категорий ту, которая транслитерируется так же, как строка из URL
    const originalCategory = allCategories.find(
        (cat) => transliterate(cat) === category
    );

    // Если не нашли совпадения, можно либо отобразить 404, либо просто показать category
    // Для демонстрации: если не нашли, пускай будет "Неизвестная категория"
    const displayCategory = originalCategory ?? 'Неизвестная категория';

    // Перемещаем выбранную категорию в начало списка
    const updatedCategories = allCategories.includes(displayCategory)
        ? [displayCategory, ...allCategories.filter((cat) => cat !== displayCategory)]
        : allCategories;

    const breadcrumbs = displayCategory === 'Каталог'
        ? [
            { label: 'Главная', href: '/' },
            { label: 'Каталог', href: '/catalog' },
        ]
        : [
            { label: 'Главная', href: '/' },
            { label: 'Каталог', href: '/catalog' },
            { label: displayCategory, href: '' },
        ];

    return (
        <>
            <Head>
                <title>{displayCategory} | MyCoats</title>
                <meta name="description" content={`Товары категории ${displayCategory}`} />
            </Head>
            <PageLayout>
                <div className={styles.breadcrumbContainer}>
                    <nav className={styles.breadcrumbs}>
                        <Link href="/catalog" className={styles.backButton}>
                            Назад
                        </Link>
                        <span className={styles.breadcrumbsSeparator}>|</span>

                        {breadcrumbs.map((crumb, idx) => {
                            const isLast = idx === breadcrumbs.length - 1;
                            return (
                                <span key={idx} className={styles.crumbItem}>
                                    {isLast ? (
                                        <span className={styles.currentCrumb}>{crumb.label}</span>
                                    ) : (
                                        <>
                                            <Link href={crumb.href} className={styles.breadcrumbLink}>
                                                {crumb.label}
                                            </Link>
                                            <span className={styles.crumbSeparator}> &gt; </span>
                                        </>
                                    )}
                                </span>
                            );
                        })}
                    </nav>
                </div>

                <section className={styles.catalog}>
                    <h1>Каталог женской одежды</h1>
                    <div className={styles.categories}>
                        {updatedCategories.map((cat) => (
                            <Link key={cat} href={`/catalog/${transliterate(cat)}`}>
                                <button
                                    className={`${styles.categoryButton} ${cat === displayCategory ? styles.active : ''}`}
                                >
                                    {cat}
                                </button>
                            </Link>
                        ))}
                    </div>

                    <div className={styles.catalogGrid}>
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                title={product.title}
                                price={product.price}
                                images={product.images}
                                availableSizes={product.availableSizes}
                            />
                        ))}
                    </div>
                </section>
            </PageLayout>
        </>
    );
}