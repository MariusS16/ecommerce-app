import { useState, useEffect } from 'react'
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

const ALL_STATUSES = Object.keys(STATUS_MAP)

const TABS = [
    { key: 'ALL',        label: 'Toate'         },
    { key: 'PENDING',    label: 'În așteptare'  },
    { key: 'CONFIRMED',  label: 'Confirmate'    },
    { key: 'PROCESSING', label: 'În procesare'  },
    { key: 'SHIPPED',    label: 'Expediate'     },
    { key: 'DELIVERED',  label: 'Livrate'       },
    { key: 'CANCELLED',  label: 'Anulate'       },
]

export default function AdminOrders() {
    const [orders,  setOrders]  = useState([])
    const [loading, setLoading] = useState(true)
    const [search,  setSearch]  = useState('')
    const [tab,     setTab]     = useState('ALL')

    useEffect(() => { fetchOrders() }, [])

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const res = await axiosInstance.get('/api/orders/all')
            const sorted = res.data.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
            setOrders(sorted)
        } catch (err) { console.error(err) }
        finally { setLoading(false) }
    }

    // ── Schimbare status ──
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axiosInstance.put(`/api/orders/${orderId}/status`, {
                status: newStatus
            })
            setOrders(prev => prev.map(o =>
                o.id === orderId ? { ...o, status: newStatus } : o
            ))
        } catch (err) {
            console.error(err)
            alert('Eroare la schimbarea statusului.')
        }
    }

    const formatPrice = (p) =>
        new Intl.NumberFormat('ro-RO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(p)

    const formatDate = (d) =>
        new Date(d).toLocaleDateString('ro-RO', {
            day: 'numeric', month: 'short', year: 'numeric'
        })

    // ── Filtrare ──
    const filtered = orders.filter(o => {
        const matchTab = tab === 'ALL' || o.status === tab
        const fullName = `${o.userFirstName || ''} ${o.userLastName || ''}`.toLowerCase()
        const matchSearch =
            o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
            o.shippingCity.toLowerCase().includes(search.toLowerCase()) ||
            fullName.includes(search.toLowerCase()) ||           // ← ADAUGĂ
            (o.userEmail || '').toLowerCase().includes(search.toLowerCase()) // ← ADAUGĂ
        return matchTab && matchSearch
    })

    return (
        <AdminLayout ordersCount={orders.filter(o => o.status === 'PENDING').length}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Comenzi</h1>
                    <p className={styles.pageSub}>{orders.length} comenzi totale</p>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                {TABS.map(t => (
                    <button
                        key={t.key}
                        className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`}
                        onClick={() => setTab(t.key)}
                    >
                        {t.label}
                        {t.key !== 'ALL' && (
                            <span style={{ marginLeft: 4, color: '#9CA3AF' }}>
                ({orders.filter(o => o.status === t.key).length})
              </span>
                        )}
                    </button>
                ))}
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>
            {tab === 'ALL' ? 'Toate comenzile' : STATUS_MAP[tab]?.label}
          </span>
                    <input
                        className={styles.searchInput}
                        placeholder="Caută după nr, client, oraș..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div style={{ padding: 20 }}>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className={styles.skeleton} style={{ height: 44, marginBottom: 8 }} />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p className={styles.emptyTitle}>Nicio comandă găsită</p>
                        <p className={styles.emptySub}>Încearcă alt filtru sau termen de căutare</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Nr. Comandă</th>
                            <th>Client</th>
                            <th>Oraș livrare</th>
                            <th>Produse</th>
                            <th>Total</th>
                            <th>Metodă plată</th>
                            <th>Data</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map(order => {
                            const s = STATUS_MAP[order.status] || { label: order.status, cls: '' }
                            return (
                                <tr key={order.id}>
                                    <td style={{ fontWeight: 600, color: '#6366F1' }}>
                                        #{order.orderNumber}
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.85rem' }}>
                                            {order.userFirstName} {order.userLastName}
                                        </div>
                                        <div style={{ fontSize: '0.60rem', color: '#9CA3AF' }}>
                                            {order.userEmail}
                                        </div>
                                    </td>
                                    <td>{order.shippingCity}</td>
                                    <td>{order.items?.length || 0} produse</td>
                                    <td>{formatPrice(order.totalPrice)} RON</td>
                                    <td>{order.paymentMethod}</td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td>
                                        {/* Dropdown schimbare status */}
                                        <select
                                            className={styles.statusSelect}
                                            value={order.status}
                                            onChange={e => handleStatusChange(order.id, e.target.value)}
                                            style={{
                                                // Culoare dinamică după status
                                                color: order.status === 'CANCELLED' ? '#991B1B' :
                                                    order.status === 'DELIVERED' ? '#065F46' :
                                                        order.status === 'PENDING'   ? '#92400E' :
                                                            '#374151'
                                            }}
                                        >
                                            {ALL_STATUSES.map(status => (
                                                <option key={status} value={status}>
                                                    {STATUS_MAP[status].label}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
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