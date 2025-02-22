import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageLayout } from '@/layouts/PageLayout';
import { ProductCard } from '@/components/ProductCard';
import styles from '@/styles/Catalog.module.scss';
import { PiSlidersHorizontal } from 'react-icons/pi';
import { RiCloseLargeFill } from 'react-icons/ri'; // Новый крестик
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// Примерный массив товаров
const products = [
  {
    id: 1,
    title: 'Жилет',
    price: 1000,
    images: ['/images/coat1.jpg', '/images/coat1_2.jpg'],
    availableSizes: [
      { size: 40, available: true },
      { size: 42, available: false },
      { size: 44, available: true },
    ],
  },
  {
    id: 2,
    title: 'Куртка',
    price: 3000,
    images: ['/images/coat2.jpg', '/images/coat2_2.jpg'],
    availableSizes: [
      { size: 40, available: true },
      { size: 42, available: false },
      { size: 44, available: true },
    ],
  },
  {
    id: 3,
    title: 'Пальто',
    price: 9000,
    images: ['/images/coat3.jpg', '/images/coat3_2.jpg'],
    availableSizes: [
      { size: 40, available: true },
      { size: 42, available: false },
      { size: 44, available: true },
    ],
  },
  {
    id: 4,
    title: 'Плащ',
    price: 12000,
    images: ['/images/coat4.jpg', '/images/coat4_2.jpg'],
    availableSizes: [
      { size: 40, available: true },
      { size: 42, available: false },
      { size: 44, available: true },
    ],
  },
];

// Категории
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

// Транслитерация
const transliterate = (text: string) => {
  const map: { [key: string]: string } = {
    // ...
  };
  let result = text.split('').map((char) => map[char] || char).join('').toLowerCase();
  result = result.replace(/ь/g, '').replace(/Ь/g, '');
  return result;
};

export default function Catalog() {
  const router = useRouter();

  // Состояния
  const [selectedCategory, setSelectedCategory] = useState<string>('Каталог');
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedProducts, setLoadedProducts] = useState(products.slice(0, 12));
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Цены
  const prices = products.map((p) => p.price);
  const minCatalogPrice = Math.min(...prices);
  const maxCatalogPrice = Math.max(...prices);

  // Диапазон цен
  const [priceRange, setPriceRange] = useState<[number, number]>([minCatalogPrice, maxCatalogPrice]);

  // Фильтры
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [colorListOpen, setColorListOpen] = useState(false);
  const [sizeListOpen, setSizeListOpen] = useState(false);

  // Параметры для имитации бэкенда
  const totalItems = 1958;
  const itemsPerPage = 12;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Обработчики категорий, пагинации
  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    const slug = transliterate(cat);
    router.push(`/catalog/${slug}`);
  };

  const loadMoreProducts = () => {
    const nextPage = currentPage + 1;
    const newLoadedProducts = [
      ...loadedProducts,
      ...products.slice(nextPage * itemsPerPage, (nextPage + 1) * itemsPerPage),
    ];
    setLoadedProducts(newLoadedProducts);
    setCurrentPage(nextPage);
  };

  // Хлебные крошки
  const breadcrumbs =
    selectedCategory === 'Каталог'
      ? [
        { label: 'Главная', href: '/' },
        { label: 'Каталог', href: '/catalog' },
      ]
      : [
        { label: 'Главная', href: '/' },
        { label: 'Каталог', href: '/catalog' },
        { label: selectedCategory, href: '' },
      ];

  // Пагинация
  const paginationItems: (number | string)[] = [];
  const maxPagesToShow = 5;
  if (totalPages > maxPagesToShow) {
    if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) {
        paginationItems.push(i);
      }
      paginationItems.push('...');
      paginationItems.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      paginationItems.push(1);
      paginationItems.push('...');
      for (let i = totalPages - 4; i <= totalPages; i++) {
        paginationItems.push(i);
      }
    } else {
      paginationItems.push(1);
      paginationItems.push('...');
      const startPage = currentPage - 1;
      const endPage = currentPage + 1;
      for (let i = startPage; i <= endPage; i++) {
        paginationItems.push(i);
      }
      paginationItems.push('...');
      paginationItems.push(totalPages);
    }
  } else {
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(i);
    }
  }

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number') {
      setCurrentPage(page);
    }
  };

  // Открыть / закрыть фильтры
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  // Диапазон цен (rc-slider)
  const handlePriceRangeChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setPriceRange([value[0], value[1]]);
    }
  };

  // Фильтры цвета / размера
  const handleColorChange = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSizeChange = (size: number) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Сброс фильтров
  const handleFilterReset = () => {
    setPriceRange([minCatalogPrice, maxCatalogPrice]);
    setSelectedColors([]);
    setSelectedSizes([]);
  };

  const resetColorFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSelectedColors([]);
  };

  const resetSizeFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSelectedSizes([]);
  };

  // Отключаем скролл страницы за фильтрами
  useEffect(() => {
    if (filtersVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [filtersVisible]);

  // Закрыть фильтры при клике вне области
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Element;
      if (
        filtersVisible &&
        target &&
        !target.closest(`.${styles.filtersContainer}`) &&
        !target.closest(`.${styles.filtersButton}`)
      ) {
        setFiltersVisible(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [filtersVisible]);

  return (
    <>
      <Head>
        <title>Каталог | MyCoats</title>
        <meta name="description" content="Каталог стильной верхней одежды" />
      </Head>
      <PageLayout>
        {/* Хлебные крошки */}
        <div className={styles.breadcrumbContainer}>
          <nav className={styles.breadcrumbs}>
            <Link href="/" className={styles.backButton}>
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

        {/* Основная часть */}
        <section className={styles.catalog}>
          <h1>Каталог женской одежды</h1>

          <div className={styles.filtersButtonContainer}>
            <button onClick={toggleFilters} className={styles.filtersButton}>
              <PiSlidersHorizontal /> Фильтры
            </button>
          </div>

          {/* Оверлей фильтров */}
          <div className={`${styles.filtersOverlay} ${filtersVisible ? styles.active : ''}`}>
            {/* Контейнер с фильтрами на всю высоту экрана */}
            <div className={`${styles.filtersContainer} ${filtersVisible ? styles.active : ''}`}>
              <div className={styles.filtersHeader}>
                <h3>Фильтры</h3>
                {/* Меняем крестик на RiCloseLargeFill */}
                <button onClick={toggleFilters} className={styles.closeButton}>
                  <RiCloseLargeFill />
                </button>
              </div>

              <button onClick={handleFilterReset} className={styles.resetButton}>
                Сбросить все
              </button>

              {/* Ценовой фильтр */}
              <div className={styles.priceFilter}>
                <label>Цена</label>
                <div className={styles.rangeWrapper}>
                  <Slider
                    range
                    min={minCatalogPrice}
                    max={maxCatalogPrice}
                    step={200}
                    allowCross={false}
                    defaultValue={[priceRange[0], priceRange[1]]}
                    onChange={(value) => handlePriceRangeChange(value)}
                  />
                </div>
                <div>
                  от {priceRange[0]} ₽ до {priceRange[1]} ₽
                </div>
              </div>

              {/* Фильтр цвета */}
              <div className={styles.colorFilter}>
                <div
                  className={styles.filterHeader}
                  onClick={() => setColorListOpen(!colorListOpen)}
                >
                  <span className={styles.filterToggle}>
                    {colorListOpen ? '-' : '+'}
                  </span>
                  <span className={styles.filterTitle}>Цвет</span>
                  <button className={styles.resetButtonFilter} onClick={resetColorFilter}>
                    Сбросить
                  </button>
                </div>
                {colorListOpen && (
                  <div className={styles.filterOptions}>
                    {['бежевый', 'белый', 'бирюзовый'].map((color) => (
                      <label key={color}>
                        <input
                          type="checkbox"
                          checked={selectedColors.includes(color)}
                          onChange={() => handleColorChange(color)}
                        />
                        {color}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Фильтр размера */}
              <div className={styles.sizeFilter}>
                <div
                  className={styles.filterHeader}
                  onClick={() => setSizeListOpen(!sizeListOpen)}
                >
                  <span className={styles.filterToggle}>
                    {sizeListOpen ? '-' : '+'}
                  </span>
                  <span className={styles.filterTitle}>Размер</span>
                  <button className={styles.resetButtonFilter} onClick={resetSizeFilter}>
                    Сбросить
                  </button>
                </div>
                {sizeListOpen && (
                  <div className={styles.filterOptions}>
                    {[40, 42, 44, 46, 48].map((size) => (
                      <label key={size}>
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size)}
                          onChange={() => handleSizeChange(size)}
                        />
                        {size}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Кнопка "Показать X товаров" зафиксирована внизу */}
              <div className={styles.showProductsButtonContainer}>
                <button className={styles.showProductsButton}>
                  Показать {loadedProducts.length} товаров
                </button>
              </div>
            </div>
          </div>

          {/* Список категорий */}
          <div className={styles.categories}>
            {allCategories.map((cat) => (
              <button
                key={cat}
                className={`${styles.categoryButton} ${cat === selectedCategory ? styles.active : ''
                  }`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Сетка товаров */}
          <div className={styles.catalogGrid}>
            {loadedProducts.map((product) => (
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

          {/* Пагинация */}
          <div className={styles.pagination}>
            <div className={styles.pageInfo}>
              Показано {loadedProducts.length} из {totalItems} товаров
            </div>
            <div className={styles.pageNumbers}>
              {paginationItems.map((item, index) => (
                <span
                  key={index}
                  className={`${styles.pageItem} ${typeof item === 'number' ? styles.pageNumber : styles.ellipsis
                    } ${item === currentPage ? styles.activePage : ''}`}
                  onClick={() => {
                    if (typeof item === 'number') {
                      handlePageClick(item);
                    }
                  }}
                >
                  <span className={styles.pageBlock}>{item}</span>
                </span>
              ))}
            </div>
            <button className={styles.loadMoreButton} onClick={loadMoreProducts}>
              Загрузить еще
            </button>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
