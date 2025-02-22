import React from 'react';
import { ProductCard } from '@/components/ProductCard';
import styles from '@/styles/ProductGrid.module.scss';

export interface Product {
    id: number;
    title: string;
    price: number;
    images: string[];
    availableSizes: { size: number; available: boolean }[];
}

interface ProductGridProps {
    products: Product[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
    return (
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
    );
};
