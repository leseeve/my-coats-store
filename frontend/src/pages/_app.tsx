import '@/styles/globals.scss';
import { Montserrat } from 'next/font/google';
import { AppProps } from 'next/app';
import { CartProvider } from '@/context/CartContext';

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <div className={montserrat.variable}>
        <Component {...pageProps} />
      </div>
    </CartProvider>
  );
}

