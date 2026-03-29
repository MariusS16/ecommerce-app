import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import axiosInstance from '../api/axiosInstance'
import { StepsBar } from './Cart'
import { OrderSummary } from './CheckoutAddress'
import styles from './CheckoutPayment.module.css'
import addrStyles from './CheckoutAddress.module.css'
import visaSvg      from '../assets/payment/visa.svg'
import mastercardSvg from '../assets/payment/mastercard.svg'
import maestroSvg   from '../assets/payment/maestro.svg'

const pageVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: -40 },
}

const CASH_FEE = 5  // taxa ramburs

export default function CheckoutPayment() {
    const navigate = useNavigate()
    const { cart, fetchCart } = useCart()
    const { user } = useAuth()

    // Citim adresa salvată în sessionStorage
    const savedAddress = JSON.parse(
        sessionStorage.getItem('checkoutAddress') || '{}'
    )

    const [paymentMethod, setPaymentMethod] = useState('card')
    // 'card' sau 'cash'

    const [cardForm, setCardForm] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        cardHolder: '',
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const formatPrice = (price) =>
        new Intl.NumberFormat('ro-RO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price)

    const subtotal = cart?.totalPrice || 0
    const isFreeShipping = subtotal >= 200
    const shippingCost = isFreeShipping ? 0 : 15
    const cashFee = paymentMethod === 'cash' ? CASH_FEE : 0
    const total = subtotal + shippingCost + cashFee

    // ── Formatare număr card (xxxx xxxx xxxx xxxx) ──
    const handleCardNumberChange = (e) => {
        const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
        const formatted = raw.replace(/(.{4})/g, '$1 ').trim()
        setCardForm(prev => ({ ...prev, cardNumber: formatted }))
    }

    // ── Formatare expiry (MM/AA) ──
    const handleExpiryChange = (e) => {
        const raw = e.target.value.replace(/\D/g, '').slice(0, 4)
        const formatted = raw.length > 2
            ? `${raw.slice(0, 2)}/${raw.slice(2)}`
            : raw
        setCardForm(prev => ({ ...prev, expiry: formatted }))
    }

    // ── Detectare brand card ──
    const getCardBrand = (number) => {
        const raw = number.replace(/\s/g, '')
        if (raw.startsWith('4')) return 'VISA'
        if (/^5[1-5]/.test(raw)) return 'MC'
        if (raw.startsWith('6')) return 'Maestro'
        return 'CARD'
    }

    // ── Plasare comandă ──
    const handlePlaceOrder = async () => {
        if (!savedAddress.firstName) {
            navigate('/checkout/address')
            return
        }

        if (paymentMethod === 'card') {
            const rawNumber = cardForm.cardNumber.replace(/\s/g, '')
            if (rawNumber.length < 16) {
                setError('Numărul cardului este incomplet')
                return
            }
            if (cardForm.expiry.length < 5) {
                setError('Data expirării este incompletă')
                return
            }
            if (cardForm.cvv.length < 3) {
                setError('CVV-ul este incomplet')
                return
            }
            if (!cardForm.cardHolder.trim()) {
                setError('Numele titularului este obligatoriu')
                return
            }
        }

        setLoading(true)
        setError('')

        try {
            const shippingAddress = `${savedAddress.address}, ${savedAddress.city}`

            const orderData = {
                shippingAddress,
                shippingCity:       savedAddress.city,
                shippingPostalCode: savedAddress.postalCode,
                shippingCountry:    'Romania',
                paymentMethod:      paymentMethod === 'card' ? 'Card bancar' : 'Ramburs',
                notes: savedAddress.notes || null,
            }

            const response = await axiosInstance.post('/api/orders', orderData)

            // salvează numărul comenzii pentru pagina de succes
            sessionStorage.setItem('lastOrderNumber', response.data.orderNumber)

            // Curăță sessionStorage după comandă reușită
            sessionStorage.removeItem('checkoutAddress')

            // Refresh coș
            await fetchCart()

            // Navighează la pagina de succes
            navigate('/order-success')

        } catch (err) {
            console.error(err)
            setError('A apărut o eroare. Te rugăm să încerci din nou.')
        } finally {
            setLoading(false)
        }
    }

    const displayCardNumber = cardForm.cardNumber || '•••• •••• •••• ••••'
    const displayExpiry     = cardForm.expiry     || 'MM/AA'
    const displayHolder     = cardForm.cardHolder  || 'NUMELE TĂU'
    const cardBrand         = getCardBrand(cardForm.cardNumber)

    return (
        <motion.div
            className={styles.page}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
            <StepsBar currentStep={3} />

            <div className={styles.layout}>

                {/* ── Formular plată ── */}
                <div className={styles.formCard}>
                    <h1 className={styles.formTitle}>Metoda de plată</h1>
                    <p className={styles.formSubtitle}>
                        Alege cum vrei să plătești comanda
                    </p>

                    {/* Confirmare adresă */}
                    {savedAddress.firstName && (
                        <div className={styles.addressBox}>
                            <div>
                                <p className={styles.addressBoxLabel}>Livrare la</p>
                                <p className={styles.addressBoxValue}>
                                    {savedAddress.firstName} {savedAddress.lastName} ·{' '}
                                    {savedAddress.address}, {savedAddress.city}
                                </p>
                            </div>
                            <button
                                className={styles.addressEditBtn}
                                onClick={() => navigate('/checkout/address')}
                            >
                                Modifică
                            </button>
                        </div>
                    )}

                    {/* ── Card bancar ── */}
                    <div className={`${styles.methodCard} ${paymentMethod === 'card' ? styles.methodCardSelected : ''}`}>
                        <div
                            className={styles.methodHeader}
                            onClick={() => setPaymentMethod('card')}
                        >
                            <div className={`${styles.radio} ${paymentMethod === 'card' ? styles.radioActive : ''}`}>
                                {paymentMethod === 'card' && <div className={styles.radioDot} />}
                            </div>
                            <span className={styles.methodName}>Card bancar</span>
                            <div className={styles.cardLogos}>
                                <div className={styles.cardLogo}>
                                    <img src={visaSvg} alt="Visa" />
                                </div>
                                <div className={styles.cardLogo}>
                                    <img src={mastercardSvg} alt="Mastercard" />
                                </div>
                                <div className={styles.cardLogo}>
                                    <img src={maestroSvg} alt="Maestro" />
                                </div>
                            </div>
                        </div>

                        {paymentMethod === 'card' && (
                            <motion.div
                                className={styles.cardFormInner}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.25 }}
                            >
                                {/* ── Card vizual ── */}
                                <div className={styles.creditCard}>
                                    <div className={styles.cardCircle1} />
                                    <div className={styles.cardCircle2} />

                                    <div className={styles.cardTop}>
                                        {/* Chip auriu */}
                                        <div className={styles.chip}>
                                            {[...Array(9)].map((_, i) => (
                                                <div key={i} className={styles.chipCell} />
                                            ))}
                                        </div>
                                        <div className={styles.cardBrand}>{cardBrand}</div>
                                    </div>

                                    <div className={styles.cardNumber}>{displayCardNumber}</div>

                                    <div className={styles.cardBottom}>
                                        <div className={styles.cardField}>
                                            <div className={styles.cardFieldLabel}>Titular</div>
                                            <div className={styles.cardFieldValue}>
                                                {displayHolder.toUpperCase()}
                                            </div>
                                        </div>
                                        <div className={styles.cardField}>
                                            <div className={styles.cardFieldLabel}>Expiră</div>
                                            <div className={styles.cardFieldValue}>{displayExpiry}</div>
                                        </div>
                                        <div className={styles.cardField}>
                                            <div className={styles.cardFieldLabel}>CVV</div>
                                            <div className={styles.cardFieldValue}>
                                                {cardForm.cvv ? '•'.repeat(cardForm.cvv.length) : '•••'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Câmpuri formular card */}
                                <div className={styles.field}>
                                    <label className={styles.label}>Număr card *</label>
                                    <input
                                        className={styles.input}
                                        placeholder="1234 5678 9012 3456"
                                        value={cardForm.cardNumber}
                                        onChange={handleCardNumberChange}
                                        maxLength={19}
                                    />
                                </div>

                                <div className={styles.cardRow}>
                                    <div>
                                        <label className={styles.label}>Data expirării *</label>
                                        <input
                                            className={styles.input}
                                            placeholder="MM/AA"
                                            value={cardForm.expiry}
                                            onChange={handleExpiryChange}
                                            maxLength={5}
                                        />
                                    </div>
                                    <div>
                                        <label className={styles.label}>CVV *</label>
                                        <input
                                            className={styles.input}
                                            type="password"
                                            placeholder="•••"
                                            value={cardForm.cvv}
                                            onChange={e => setCardForm(prev => ({
                                                ...prev,
                                                cvv: e.target.value.replace(/\D/g, '').slice(0, 3)
                                            }))}
                                            maxLength={3}
                                        />
                                    </div>
                                </div>

                                <div className={styles.field}>
                                    <label className={styles.label}>Nume titular *</label>
                                    <input
                                        className={styles.input}
                                        placeholder="MARIUS IONESCU"
                                        value={cardForm.cardHolder}
                                        maxLength={20}
                                        onChange={e => setCardForm(prev => ({
                                            ...prev,
                                            cardHolder: e.target.value
                                        }))}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* ── Ramburs ── */}
                    <div className={`${styles.methodCard} ${paymentMethod === 'cash' ? styles.methodCardSelected : ''}`}>
                        <div
                            className={styles.methodHeader}
                            onClick={() => setPaymentMethod('cash')}
                        >
                            <div className={`${styles.radio} ${paymentMethod === 'cash' ? styles.radioActive : ''}`}>
                                {paymentMethod === 'cash' && <div className={styles.radioDot} />}
                            </div>
                            <span style={{ fontSize: '1.1rem' }}>💵</span>
                            <span className={styles.methodName}>Ramburs la livrare</span>
                            <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginLeft: 'auto' }}>
                +{CASH_FEE} RON
              </span>
                        </div>
                    </div>

                    {paymentMethod === 'cash' && (
                        <motion.div
                            className={styles.cashInfo}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                            Plătești cash la primirea coletului. Se adaugă {CASH_FEE} RON taxă ramburs.
                        </motion.div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div style={{
                            padding: '10px 14px', background: '#FEF2F2',
                            border: '1px solid #FECACA', borderRadius: '8px',
                            color: '#DC2626', fontSize: '0.8rem', marginTop: '12px'
                        }}>
                            {error}
                        </div>
                    )}
                </div>

                {/* ── Order Summary ── */}
                <OrderSummary
                    cart={cart}
                    subtotal={subtotal}
                    isFreeShipping={isFreeShipping}
                    total={total}
                    formatPrice={formatPrice}
                    btnLabel={loading ? 'Se procesează...' : 'Plasează comanda'}
                    onAction={handlePlaceOrder}
                    showArrow={!loading}
                    extraRow={
                        paymentMethod === 'cash' ? (
                            <div className={styles.rambursRow}>
                                <span className={styles.rambursLabel}>Taxă ramburs</span>
                                <span className={styles.rambursValue}>+{CASH_FEE} RON</span>
                            </div>
                        ) : null
                    }
                />

            </div>
        </motion.div>
    )
}