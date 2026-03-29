import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './OrderSuccess.module.css'

// Pașii statusului de livrare
// În viitor se poate conecta la backend prin OrderStatus
const DELIVERY_STEPS = [
    { label: 'Comandă',   status: 'done'   },
    { label: 'Procesare', status: 'active' },
    { label: 'Expediere', status: 'idle'   },
    { label: 'Livrare',   status: 'idle'   },
]

export default function OrderSuccess() {
    const navigate = useNavigate()

    // Citim numărul comenzii salvat în sessionStorage de CheckoutPayment
    // Îl vom seta acolo după POST /api/orders reușit
    const orderNumber = sessionStorage.getItem('lastOrderNumber') || 'ORD-2026-00001'

    // Curăță sessionStorage la mount
    // Rulează o singură dată — nu vrem să curățe la fiecare re-render
    const cleaned = useRef(false)
    useEffect(() => {
        if (!cleaned.current) {
            sessionStorage.removeItem('checkoutAddress')
            sessionStorage.removeItem('lastOrderNumber')
            cleaned.current = true
        }
    }, [])

    return (
        <div className={styles.page}>
            <motion.div
                className={styles.card}
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >

                {/* ── Checkmark animat ── */}
                <motion.div
                    className={styles.checkWrap}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                    <div className={styles.checkInner}>
                        <svg width="26" height="26" viewBox="0 0 24 24"
                             fill="none" stroke="white" strokeWidth="3"
                             strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                    </div>
                </motion.div>

                {/* ── Text ── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                >
                    <h1 className={styles.title}>Comandă plasată cu succes!</h1>
                    <p className={styles.subtitle}>
                        Îți mulțumim pentru comandă. Vei primi un email de confirmare în scurt timp.
                    </p>
                    <div className={styles.orderBadge}>
                        🧾 #{orderNumber}
                    </div>
                </motion.div>

                {/* ── Status livrare ── */}
                <motion.div
                    className={styles.deliverySteps}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                >
                    {DELIVERY_STEPS.map((step, i) => (
                        <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
                            <div className={styles.dstep}>
                                <div className={`${styles.dCircle} ${
                                    step.status === 'done'   ? styles.dCircleDone   :
                                        step.status === 'active' ? styles.dCircleActive :
                                            styles.dCircleIdle
                                }`}>
                                    {step.status === 'done' ? (
                                        <svg width="13" height="13" viewBox="0 0 24 24"
                                             fill="none" stroke="white" strokeWidth="3"
                                             strokeLinecap="round">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                    ) : i + 1}
                                </div>
                                <span className={`${styles.dLabel} ${
                                    step.status === 'done'   ? styles.dLabelDone   :
                                        step.status === 'active' ? styles.dLabelActive :
                                            ''
                                }`}>
                  {step.label}
                </span>
                            </div>

                            {/* Linia dintre pași */}
                            {i < DELIVERY_STEPS.length - 1 && (
                                <div className={`${styles.dLine} ${
                                    step.status === 'done' ? styles.dLineDone : ''
                                }`} />
                            )}
                        </div>
                    ))}
                </motion.div>

                {/* ── Butoane ── */}
                <motion.div
                    className={styles.btns}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                >

                    <button
                        className={styles.btnDark}
                        onClick={() => navigate('/orders')}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24"
                             fill="none" stroke="white" strokeWidth="2.5"
                             strokeLinecap="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                        </svg>
                        Detalii comandă
                    </button>

                    <button
                        className={styles.btnPrimary}
                        onClick={() => navigate('/products')}
                    >
                        Continuă cumpărăturile
                    </button>
                </motion.div>

            </motion.div>
        </div>
    )
}