import styles from './Stepper.module.css'

/**
 * Props:
 * - value — cantitatea curentă
 * - onChange — funcție apelată cu noua valoare (ex: setQuantity)
 * - min — valoarea minimă (default 1)
 * - max — valoarea maximă (default 99)
 * - size: 'sm' | 'md'
 */
export default function Stepper({
                                    value,
                                    onChange,
                                    min = 1,
                                    max = 99,
                                    size = 'md',
                                }) {
    const handleDecrement = () => {
        if (value > min) onChange(value - 1)
    }

    const handleIncrement = () => {
        if (value < max) onChange(value + 1)
    }

    return (
        <div className={`${styles.stepper} ${styles[size]}`}>
            <button
                className={`${styles.btn} ${styles.btnLeft}`}
                onClick={handleDecrement}
                disabled={value <= min}
                type="button"
            >
                −
            </button>
            <span className={styles.value}>{value}</span>
            <button
                className={`${styles.btn} ${styles.btnRight}`}
                onClick={handleIncrement}
                disabled={value >= max}
                type="button"
            >
                +
            </button>
        </div>
    )
}