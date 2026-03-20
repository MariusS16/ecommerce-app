import styles from './Badge.module.css'

/**
 * Props:
 * - variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'solid'
 */
export default function Badge({ children, variant = 'default' }) {
    return (
        <span className={`${styles.badge} ${styles[variant]}`}>
      {children}
    </span>
    )
}