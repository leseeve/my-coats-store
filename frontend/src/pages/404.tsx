import Footer from '@/components/Footer';
import Link from 'next/link';
import styles from '../styles/404.module.scss';
import Header from '@/components/Header';

export default function Custom404() {
    return (
        <><Header /><div className={styles.container}>
            <div className={styles.errorCode}>404</div>
            <div className={styles.errorMessage}>Страница не найдена</div>
            <Link href="/" className={styles.homeLink}>
                Вернуться на главную
            </Link>
        </div><Footer /></>
    );
}