import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { PageLayout } from '@/layouts/PageLayout';
import { Breadcrumbs, BreadcrumbItem } from '@/components/Breadcrumbs';
import { CategoryList } from '@/components/CategoryList';
import { FiltersPanel } from '@/components/FiltersPanel';
import { SortDropdown, SortOption } from '@/components/SortDropdown';
import { ProductGrid, Product } from '@/components/ProductGrid';
import { Pagination } from '@/components/Pagination';
import { transliterate } from '@/pages/api/utils/transliterate';
import styles from '@/styles/Catalog.module.scss';

// Примерный массив товаров
const productsData: Product[] = [
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
    title: 'Жилет',
    price: 2000,
    images: ['/images/coat1.jpg', '/images/coat1_2.jpg'],
    availableSizes: [
      { size: 40, available: true },
      { size: 42, available: false },
      { size: 44, available: true },
    ],
  },
  {
    id: 3,
    title: 'Жилет',
    price: 30000,
    images: ['/images/coat1.jpg', '/images/coat1_2.jpg'],
    availableSizes: [
      { size: 40, available: true },
      { size: 42, available: false },
      { size: 44, available: true },
    ],
  },
  {
    id: 4,
    title: 'Жилет',
    price: 20000,
    images: ['/images/coat1.jpg', '/images/coat1_2.jpg'],
    availableSizes: [
      { size: 40, available: true },
      { size: 42, available: false },
      { size: 44, available: true },
    ],
  },
  // другие товары...
];

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

const sortOptions: SortOption[] = [
  { value: 'default', label: 'По умолчанию' },
  { value: 'priceAsc', label: 'По возрастанию цены' },
  { value: 'priceDesc', label: 'По убыванию цены' },
  { value: 'oldFirst', label: 'Сначала старые товары' },
  { value: 'newFirst', label: 'Сначала новые товары' },
];

export default function Catalog() {
  const router = useRouter();

  // Состояния
  const [selectedCategory, setSelectedCategory] = useState<string>('Каталог');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalItems = 48;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const [loadedProducts, setLoadedProducts] = useState<Product[]>(productsData.slice(0, itemsPerPage));

  const [filtersVisible, setFiltersVisible] = useState(false);
  const prices = productsData.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [currentSort, setCurrentSort] = useState<string>('default');

  // Хлебные крошки
  const breadcrumbs: BreadcrumbItem[] =
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

  // Обработчик клика по категории
  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    const slug = transliterate(cat);
    router.push(`/catalog/${slug}`);
  };

  // Обработчики фильтров
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible); // Используем toggleFilters для изменения состояния видимости фильтров
  };

  const handleResetFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedColors([]);
    setSelectedSizes([]);
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  const handleColorChange = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleResetColors = () => {
    setSelectedColors([]);
  };

  const handleSizeChange = (size: number) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleResetSizes = () => {
    setSelectedSizes([]);
  };

  // Обработчик сортировки
  const handleSortChange = (value: string) => {
    setCurrentSort(value);
  };

  // Пагинация и загрузка товаров
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const newProducts = productsData.slice(
      nextPage * itemsPerPage,
      (nextPage + 1) * itemsPerPage
    );
    setLoadedProducts((prev) => [...prev, ...newProducts]);
    setCurrentPage(nextPage);
  };

  // Отключение скролла при отображении фильтров
  useEffect(() => {
    document.body.style.overflow = filtersVisible ? 'hidden' : '';
  }, [filtersVisible]);

  return (
    <>
      <Head>
        <title>Каталог | MyCoats</title>
        <meta name="description" content="Каталог стильной верхней одежды" />
      </Head>

      <PageLayout>
        <section className={styles.catalog}>
          <Breadcrumbs items={breadcrumbs} />

          <h1>Каталог женской одежды</h1>

          <CategoryList
            categories={allCategories}
            selectedCategory={selectedCategory}
            onCategoryClick={handleCategoryClick}
          />

          <section className={styles.ButtonsSortWrapper}>
            <FiltersPanel
              onReset={handleResetFilters}
              priceRange={priceRange}
              onPriceRangeChange={handlePriceRangeChange}
              minPrice={minPrice}
              maxPrice={maxPrice}
              selectedColors={selectedColors}
              onColorChange={handleColorChange}
              onResetColors={handleResetColors}
              selectedSizes={selectedSizes}
              onSizeChange={handleSizeChange}
              onResetSizes={handleResetSizes}
              loadedProductsCount={loadedProducts.length}
              toggleFilters={toggleFilters} // Теперь передаем toggleFilters как пропс
            />

            <SortDropdown
              sortOptions={sortOptions}
              currentSort={currentSort}
              onSortChange={handleSortChange}
            />
          </section>

          <ProductGrid products={loadedProducts} />

          <Pagination
            loadedProductsCount={loadedProducts.length}
            totalItems={totalItems}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onLoadMore={handleLoadMore}
          />
        </section>
      </PageLayout>
    </>
  );
}
