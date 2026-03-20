import styles from './Button.module.css'

/**
 * Componentă Button reutilizabilă
 *
 * Props:
 * - variant: 'primary' | 'outline' | 'ghost' | 'danger' | 'success'
 * - size: 'sm' | 'md' | 'lg'
 * - loading: true/false — arată spinner și dezactivează butonul
 * - fullWidth: true/false — ocupă toată lățimea
 * - onClick, disabled, type — props standard HTML
 * - children — conținutul butonului (text, iconiță etc.)
 */
export default function Button({
                                   children,
                                   variant = 'primary',
                                   size = 'md',
                                   loading = false,
                                   fullWidth = false,
                                   disabled = false,
                                   onClick,
                                   type = 'button',
                                   className = '',
                               }) {
    // Combinăm clasele CSS — variant + size + fullWidth
    // Echivalent Vue: :class="[styles.button, styles[variant], styles[size]]"
    const classes = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : '',
        className,
    ].filter(Boolean).join(' ')
    // .filter(Boolean) — elimină stringurile goale din array

    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {/* Spinner — apare doar când loading e true */}
            {loading && (
                <span className={
                    variant === 'outline' ? styles.spinnerDark : styles.spinner
                } />
            )}
            {children}
        </button>
    )
}