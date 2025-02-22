import React from 'react';
import styles from '@/styles/CategoryList.module.scss';

interface CategoryListProps {
    categories: string[];
    selectedCategory: string;
    onCategoryClick: (category: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
    categories,
    selectedCategory,
    onCategoryClick,
}) => {
    return (
        <div className={styles.categories}>
            {categories.map((cat) => (
                <button
                    key={cat}
                    className={`${styles.categoryButton} ${cat === selectedCategory ? styles.active : ''
                        }`}
                    onClick={() => onCategoryClick(cat)}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};
