import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import AdminLayout from '../../components/layout/AdminLayout'
import styles from './Admin.module.css'

const STATUS_MAP = {
    PENDING:    { label: 'În așteptare', cls: styles.badgePending    },
    CONFIRMED:  { label: 'Confirmată',   cls: styles.badgeConfirmed  },
    PROCESSING: { label: 'În procesare', cls: styles.badgeProcessing },
    SHIPPED:    { label: 'Expediat',     cls: styles.badgeShipped    },
    DELIVERED:  { label: 'Livrat',       cls: styles.badgeDelivered  },
    CANCELLED:  { label: 'Anulată',      cls: styles.badgeCancelled  },
}

export default function AdminDashboard() {
    const navigate = useNavigate()
    const [stats, setStats] = useState({
        products: 0, orders: 0, revenue: 0, pendingOrders: 0, users: 0
    })
    const [recentOrders, setRecentOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, ordersRes, usersRes] = await Promise.all([
                    axiosInstance.get('/api/products'),
                    axiosInstance.get('/api/orders/all'),
                    axiosInstance.get('/api/users/count'),
                ])

                const products = productsRes.data
                const orders   = ordersRes.data
                const usersCount = usersRes.data.count

                const revenue = orders
                    .filter(o => o.status !== 'CANCELLED')
                    .reduce((sum, o) => sum + Number(o.totalPrice), 0)

                const pending = orders.filter(o => o.status === 'PENDING').length

                setStats({
                    products: products.filter(p => p.isActive).length,
                    orders:   orders.length,
                    revenue:  revenue,
                    pendingOrders: pending,
                    users:         usersCount,
                })

                // Ultimele 5 comenzi
                const sorted = [...orders].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                )
                setRecentOrders(sorted.slice(0, 5))
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const formatPrice = (p) =>
        new Intl.NumberFormat('ro-RO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(p)

    const formatDate = (d) =>
        new Date(d).toLocaleDateString('ro-RO', {
            day: 'numeric', month: 'short', year: 'numeric'
        })

    return (
        <AdminLayout ordersCount={stats.pendingOrders}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Dashboard</h1>
                    <p className={styles.pageSub}>Bun venit! Iată statisticile platformei.</p>
                </div>
            </div>

            {/* ── Stats ── */}
            <div className={styles.statsGrid}>
                {/* Produse active */}
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#EEF2FF' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                             stroke="#6366F1" strokeWidth="2" strokeLinecap="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        </svg>
                    </div>
                    <div className={styles.statValue}>
                        {loading ? '—' : stats.products}
                    </div>
                    <div className={styles.statLabel}>Produse active</div>
                    <div className={styles.statTrend}>în catalog</div>
                </div>

                {/* Comenzi */}
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#F0FDF4' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                             stroke="#10B981" strokeWidth="2" strokeLinecap="round">
                            <circle cx="8" cy="21" r="1"/>
                            <circle cx="19" cy="21" r="1"/>
                            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                        </svg>
                    </div>
                    <div className={styles.statValue}>
                        {loading ? '—' : stats.orders}
                    </div>
                    <div className={styles.statLabel}>Comenzi totale</div>
                    <div className={styles.statTrend}>
                        {loading ? '' : `${stats.pendingOrders} în așteptare`}
                    </div>
                </div>

                {/* Venituri */}
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#FFFBEB' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                             stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
                            <line x1="12" y1="1" x2="12" y2="23"/>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                    </div>
                    <div className={styles.statValue}>
                        {loading ? '—' : `${formatPrice(stats.revenue)}`}
                    </div>
                    <div className={styles.statLabel}>Venituri totale (RON)</div>
                    <div className={styles.statTrend}>comenzi finalizate</div>
                </div>

                {/* În așteptare */}
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#FEF3C7' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                             stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                    </div>
                    <div className={styles.statValue}>
                        {loading ? '—' : stats.pendingOrders}
                    </div>
                    <div className={styles.statLabel}>Comenzi în așteptare</div>
                    <div className={styles.statTrend}>necesită procesare</div>
                </div>

                {/* Total utilizatori */}
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#F0FDF4' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                             stroke="#10B981" strokeWidth="2" strokeLinecap="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                    </div>
                    <div className={styles.statValue}>
                        {loading ? '—' : stats.users}
                    </div>
                    <div className={styles.statLabel}>Utilizatori înregistrați</div>
                    <div className={styles.statTrend}>conturi active</div>
                </div>

            </div>

            {/* ── Comenzi recente ── */}
            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <span className={styles.tableTitle}>Comenzi recente</span>
                    <button
                        className={styles.btnOutline}
                        onClick={() => navigate('/admin/orders')}
                    >
                        Vezi toate →
                    </button>
                </div>

                {loading ? (
                    <div style={{ padding: '20px' }}>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className={styles.skeleton}
                                 style={{ height: 40, marginBottom: 8 }} />
                        ))}
                    </div>
                ) : recentOrders.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p className={styles.emptyTitle}>Nicio comandă</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Nr. Comandă</th>
                            <th>Oras</th>
                            <th>Total</th>
                            <th>Metodă plată</th>
                            <th>Status</th>
                            <th>Data</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentOrders.map(order => {
                            const s = STATUS_MAP[order.status] || { label: order.status, cls: '' }
                            return (
                                <tr
                                    key={order.id}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate('/admin/orders')}
                                >
                                    <td style={{ fontWeight: 600, color: '#6366F1' }}>
                                        #{order.orderNumber}
                                    </td>
                                    <td>{order.shippingCity}</td>
                                    <td>{formatPrice(order.totalPrice)} RON</td>
                                    <td>{order.paymentMethod}</td>
                                    <td>
                      <span className={`${styles.badge} ${s.cls}`}>
                        {s.label}
                      </span>
                                    </td>
                                    <td>{formatDate(order.createdAt)}</td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                )}
            </div>
        </AdminLayout>
    )
}