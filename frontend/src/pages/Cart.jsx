import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import axiosInstance from '../api/axiosInstance'
import ProductCard from '../components/ui/ProductCard'
import styles from './Cart.module.css'
import visaSvg      from '../assets/payment/visa.svg'
import mastercardSvg from '../assets/payment/mastercard.svg'
import maestroSvg   from '../assets/payment/maestro.svg'

const FREE_SHIPPING_THRESHOLD = 200  // RON

export default function Cart() {
    const navigate = useNavigate()
    const { cart, cartLoading, fetchCart, updateCartItem, removeFromCart } = useCart()
    const { isLoggedIn } = useAuth()

    const [promoCode, setPromoCode] = useState('')
    const [recommended, setRecommended] = useState([])
    const [loadingRec, setLoadingRec] = useState(false)

    // Fetch coșul la mount
    useEffect(() => {
        if (isLoggedIn) {
            fetchCart()
        }
    }, [isLoggedIn])

    // Fetch produse recomandate
    useEffect(() => {
        const fetchRecommended = async () => {
            setLoadingRec(true)
            try {
                const res = await axiosInstance.get('/api/products')
                // Excludem produsele deja în coș
                const cartProductIds = cart?.items?.map(i => i.product.id) || []
                const filtered = res.data
                    .filter(p => !cartProductIds.includes(p.id) && p.isActive && p.stock > 0)
                    .slice(0, 4)
                setRecommended(filtered)
            } catch (err) {
                console.error(err)
            } finally {
                setLoadingRec(false)
            }
        }

        fetchRecommended()
    }, [cart])

    // ── Calculare livrare ──
    const subtotal = cart?.totalPrice || 0
    const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD
    const shippingCost = isFreeShipping ? 0 : 15
    const total = subtotal + shippingCost
    const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
    const amountUntilFree = FREE_SHIPPING_THRESHOLD - subtotal

    // ── Formatare preț ──
    const formatPrice = (price) =>
        new Intl.NumberFormat('ro-RO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price)

    // ── Handlers ──
    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity === 0) {
            await removeFromCart(productId)
        } else {
            await updateCartItem(productId, newQuantity)
        }
    }

    const handleRemove = async (productId) => {
        await removeFromCart(productId)
    }

    const handleCheckout = () => {
        navigate('/checkout/address')
    }

    // ── Loading ──
    if (cartLoading) {
        return (
            <div>
                <StepsBar currentStep={1} />
                <div style={{ maxWidth: 1100, margin: '24px auto', padding: '0 40px' }}>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={styles.skeleton} />
                    ))}
                </div>
            </div>
        )
    }

    // ── Coș gol ──
    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div>
                <StepsBar currentStep={1} />
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🛒</div>
                    <h2 className={styles.emptyTitle}>Coșul tău este gol</h2>
                    <p className={styles.emptySubtitle}>
                        Nu ai niciun produs în coș. Explorează catalogul nostru
                        și găsește produsele care ți se potrivesc!
                    </p>
                    <button
                        className={styles.emptyBtn}
                        onClick={() => navigate('/products')}
                    >
                        Explorează produsele
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.page}>

            {/* ── Steps ── */}
            <StepsBar currentStep={1} />

            {/* ── Header ── */}
            <div className={styles.pageHeader}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.headerTitle}>Coșul meu</h1>
                    <span className={styles.headerBadge}>
            {cart.totalItems} {cart.totalItems === 1 ? 'produs' : 'produse'}
          </span>
                </div>
                <button
                    className={styles.continueTopBtn}
                    onClick={() => navigate('/products')}
                >
                    ← Continuă cumpărăturile
                </button>
            </div>

            {/* ── Layout ── */}
            <div className={styles.layout}>

                {/* ══ Lista produse ══ */}
                <div className={styles.itemsTable}>
                    <div className={styles.tableHeader}>
                        <span>Produs</span>
                        <span>Cantitate</span>
                        <span>Subtotal</span>
                        <span></span>
                    </div>

                    <AnimatePresence>
                        {cart.items.map((item) => (
                            <motion.div
                                key={item.id}
                                className={styles.itemCard}
                                initial={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0, padding: 0 }}
                                transition={{ duration: 0.25 }}
                                layout
                            >
                                {/* Imagine + info */}
                                <div className={styles.itemLeft}>
                                    <div
                                        className={styles.itemImg}
                                        onClick={() => navigate(`/products/${item.product.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {item.product.imageUrl ? (
                                            <img src={item.product.imageUrl} alt={item.product.name} />
                                        ) : (
                                            <svg width="36" height="36" viewBox="0 0 24 24"
                                                 fill="none" stroke="#D1D5DB" strokeWidth="1.2">
                                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                                <path d="m21 15-5-5L5 21"/>
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <p className={styles.itemCategory}>
                                            {item.product.category?.name}
                                        </p>
                                        <p
                                            className={styles.itemName}
                                            onClick={() => navigate(`/products/${item.product.id}`)}
                                        >
                                            {item.product.name}
                                        </p>
                                        <p className={styles.itemUnitPrice}>
                                            {formatPrice(item.product.price)} RON / buc
                                        </p>
                                    </div>
                                </div>

                                {/* Stepper cantitate */}
                                <div className={styles.itemQty}>
                                    <div className={styles.stepper}>
                                        <button
                                            className={`${styles.stepBtn} ${styles.stepBtnLeft}`}
                                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            −
                                        </button>
                                        <span className={styles.stepVal}>{item.quantity}</span>
                                        <button
                                            className={`${styles.stepBtn} ${styles.stepBtnRight}`}
                                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                            disabled={item.quantity >= item.product.stock}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Subtotal */}
                                <div className={styles.itemSubtotal}>
                                    {formatPrice(item.subtotal)} RON
                                </div>

                                {/* Delete */}
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => handleRemove(item.product.id)}
                                    title="Șterge din coș"
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" strokeWidth="2.5"
                                         strokeLinecap="round">
                                        <polyline points="3 6 5 6 21 6"/>
                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                        <path d="M10 11v6M14 11v6"/>
                                        <path d="M9 6V4h6v2"/>
                                    </svg>
                                </button>

                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* ══ Order Summary ══ */}
                <div className={styles.summary}>
                    <div className={styles.summaryHeader}>
                        <p className={styles.summaryTitle}>Sumar comandă</p>
                    </div>

                    <div className={styles.summaryBody}>

                        {/* Progress livrare gratuită */}
                        <div className={`${styles.shippingProgress} ${!isFreeShipping && shippingProgress > 60 ? styles.shippingProgressAlmost : ''}`}>
                            <p className={`${styles.shippingText} ${!isFreeShipping && shippingProgress > 60 ? styles.shippingTextAlmost : ''}`}>
                                {isFreeShipping
                                    ? '🎉 Ai livrare gratuită la această comandă!'
                                    : `Mai adaugă ${formatPrice(amountUntilFree)} RON pentru livrare gratuită`
                                }
                            </p>
                            <div className={`${styles.progressBar} ${!isFreeShipping && shippingProgress > 60 ? styles.progressBarAlmost : ''}`}>
                                <div
                                    className={`${styles.progressFill} ${!isFreeShipping && shippingProgress > 60 ? styles.progressFillAlmost : ''}`}
                                    style={{ width: `${shippingProgress}%` }}
                                />
                            </div>
                        </div>

                        {/* Subtotal */}
                        <div className={styles.sumRow}>
              <span className={styles.sumLabel}>
                Subtotal ({cart.totalItems} produse)
              </span>
                            <span className={styles.sumValue}>{formatPrice(subtotal)} RON</span>
                        </div>

                        {/* Livrare */}
                        <div className={styles.sumRow}>
                            <span className={styles.sumLabel}>Livrare</span>
                            {isFreeShipping ? (
                                <div className={styles.shippingFreeWrap}>
                                    <span className={styles.shippingOld}>15 RON</span>
                                    <span className={styles.shippingFree}>GRATUIT</span>
                                </div>
                            ) : (
                                <span className={styles.shippingCost}>15 RON</span>
                            )}
                        </div>

                        <div className={styles.divider} />

                        {/* Total */}
                        <div className={styles.totalRow}>
                            <span className={styles.totalLabel}>Total</span>
                            <span className={styles.totalValue}>{formatPrice(total)} RON</span>
                        </div>

                        {/* Promo code */}
                        <div className={styles.promoWrap}>
                            <input
                                type="text"
                                className={styles.promoInput}
                                placeholder="Cod promoțional"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                            />
                            <button className={styles.promoBtn}>Aplică</button>
                        </div>

                        {/* Checkout */}
                        <button className={styles.checkoutBtn} onClick={handleCheckout}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                 stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                <rect x="1" y="4" width="22" height="16" rx="2"/>
                                <line x1="1" y1="10" x2="23" y2="10"/>
                            </svg>
                            Mergi la Checkout
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                 stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                <polyline points="9 18 15 12 9 6"/>
                            </svg>
                        </button>

                        {/* Continue shopping */}
                        <button
                            className={styles.continueBtn}
                            onClick={() => navigate('/products')}
                        >
                            ← Continuă cumpărăturile
                        </button>

                        {/* Secure note */}
                        <div className={styles.secureNote}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                 stroke="#9CA3AF" strokeWidth="2.5">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                            Plată 100% securizată
                        </div>

                    </div>

                    {/* Payment logos */}
                    <div className={styles.paymentSection}>
                        <p className={styles.paymentLabel}>Metode de plată acceptate</p>
                        <div className={styles.paymentLogos}>
                            <div className={styles.cardLogo}>
                                <img src={visaSvg} alt="Visa" />
                            </div>
                            <div className={styles.cardLogo}>
                                <img src={mastercardSvg} alt="Mastercard" />
                            </div>
                            <div className={styles.cardLogo}>
                                <img src={maestroSvg} alt="Maestro" />
                            </div>
                            <div className={styles.payLogo} style={{ color: '#374151', fontSize: '0.65rem' }}>Ramburs</div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ══ Produse recomandate ══ */}
            {recommended.length > 0 && (
                <div className={styles.recommended}>
                    <div className={styles.recHeader}>
                        <h2 className={styles.recTitle}>S-ar putea să îți placă și</h2>
                        <button className={styles.seeAll} onClick={() => navigate('/products')}>
                            Vezi toate →
                        </button>
                    </div>
                    <div className={styles.recGrid}>
                        {recommended.map((product, i) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.08 }}
                            >
                                <ProductCard
                                    product={product}
                                    isInWishlist={false}
                                    onWishlistToggle={() => {}}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    )
}

/* ── Componenta Steps — reutilizabilă pentru Checkout ── */
export function StepsBar({ currentStep }) {
    const steps = [
        { number: 1, label: 'Coș' },
        { number: 2, label: 'Adresă' },
        { number: 3, label: 'Plată' },
    ]

    return (
        <div className={styles.stepsBar}>
            <div className={styles.steps}>
                {steps.map((step, i) => (
                    <div key={step.number} style={{ display: 'flex', alignItems: 'center' }}>
                        <div className={styles.step}>
                            <div className={`${styles.stepCircle} ${
                                step.number < currentStep ? styles.stepCircleDone :
                                    step.number === currentStep ? styles.stepCircleActive : ''
                            }`}>
                                {step.number < currentStep ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                         stroke="white" strokeWidth="3" strokeLinecap="round">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                ) : step.number}
                            </div>
                            <span className={`${styles.stepLabel} ${step.number === currentStep ? styles.stepLabelActive : ''}`}>
                {step.label}
              </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className={`${styles.stepLine} ${step.number < currentStep ? styles.stepLineDone : ''}`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}