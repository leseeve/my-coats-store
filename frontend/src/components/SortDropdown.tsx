import React, { useState, useEffect, useRef } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import styles from '@/styles/SortDropdown.module.scss';

export interface SortOption {
    value: string;
    label: string;
}

interface SortDropdownProps {
    sortOptions: SortOption[];
    currentSort: string;
    onSortChange: (value: string) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
    sortOptions,
    currentSort,
    onSortChange,
}) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSortChange = (value: string) => {
        onSortChange(value);
        setOpen(false);
    };

    // Закрывать список, если клик вне его
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        // Чистим обработчик при размонтировании компонента
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    return (
        <div className={styles.sortWrapper} ref={dropdownRef}>
            <button
                className={styles.sortButton}
                onClick={() => setOpen(!open)}
            >
                {sortOptions.find((o) => o.value === currentSort)?.label ?? 'Сортировка'}
                <span className={`${styles.sortArrow} ${open ? styles.open : ''}`}>
                    <IoIosArrowDown className={styles.sortIcon} />
                </span>
            </button>
            <div className={`${styles.sortDropdown} ${open ? styles.open : ''}`}>
                {sortOptions.map((option) => (
                    <div
                        key={option.value}
                        className={`${styles.sortOption} ${currentSort === option.value ? styles.activeSort : ''
                            }`}
                        onClick={() => handleSortChange(option.value)}
                    >
                        {option.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

