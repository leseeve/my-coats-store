import Link from 'next/link';
import styles from '@/styles/Breadcrumbs.module.scss';

export type BreadcrumbItem = {
    label: string;
    href: string;
};

type BreadcrumbsProps = {
    items: BreadcrumbItem[];
};

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
    return (
        <div className={styles.breadcrumbContainer}>
            <nav className={styles.breadcrumbs}>
                <Link href="/" className={styles.backButton}>
                    Назад
                </Link>
                <span className={styles.breadcrumbsSeparator}>|</span>
                {items.map((crumb, idx) => {
                    const isLast = idx === items.length - 1;
                    return (
                        <span key={idx} className={styles.crumbItem}>
                            {isLast ? (
                                <span className={styles.currentCrumb}>{crumb.label}</span>
                            ) : (
                                <>
                                    <Link href={crumb.href} className={styles.breadcrumbLink}>
                                        {crumb.label}
                                    </Link>
                                    <span className={styles.crumbSeparator}>&gt;</span>
                                </>
                            )}
                        </span>
                    );
                })}
            </nav>
        </div>
    );
};
