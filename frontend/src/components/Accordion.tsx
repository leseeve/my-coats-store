import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import Link from 'next/link';
import styles from '@/styles/Accordion.module.scss';

interface AccordionItemProps {
    title: string;
    content: React.ReactNode; // Теперь контент — это ReactNode, а не строка
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
    // Массив пунктов. content теперь — ReactNode (JSX), а не строка
    const items: AccordionItemProps[] = [
        {
            title: 'Описание',
            content: (
                <>
                    <p>Артикул: 5152005316</p>
                    <p>Состав: 66% полиэстер, 34% полиамид</p>
                    <p>
                        Уход за изделием: Бережная стирка при максимальной температуре 30ºС,
                        Не отбеливать, Машинная сушка запрещена, Глажение при 110ºС,
                        Профессиональная сухая чистка. Мягкий режим., Стирка в специальном мешке,
                        Стирать и гладить, вывернув наизнанку, С изделиями похожих цветов,
                        Не скручивать, Рекомендовано вертикальное отпаривание
                    </p>
                </>
            ),
        },
        {
            title: 'Доставка и возврат',
            content: (
                <>
                    Подробная информация в разделе{' '}
                    <Link href="/shipping-and-return">
                        <span>Доставка и возврат</span>
                    </Link>
                </>
            ),
        },
        {
            title: 'Оплата',
            content: (
                <>
                    Подробная информация в разделе{' '}
                    <Link href="/payment">
                        <span>Оплата</span>
                    </Link>
                </>
            ),
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
