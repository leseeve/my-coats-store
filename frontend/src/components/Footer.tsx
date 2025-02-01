import React from 'react';
import styles from './Footer.module.scss';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.socials}>Social Media</div>
      <ul className={styles.links}>
        <li>Доставка и самовывоз</li>
        <li>Оплата и возврат товара</li>
        <li>Как подобрать размер</li>
        <li>Уход за изделиями</li>
        <li>Бонусная программа</li>
        <li>Публичная оферта</li>
      </ul>
      <div className={styles.subscription}>
        <input type="email" placeholder="e-mail" />
        <button>→</button>
      </div>
    </footer>
  );
};