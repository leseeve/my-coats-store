// src/pages/_app.tsx
import '@/styles/globals.scss';


// Импорт стандартных стилей Swiper
import 'swiper/css';
import 'swiper/css/navigation';

// Импорт переопределенных стилей для Swiper
import '@/styles/swiper-overrides.scss';

import { Montserrat } from 'next/font/google';
import { AppProps } from 'next/app';
import { CartProvider } from '@/context/CartContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === '/') {
      document.body.style.paddingTop = '0';
      document.documentElement.style.paddingTop = '0';
    } else {
      document.body.style.paddingTop = '40px';
      document.documentElement.style.paddingTop = '40px';
    }
  }, [router.pathname]);

  return (
    <CartProvider>
      <div className={montserrat.variable}>
        <Component {...pageProps} />
      </div>
    </CartProvider>
  );
}

