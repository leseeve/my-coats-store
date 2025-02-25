import Footer from '@/components/Footer';
import styles from '../styles/404.module.scss'; // или './404.module.scss' — зависит от того, где лежит ваш файл
import Header from '@/components/Header';

export default function Custom404() {
    return (
        <><Header /><div className={styles.container}>
            <div className={styles.errorCode}>404</div>
            <div className={styles.errorMessage}>Страница не найдена</div>
            <a href="/" className={styles.homeLink}>
                Вернуться на главную
            </a>
        </div><Footer /></>
    );
}