import React from 'react';
import Link from 'next/link';
import styles from '@/styles/Footer.module.scss';
import { RiVisaLine, RiMastercardFill, RiInstagramFill, RiTelegram2Fill, RiWhatsappFill, } from "react-icons/ri";
import { IoMail } from "react-icons/io5";
import BlackVisaIcon from '@/components/BlackVisaIconMIR';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerLeft}>
          <h3 className={styles.footerLogo}>UnholyPlace</h3>
          <div className={styles.socialLinks}>
            <Link href="#" className={styles.socIcon}>
              <RiTelegram2Fill />
            </Link>
            <Link href="#" className={styles.socIcon}>
              <RiInstagramFill />
            </Link>
            <Link href="#" className={styles.socIcon}>
              <RiWhatsappFill />
            </Link>
            <Link href="#" className={styles.socIcon}>
              <IoMail />
            </Link>
          </div>
        </div>

        <div className={styles.footerCenter}>
          <ul>
            <li><Link href="/shipping-and-return">Доставка и возврат</Link></li>
            <li><Link href="/catalog/how-to-choose-size">Как подобрать размер</Link></li>
            <li><Link href="/catalog/care">Уход за изделиями</Link></li>
            <li><Link href="/catalog/privacy-policy">Политика конфиденциальности</Link></li>
            <li><Link href="/catalog/public-offer">Публичная оферта</Link></li>
            <li><Link href="/contacts">Контакты</Link></li>
            <li><Link href="/notifications">Уведомления</Link></li>
          </ul>
        </div>

        <div className={styles.footerRight}>
          <p className={styles.supportPhone}>
            <a href="tel:+79888680508">8 (988) 868-05-08</a>
            <span className={styles.supportText}>Служба поддержки</span>
            <span className={styles.supportText}>с 10:00 до 21:00 по МСК</span>
          </p>
          <div className={styles.paymentIcons}>
            <RiVisaLine className={`${styles.paymentIcon} ${styles.paymentIconVisa}`} />
            <RiMastercardFill className={`${styles.paymentIcon} ${styles.paymentIconMastercard}`} />
            <BlackVisaIcon className={`${styles.paymentIcon} ${styles.paymentIconMIR}`} />
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; 2025 UnholyPlace. Все права защищены Виктором лично</p>
      </div>
    </footer>
  );
};

export default Footer;
