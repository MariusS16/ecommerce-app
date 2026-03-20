import styles from './Input.module.css'

/**
 * Componentă Input reutilizabilă
 *
 * Props:
 * - label — textul etichetei deasupra inputului
 * - error — mesaj de eroare (apare roșu dedesubt)
 * - helperText — text ajutător (apare gri dedesubt)
 * - icon — element JSX (ex: un SVG) afișat în stânga inputului
 * - required — adaugă * roșu lângă label
 * - type, placeholder, value, onChange — props standard HTML input
 */
export default function Input({
                                  label,
                                  error,
                                  helperText,
                                  icon,
                                  required = false,
                                  type = 'text',
                                  placeholder,
                                  value,
                                  onChange,
                                  disabled = false,
                                  name,
                                  id,
                                  className = '',
                              }) {
    const inputClasses = [
        styles.input,
        icon ? styles.withIcon : '',
        error ? styles.inputError : '',
        className,
    ].filter(Boolean).join(' ')

    return (
        <div className={styles.wrapper}>

            {/* Label — apare doar dacă e furnizat */}
            {label && (
                <label className={styles.label} htmlFor={id || name}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}
            {/* htmlFor în React = for în HTML
          Leagă label-ul de input — click pe label → focus pe input
          Echivalent Vue: <label :for="id"> */}

            <div className={styles.inputWrapper}>
                {/* Icon în stânga — dacă există */}
                {icon && <span className={styles.icon}>{icon}</span>}

                <input
                    id={id || name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={inputClasses}
                />
            </div>

            {/* Mesaj de eroare — prioritate față de helperText */}
            {error && <p className={styles.errorMessage}>{error}</p>}
            {!error && helperText && <p className={styles.helperText}>{helperText}</p>}

        </div>
    )
}