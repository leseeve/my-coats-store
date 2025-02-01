// import Head from 'next/head';
// import { PageLayout } from '@/layouts/PageLayout';
// import { ProductCard } from '@/components/ProductCard';
// import styles from '@/styles/Catalog.module.scss';

// export default function Catalog() {
//   return (
//     <>
//       <Head>
//         <title>Каталог | MyCoats</title>
//         <meta name="description" content="Каталог стильной верхней одежды" />
//       </Head>
//       <PageLayout>
//         <section className={styles.catalog}>
//           <h1>ЖЕНСКАЯ ВЕРХНЯЯ ОДЕЖДА - НОВИНКИ КАТАЛОГА</h1>
//           <div className={styles.categories}>
//             <button>Куртки</button>
//             <button>Шубы</button>
//             <button>Пальто</button>
//           </div>
//           <div className={styles.grid}>
//             <ProductCard
//               title="Жилет"
//               price={3599}
//               images={['/images/coat1.jpg']}
//               availableSizes={[
//                 { size: 40, available: true },
//                 { size: 42, available: false },
//                 { size: 44, available: true },
//               ]}
//             />
//             <ProductCard
//               title="Куртка"
//               price={10999}
//               images={['/images/coat2.jpg']}
//               availableSizes={[
//                 { size: 40, available: true },
//                 { size: 42, available: false },
//                 { size: 44, available: true },
//               ]}
//             />
//             <ProductCard
//               title="Жилет"
//               price={4999}
//               images={['/images/coat3.jpg']}
//               availableSizes={[
//                 { size: 40, available: true },
//                 { size: 42, available: false },
//                 { size: 44, available: true },
//               ]}
//             />
//             <ProductCard
//               title="Жилет"
//               price={4999}
//               images={['/images/coat4.jpg']}
//               availableSizes={[
//                 { size: 40, available: true },
//                 { size: 42, available: false },
//                 { size: 44, available: true },
//               ]}
//             />
//             <ProductCard
//               title="Жилет"
//               price={4999}
//               images={['/images/coat5.jpg']}
//               availableSizes={[
//                 { size: 40, available: true },
//                 { size: 42, available: false },
//                 { size: 44, available: true },
//               ]}
//             />
//             <ProductCard
//               title="Жилет"
//               price={4999}
//               images={['/images/coat6.jpg']}
//               availableSizes={[
//                 { size: 40, available: true },
//                 { size: 42, available: false },
//                 { size: 44, available: true },
//               ]}
//             />
//             <ProductCard
//               title="Жилет"
//               price={4999}
//               images={['/images/coat7.jpg']}
//               availableSizes={[
//                 { size: 40, available: true },
//                 { size: 42, available: false },
//                 { size: 44, available: true },
//               ]}
//             />
//             <ProductCard
//               title="Жилет"
//               price={4999}
//               images={['/images/coat8.jpg']}
//               availableSizes={[
//                 { size: 40, available: true },
//                 { size: 42, available: false },
//                 { size: 44, available: true },
//               ]}
//             />
//             <ProductCard
//               title="Жилет"
//               price={4999}
//               images={['/images/coat8.jpg']}
//               availableSizes={[
//                 { size: 40, available: true },
//                 { size: 42, available: false },
//                 { size: 44, available: true },
//               ]}
//             />
//             <ProductCard
//               title="Жилет"
//               price={4999}
//               images={['/images/coat8.jpg']}
//               availableSizes={[
//                 { size: 40, available: true },
//                 { size: 42, available: false },
//                 { size: 44, available: true },
//               ]}
//             />
//             <ProductCard
//               title="Жилет"
//               price={4999}
//               images={['/images/coat8.jpg']}
//               availableSizes={[
//                 { size: 40, available: true },
//                 { size: 42, available: false },
//                 { size: 44, available: true },
//               ]}
//             />
//           </div>
//         </section>
//       </PageLayout>
//     </>
//   );
// }
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { PageLayout } from '@/layouts/PageLayout';
import { ProductCard } from '@/components/ProductCard';
import styles from '@/styles/Catalog.module.scss';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  images?: string[];
  sizes: { id: number; size_value: number; description?: string }[];
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/`);
        if (!res.ok) {
          throw new Error(`Ошибка загрузки товаров: ${res.status}`);
        }
        const data = await res.json();
        const productsData = data.results || data;
        setProducts(productsData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error('Unknown error', err);
        }
        setError('Не удалось загрузить товары');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Head>
        <title>Каталог | MyCoats</title>
        <meta name="description" content="Каталог стильной верхней одежды" />
      </Head>
      <PageLayout>
        <section className={styles.catalog}>
          <h1>Женская верхняя одежда - Новинки каталога</h1>
          <div className={styles.categories}>
            <button>Куртки</button>
            <button>Шубы</button>
            <button>Пальто</button>
          </div>
          {loading ? (
            <p>Загрузка товаров...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <div className={styles.grid}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.name}
                  price={parseFloat(product.price)}
                  images={
                    product.images && product.images.length > 0
                      ? product.images
                      : ['/images/default.jpg']
                  }
                  availableSizes={product.sizes.map((s) => ({
                    size: s.size_value,
                    available: product.stock > 0,
                  }))}
                />
              ))}
            </div>
          )}
        </section>
      </PageLayout>
    </>
  );
}
