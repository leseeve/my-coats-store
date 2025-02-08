import React from 'react';
import Link from 'next/link';
import styles from '@/styles/Footer.module.scss';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerLeft}>
          <h3>Social Media</h3>
          <div className={styles.socialLinks}>
            <Link href="#" className={`${styles.socIcon} ${styles.tiktok}`}></Link>
            <Link href="#" className={`${styles.socIcon} ${styles.vk}`}></Link>
            <Link href="#" className={`${styles.socIcon} ${styles.youtube}`}></Link>
            <Link href="#" className={`${styles.socIcon} ${styles.telegram}`}></Link>
            <Link href="#" className={`${styles.socIcon} ${styles.zen}`}></Link>
          </div>
        </div>
        <div className={styles.footerCenter}>
          <ul>
            <li><Link href="#">Доставка и самовывоз</Link></li>
            <li><Link href="#">Оплата и возврат товара</Link></li>
            <li><Link href="#">Как подобрать размер</Link></li>
            <li><Link href="#">Уход за изделиями</Link></li>
            <li><Link href="#">Бонусная программа</Link></li>
            <li><Link href="#">Публичная оферта</Link></li>
          </ul>
        </div>
        <div className={styles.footerRight}>
          <h3>Подписка на новости и скидки</h3>
          <form>
            <input type="email" placeholder="e-mail" />
            <div className={styles.policy}>
              <input type="checkbox" id="accept" />
              <label htmlFor="accept">
                Принимаю пользовательское соглашение о конфиденциальности
              </label>
            </div>
            <button type="submit">→</button>
          </form>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>
          2025-2025 © UnholyPlace. Все права защищены. Интернет-магазин стильной женской одежды и пальто с мембраной.
          Цены интернет-магазина могут отличаться от цен розничных магазинов(не ходите туда).
        </p>
      </div>
    </footer>
  );
};

export default Footer;
