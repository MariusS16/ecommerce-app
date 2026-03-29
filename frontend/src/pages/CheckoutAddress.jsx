import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../hooks/useCart'
import { StepsBar } from './Cart'
import styles from './CheckoutAddress.module.css'

// Animație slide pentru tranziții între pagini
const pageVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: -40 },
}

export default function CheckoutAddress() {
    const navigate = useNavigate()
    const { cart } = useCart()

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        county: '',
        postalCode: '',
        notes: '',
    })

    const [errors, setErrors] = useState({})

    const formatPrice = (price) =>
        new Intl.NumberFormat('ro-RO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price)

    const subtotal = cart?.totalPrice || 0
    const isFreeShipping = subtotal >= 200
    const total = isFreeShipping ? subtotal : subtotal + 15

    // ── Handlers ──
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        // Curăță eroarea când userul începe să scrie
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    // ── Validare ──
    const validate = () => {
        const newErrors = {}
        if (!form.firstName.trim()) newErrors.firstName = 'Prenumele este obligatoriu'
        if (!form.lastName.trim())  newErrors.lastName  = 'Numele este obligatoriu'
        if (!form.email.trim())     newErrors.email     = 'Email-ul este obligatoriu'
        if (!form.phone.trim())     newErrors.phone     = 'Telefonul este obligatoriu'
        if (!form.address.trim())   newErrors.address   = 'Adresa este obligatorie'
        if (!form.city.trim())      newErrors.city      = 'Orașul este obligatoriu'
        if (!form.county.trim())    newErrors.county    = 'Județul este obligatoriu'
        if (!form.postalCode.trim()) newErrors.postalCode = 'Codul poștal este obligatoriu'

        // Validare email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (form.email && !emailRegex.test(form.email)) {
            newErrors.email = 'Email invalid'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleContinue = () => {
        if (!validate()) return
        // Salvăm datele adresei în sessionStorage
        // sessionStorage — persistent doar în sesiunea curentă a browser-ului
        // La refresh sau închidere tab se șterge automat
        sessionStorage.setItem('checkoutAddress', JSON.stringify(form))
        navigate('/checkout/payment')
    }

    return (
        <motion.div
            className={styles.page}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
            <StepsBar currentStep={2} />

            <div className={styles.layout}>

                {/* ── Formular adresă ── */}
                <div className={styles.formCard}>
                    <h1 className={styles.formTitle}>Adresa de livrare</h1>
                    <p className={styles.formSubtitle}>
                        Completează datele pentru livrarea comenzii
                    </p>

                    {/* Prenume + Nume */}
                    <div className={styles.twoCol}>
                        <div>
                            <label className={styles.label}>Prenume *</label>
                            <input
                                className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                placeholder="Marius"
                            />
                            {errors.firstName && (
                                <p className={styles.errorMsg}>⚠ {errors.firstName}</p>
                            )}
                        </div>
                        <div>
                            <label className={styles.label}>Nume *</label>
                            <input
                                className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                placeholder="Ionescu"
                            />
                            {errors.lastName && (
                                <p className={styles.errorMsg}>⚠ {errors.lastName}</p>
                            )}
                        </div>
                    </div>

                    {/* Email + Telefon */}
                    <div className={styles.twoCol}>
                        <div>
                            <label className={styles.label}>Email *</label>
                            <input
                                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="marius@example.com"
                            />
                            {errors.email && (
                                <p className={styles.errorMsg}>⚠ {errors.email}</p>
                            )}
                        </div>
                        <div>
                            <label className={styles.label}>Telefon *</label>
                            <input
                                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                                name="phone"
                                type="tel"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="07XX XXX XXX"
                            />
                            {errors.phone && (
                                <p className={styles.errorMsg}>⚠ {errors.phone}</p>
                            )}
                        </div>
                    </div>

                    {/* Adresă */}
                    <div className={styles.field}>
                        <label className={styles.label}>Adresă (stradă, număr) *</label>
                        <input
                            className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Str. Exemplu nr. 10, Bloc A, Ap. 5"
                        />
                        {errors.address && (
                            <p className={styles.errorMsg}>⚠ {errors.address}</p>
                        )}
                    </div>

                    {/* Oraș + Județ + Cod poștal */}
                    <div className={styles.threeCol}>
                        <div>
                            <label className={styles.label}>Oraș *</label>
                            <input
                                className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                placeholder="București"
                            />
                            {errors.city && (
                                <p className={styles.errorMsg}>⚠ {errors.city}</p>
                            )}
                        </div>
                        <div>
                            <label className={styles.label}>Județ *</label>
                            <input
                                className={`${styles.input} ${errors.county ? styles.inputError : ''}`}
                                name="county"
                                value={form.county}
                                onChange={handleChange}
                                placeholder="Ilfov"
                            />
                            {errors.county && (
                                <p className={styles.errorMsg}>⚠ {errors.county}</p>
                            )}
                        </div>
                        <div>
                            <label className={styles.label}>Cod poștal *</label>
                            <input
                                className={`${styles.input} ${errors.postalCode ? styles.inputError : ''}`}
                                name="postalCode"
                                value={form.postalCode}
                                onChange={handleChange}
                                placeholder="010101"
                            />
                            {errors.postalCode && (
                                <p className={styles.errorMsg}>⚠ {errors.postalCode}</p>
                            )}
                        </div>
                    </div>

                    {/* Note */}
                    <div className={styles.field}>
                        <label className={styles.label}>
                            Note suplimentare{' '}
                            <span className={styles.labelOptional}>(opțional)</span>
                        </label>
                        <textarea
                            className={`${styles.input} ${styles.textarea}`}
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            placeholder="Ex: Interfon 42, etaj 3, livrare după ora 18..."
                        />
                    </div>
                </div>

                {/* ── Order Summary ── */}
                <OrderSummary
                    cart={cart}
                    subtotal={subtotal}
                    isFreeShipping={isFreeShipping}
                    total={total}
                    formatPrice={formatPrice}
                    btnLabel="Continuă la plată"
                    onAction={handleContinue}
                    showArrow
                />

            </div>
        </motion.div>
    )
}

/* ══ Componentă Summary reutilizabilă ══ */
export function OrderSummary({
                                 cart, subtotal, isFreeShipping, total,
                                 formatPrice, btnLabel, onAction, showArrow,
                                 extraRow, // row suplimentar (ex: taxa ramburs)
                             }) {
    return (
        <div className={styles.summary}>
            <div className={styles.summaryHead}>Sumar comandă</div>

            {/* Produse */}
            {cart?.items?.length > 0 && (
                <div className={styles.summaryItems}>
                    {cart.items.map(item => (
                        <div key={item.id} className={styles.summaryItem}>
                            <div className={styles.summaryItemImg}>
                                {item.product.imageUrl ? (
                                    <img src={item.product.imageUrl} alt={item.product.name} />
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24"
                                         fill="none" stroke="#D1D5DB" strokeWidth="1.2">
                                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                                        <circle cx="8.5" cy="8.5" r="1.5"/>
                                        <path d="m21 15-5-5L5 21"/>
                                    </svg>
                                )}
                                <span className={styles.summaryItemBadge}>{item.quantity}</span>
                            </div>
                            <span className={styles.summaryItemName}>{item.product.name}</span>
                            <span className={styles.summaryItemPrice}>
                {formatPrice(item.subtotal)} RON
              </span>
                        </div>
                    ))}
                </div>
            )}

            <div className={styles.summaryBody}>
                <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>
            Subtotal ({cart?.totalItems || 0} produse)
          </span>
                    <span className={styles.summaryValue}>{formatPrice(subtotal)} RON</span>
                </div>
                <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Livrare</span>
                    {isFreeShipping ? (
                        <span className={styles.summaryFree}>GRATUIT</span>
                    ) : (
                        <span className={styles.summaryValue}>15 RON</span>
                    )}
                </div>

                {/* Row extra (ex: taxa ramburs) */}
                {extraRow}

                <div className={styles.summaryDivider} />

                <div className={styles.summaryTotalRow}>
                    <span className={styles.summaryTotalLabel}>Total</span>
                    <span className={styles.summaryTotalValue}>{formatPrice(total)} RON</span>
                </div>

                <button className={styles.summaryBtn} onClick={onAction}>
                    {btnLabel}
                    {showArrow && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                             stroke="white" strokeWidth="2.5" strokeLinecap="round">
                            <polyline points="9 18 15 12 9 6"/>
                        </svg>
                    )}
                </button>

                <div className={styles.summarySecure}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                         stroke="#9CA3AF" strokeWidth="2.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    Plată 100% securizată
                </div>
            </div>
        </div>
    )
}