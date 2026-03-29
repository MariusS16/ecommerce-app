import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axiosInstance from '../api/axiosInstance'
import AccountLayout from '../components/layout/AccountLayout'
import styles from './OrderDetail.module.css'

const STATUS_MAP = {
    PENDING:    { label: 'În așteptare', cls: styles.pending    },
    CONFIRMED:  { label: 'Confirmată',   cls: styles.confirmed  },
    PROCESSING: { label: 'În procesare', cls: styles.processing },
    SHIPPED:    { label: 'Expediat',     cls: styles.shipped    },
    DELIVERED:  { label: 'Livrat',       cls: styles.delivered  },
    CANCELLED:  { label: 'Anulată',      cls: styles.cancelled  },
}

// Pașii din progress bar — ordinea statusurilor
const PROGRESS_STEPS = [
    { key: 'PENDING',   label: 'Plasată'   },
    { key: 'CONFIRMED', label: 'Confirmată'},
    { key: 'SHIPPED',   label: 'Expediată' },
    { key: 'DELIVERED', label: 'Livrată'   },
]

const STATUS_ORDER = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']

export default function OrderDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [order, setOrder]   = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError]   = useState(false)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axiosInstance.get(`/api/orders/${id}`)
                setOrder(res.data)
            } catch (err) {
                console.error(err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        fetchOrder()
    }, [id])

    const handleCancel = async () => {
        if (!window.confirm('Ești sigur că vrei să anulezi comanda?')) return
        try {
            const res = await axiosInstance.put(`/api/orders/${id}/cancel`)
            setOrder(res.data)
        } catch (err) {
            alert('Nu s-a putut anula comanda.')
        }
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return ''
        return new Date(dateStr).toLocaleDateString('ro-RO', {
            day: 'numeric', month: 'long', year: 'numeric',
        })
    }

    const formatPrice = (price) =>
        new Intl.NumberFormat('ro-RO', {
            minimumFractionDigits: 0, maximumFractionDigits: 2,
        }).format(price)

    // Calculăm indexul statusului curent pentru progress bar
    const currentStatusIndex = STATUS_ORDER.indexOf(order?.status)

    const getStepStatus = (stepKey) => {
        if (order?.status === 'CANCELLED') return 'idle'
        const stepIndex = STATUS_ORDER.indexOf(stepKey)
        if (stepIndex < currentStatusIndex) return 'done'
        if (stepIndex === currentStatusIndex) return 'active'
        return 'idle'
    }

    const subtotal = order?.totalPrice || 0
    const isFreeShipping = subtotal >= 200
    const shippingCost = isFreeShipping ? 0 : 15
    const isRamburs = order?.paymentMethod === 'Ramburs'
    const rambursFee = isRamburs ? 5 : 0
    const actualTotal = subtotal + shippingCost + rambursFee

    if (loading) {
        return (
            <AccountLayout>
                <div className={styles.skeletonHeader} />
                <div className={styles.skeletonHeader} style={{ height: 200 }} />
            </AccountLayout>
        )
    }

    if (error || !order) {
        return (
            <AccountLayout>
                <button className={styles.backBtn} onClick={() => navigate('/orders')}>
                    ← Înapoi la comenzi
                </button>
                <p style={{ color: '#6B7280' }}>Comanda nu a fost găsită.</p>
            </AccountLayout>
        )
    }

    const statusInfo = STATUS_MAP[order.status] || { label: order.status, cls: '' }

    return (
        <AccountLayout>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <button className={styles.backBtn} onClick={() => navigate('/orders')}>
                    ← Înapoi la comenzi
                </button>

                {/* ── Header card ── */}
                <div className={styles.headerCard}>
                    <div className={styles.headerTop}>
                        <div>
                            <h1 className={styles.orderNum}>#{order.orderNumber}</h1>
                            <div className={styles.orderMeta}>
                                <div className={styles.orderMetaItem}>
                                    📅 <strong>{formatDate(order.createdAt)}</strong>
                                </div>
                                <div className={styles.orderMetaItem}>
                                    💳 <strong>{order.paymentMethod}</strong>
                                </div>
                            </div>
                        </div>
                        <span className={`${styles.badge} ${statusInfo.cls}`}>
              <span className={styles.badgeDot} />
                            {statusInfo.label}
            </span>
                    </div>

                    {/* Progress bar — nu apare pentru comenzile anulate */}
                    {order.status !== 'CANCELLED' && (
                        <div className={styles.progressBar}>
                            {PROGRESS_STEPS.map((step, i) => {
                                const status = getStepStatus(step.key)
                                return (
                                    <div key={step.key} style={{ display: 'flex', alignItems: 'center', flex: i < PROGRESS_STEPS.length - 1 ? 1 : 'unset' }}>
                                        <div className={styles.progressStep}>
                                            <div className={`${styles.progressCircle} ${
                                                status === 'done'   ? styles.progressDone   :
                                                    status === 'active' ? styles.progressActive :
                                                        styles.progressIdle
                                            }`}>
                                                {status === 'done' ? (
                                                    <svg width="11" height="11" viewBox="0 0 24 24"
                                                         fill="none" stroke="white" strokeWidth="3.5"
                                                         strokeLinecap="round">
                                                        <polyline points="20 6 9 17 4 12"/>
                                                    </svg>
                                                ) : (
                                                    <svg width="7" height="7" viewBox="0 0 24 24"
                                                         fill={status === 'active' ? 'white' : '#D1D5DB'}>
                                                        <circle cx="12" cy="12" r="6"/>
                                                    </svg>
                                                )}
                                            </div>
                                            <span className={`${styles.progressLabel} ${
                                                status === 'done'   ? styles.progressLabelDone   :
                                                    status === 'active' ? styles.progressLabelActive :
                                                        styles.progressLabelIdle
                                            }`}>
                        {step.label}
                      </span>
                                        </div>

                                        {i < PROGRESS_STEPS.length - 1 && (
                                            <div className={`${styles.progressLine} ${
                                                status === 'done' ? styles.progressLineDone : ''
                                            }`} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* ── Info grid: adresă, plată, livrare ── */}
                <div className={styles.infoGrid}>
                    <div className={styles.infoBox}>
                        <p className={styles.infoBoxLabel}>📦 Adresă livrare</p>
                        <p className={styles.infoBoxValue}>
                            {order.shippingAddress}<br/>
                            {order.shippingCity}, {order.shippingPostalCode}<br/>
                            {order.shippingCountry}
                        </p>
                    </div>
                    <div className={styles.infoBox}>
                        <p className={styles.infoBoxLabel}>💳 Metodă plată</p>
                        <p className={styles.infoBoxValue}>
                            {order.paymentMethod}<br/>
                            <span style={{ color: '#10B981', fontSize: '0.75rem', fontWeight: 700 }}>
                ✓ Plată acceptată
              </span>
                        </p>
                    </div>
                    <div className={styles.infoBox}>
                        <p className={styles.infoBoxLabel}>🚚 Livrare</p>
                        <p className={styles.infoBoxValue}>
                            Curier standard<br/>
                            <span style={{ color: '#10B981', fontSize: '0.75rem', fontWeight: 700 }}>
                {isFreeShipping ? 'GRATUIT' : '15 RON'}
              </span>
                        </p>
                    </div>
                </div>

                {/* ── Grid principal ── */}
                <div className={styles.mainGrid}>

                    {/* Produse */}
                    <div className={styles.card}>
                        <div className={styles.cardHead}>
                            <span className={styles.cardTitle}>Produse comandate</span>
                            <span className={styles.cardSub}>
                {order.items?.length || 0} produse
              </span>
                        </div>
                        <div className={styles.cardBody}>
                            {order.items?.map(item => (
                                <div key={item.id} className={styles.item}>
                                    <div
                                        className={styles.itemImg}
                                        onClick={() => navigate(`/products/${item.product?.id}`)}
                                    >
                                        {item.product?.imageUrl ? (
                                            <img src={item.product.imageUrl} alt={item.product.name} />
                                        ) : (
                                            <svg width="26" height="26" viewBox="0 0 24 24"
                                                 fill="none" stroke="#D1D5DB" strokeWidth="1.2">
                                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                                <path d="m21 15-5-5L5 21"/>
                                            </svg>
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p
                                            className={styles.itemName}
                                            onClick={() => navigate(`/products/${item.product?.id}`)}
                                        >
                                            {item.product?.name}
                                        </p>
                                        <p className={styles.itemQty}>
                                            x{item.quantity} · {formatPrice(item.priceAtPurchase)} RON/buc
                                        </p>
                                    </div>
                                    <p className={styles.itemPrice}>
                                        {formatPrice(item.subtotal)} RON
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className={styles.sumCard}>
                        <div className={styles.sumHead}>Sumar plată</div>
                        <div className={styles.sumBody}>
                            <div className={styles.sumRow}>
                                <span className={styles.sumLbl}>Subtotal</span>
                                <span className={styles.sumVal}>{formatPrice(order.totalPrice)} RON</span>
                            </div>
                            <div className={styles.sumRow}>
                                <span className={styles.sumLbl}>Livrare</span>
                                <span className={`${styles.sumVal} ${styles.sumFree}`}>
                  {isFreeShipping ? 'GRATUIT' : '15 RON'}
                </span>
                            </div>

                            {isRamburs && (
                                <div className={styles.sumRow}>
                                    <span className={styles.sumLbl}>Taxă ramburs</span>
                                    <span className={styles.sumVal} style={{ color: '#F59E0B' }}>+5 RON</span>
                                </div>
                            )}

                            <div className={styles.sumDivider} />
                            <div className={styles.sumTotal}>
                                <span className={styles.sumTotalLbl}>Total plătit</span>
                                <span className={styles.sumTotalVal}>
                  {formatPrice(actualTotal)} RON
                </span>
                            </div>

                            {order.status === 'PENDING' && (
                                <button className={styles.cancelBtn} onClick={handleCancel}>
                                    ✕ Anulează comanda
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </motion.div>
        </AccountLayout>
    )
}