import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axiosInstance from '../api/axiosInstance'
import AccountLayout from '../components/layout/AccountLayout'
import styles from './Orders.module.css'

// Mapare status backend → label română + clasă CSS
const STATUS_MAP = {
    PENDING:    { label: 'În așteptare', cls: styles.pending    },
    CONFIRMED:  { label: 'Confirmată',   cls: styles.confirmed  },
    PROCESSING: { label: 'În procesare', cls: styles.processing },
    SHIPPED:    { label: 'Expediat',     cls: styles.shipped    },
    DELIVERED:  { label: 'Livrat',       cls: styles.delivered  },
    CANCELLED:  { label: 'Anulată',      cls: styles.cancelled  },
}

const CANCELLABLE = ['PENDING']
// Doar comenzile PENDING pot fi anulate de user

export default function Orders() {
    const navigate = useNavigate()
    const [orders, setOrders]   = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axiosInstance.get('/api/orders')
                // Sortăm descrescător — cele mai recente primele
                const sorted = res.data.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                )
                setOrders(sorted)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    const handleCancel = async (e, orderId) => {
        // e.stopPropagation() — oprește propagarea click-ului
        // fără asta, click-ul pe "Anulează" ar naviga și la detalii
        e.stopPropagation()

        if (!window.confirm('Ești sigur că vrei să anulezi comanda?')) return

        try {
            await axiosInstance.put(`/api/orders/${orderId}/cancel`)
            // Actualizăm local — nu re-fetăm toată lista
            setOrders(prev => prev.map(o =>
                o.id === orderId ? { ...o, status: 'CANCELLED' } : o
            ))
        } catch (err) {
            console.error(err)
            alert('Nu s-a putut anula comanda.')
        }
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return ''
        return new Date(dateStr).toLocaleDateString('ro-RO', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
    }

    const formatPrice = (price) =>
        new Intl.NumberFormat('ro-RO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price)

    return (
        <AccountLayout>
            <div>
                {/* Header */}
                <div className={styles.sectionHeader || ''}>
                    <div>
                        <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>
                            Comenzile mele
                        </h1>
                        {!loading && (
                            <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: 3 }}>
                                {orders.length} {orders.length === 1 ? 'comandă' : 'comenzi'} plasate
                            </p>
                        )}
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className={styles.skeleton} />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && orders.length === 0 && (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📦</div>
                        <h2 className={styles.emptyTitle}>Nicio comandă încă</h2>
                        <p className={styles.emptySubtitle}>
                            Nu ai plasat nicio comandă. Explorează catalogul nostru!
                        </p>
                        <button
                            className={styles.emptyBtn}
                            onClick={() => navigate('/products')}
                        >
                            Explorează produsele
                        </button>
                    </div>
                )}

                {/* Lista comenzi */}
                <AnimatePresence>
                    {orders.map((order, i) => {
                        const statusInfo = STATUS_MAP[order.status] || { label: order.status, cls: '' }
                        const isCancelled = order.status === 'CANCELLED'
                        const canCancel = CANCELLABLE.includes(order.status)
                        // Primele 3 thumbnails + număr dacă sunt mai multe
                        const visibleItems = order.items?.slice(0, 3) || []
                        const extraCount = (order.items?.length || 0) - visibleItems.length

                        return (
                            <motion.div
                                key={order.id}
                                className={`${styles.orderCard} ${isCancelled ? styles.orderCardCancelled : ''}`}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.06 }}
                                onClick={() => navigate(`/orders/${order.id}`)}
                            >
                                {/* ── Rândul de sus ── */}
                                <div className={styles.orderTop}>
                                    <div>
                                        <p className={styles.orderNum}>#{order.orderNumber}</p>
                                        <div className={styles.orderMeta}>
                                            <span>📅 {formatDate(order.createdAt)}</span>
                                            <span>💳 {order.paymentMethod}</span>
                                        </div>
                                    </div>
                                    <div className={styles.orderRight}>
                    <span className={`${styles.badge} ${statusInfo.cls}`}>
                      <span className={styles.badgeDot} />
                        {statusInfo.label}
                    </span>
                                        <p className={`${styles.orderTotal} ${isCancelled ? styles.orderTotalCancelled : ''}`}>
                                            {formatPrice(order.totalPrice)} RON
                                        </p>
                                    </div>
                                </div>

                                {/* ── Rândul de jos — thumbnails + acțiuni ── */}
                                <div className={styles.orderBottom}>
                                    {/* Thumbnails produse */}
                                    <div className={styles.orderThumbs}>
                                        {visibleItems.map(item => (
                                            <div key={item.id} className={styles.thumb}>
                                                {item.product?.imageUrl ? (
                                                    <img src={item.product.imageUrl} alt={item.product.name} />
                                                ) : (
                                                    <svg width="20" height="20" viewBox="0 0 24 24"
                                                         fill="none" stroke="#D1D5DB" strokeWidth="1.2">
                                                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                                                        <circle cx="8.5" cy="8.5" r="1.5"/>
                                                        <path d="m21 15-5-5L5 21"/>
                                                    </svg>
                                                )}
                                            </div>
                                        ))}
                                        {extraCount > 0 && (
                                            <div className={styles.thumbMore}>+{extraCount}</div>
                                        )}
                                    </div>

                                    {/* Acțiuni */}
                                    <div className={styles.orderActions}>
                                        {canCancel && (
                                            <button
                                                className={styles.btnCancel}
                                                onClick={(e) => handleCancel(e, order.id)}
                                            >
                                                Anulează
                                            </button>
                                        )}
                                        <button
                                            className={styles.btnDetails}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                navigate(`/orders/${order.id}`)
                                            }}
                                        >
                                            Detalii →
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>
        </AccountLayout>
    )
}