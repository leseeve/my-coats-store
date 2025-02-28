import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import styles from '@/styles/Accordion.module.scss';

interface AccordionItemProps {
    title: string;
    content: string;
}

const AccordionItem = ({ title, content }: AccordionItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={styles.accordionItem}>
            <button className={styles.accordionButton} onClick={toggleOpen}>
                <span>{title}</span>
                <IoIosArrowDown
                    className={`${styles.arrowIcon} ${isOpen ? styles.open : ''}`}
                />
            </button>
            {isOpen && <div className={styles.accordionContent}>{content}</div>}
        </div>
    );
};

const Accordion = () => {
    const items = [
        {
            title: 'Описание',
            content: `Артикул: 5152005316 
Состав: 66% полиэстер, 34% полиамид 
Уход за изделием: Бережная стирка при максимальной температуре 30ºС, Не отбеливать, Машинная сушка запрещена, Глажение при 110ºС, Профессиональная сухая чистка. Мягкий режим., Стирка в специальном мешке, Стирать и гладить, вывернув наизнанку, С изделиями похожих цветов, Не скручивать, Рекомендовано вертикальное отпаривание`,
        },
        {
            title: 'Доставка и оплата',
            content: 'Здесь будет информация о доставке и оплате.',
        },
        {
            title: 'Возврат',
            content: 'Здесь будет информация о возврате товара.',
        },
    ];

    return (
        <div className={styles.accordion}>
            {items.map((item, index) => (
                <AccordionItem key={index} title={item.title} content={item.content} />
            ))}
        </div>
    );
};

export default Accordion;