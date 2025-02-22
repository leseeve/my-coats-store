import React, { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
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

    const handleSortChange = (value: string) => {
        onSortChange(value);
        setOpen(false);
    };

    return (
        <div className={styles.sortWrapper}>
            <button className={styles.sortButton} onClick={() => setOpen(!open)}>
                {sortOptions.find((o) => o.value === currentSort)?.label ?? 'Сортировка'}
                <span className={styles.sortArrow}>
                    {open ? (
                        <IoIosArrowUp className={styles.sortIcon} />
                    ) : (
                        <IoIosArrowDown className={styles.sortIcon} />
                    )}
                </span>
            </button>
            {open && (
                <div className={styles.sortDropdown}>
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
            )}
        </div>
    );
};
