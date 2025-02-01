import React from 'react';
import { useRouter } from 'next/router';
import { PageLayout } from '@/layouts/PageLayout';

const ProductPage = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <PageLayout>
            <h1>Товар {id}</h1>
            <p>Информация о товаре будет загружаться здесь.</p>
        </PageLayout>
    );
};

export default ProductPage;