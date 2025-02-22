import React from 'react';
import styles from '@/styles/Pagination.module.scss';

interface PaginationProps {
    loadedProductsCount: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onLoadMore: () => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    loadedProductsCount,
    totalItems,
    currentPage,
    totalPages,
    onPageChange,
    onLoadMore,
}) => {
    // Генерация списка элементов пагинации
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

    return (
        <div className={styles.pagination}>
            <div className={styles.pageInfo}>
                Показано {loadedProductsCount} из {totalItems} товаров
            </div>
            <div className={styles.pageNumbers}>
                {paginationItems.map((item, index) => (
                    <span
                        key={index}
                        className={`${styles.pageItem} ${typeof item === 'number' ? styles.pageNumber : styles.ellipsis
                            } ${item === currentPage ? styles.activePage : ''}`}
                        onClick={() => {
                            if (typeof item === 'number') {
                                onPageChange(item);
                            }
                        }}
                    >
                        <span className={styles.pageBlock}>{item}</span>
                    </span>
                ))}
            </div>
            <button className={styles.loadMoreButton} onClick={onLoadMore}>
                Загрузить еще
            </button>
        </div>
    );
};
