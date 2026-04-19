import { useNavigate, useLocation } from 'react-router-dom'
import styles from './AdminLayout.module.css'

const NAV_ITEMS = [
    {
        label: 'Dashboard',
        path: '/admin',
        exact: true,
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
            </svg>
        ),
    },
    {
        label: 'Produse',
        path: '/admin/products',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
        ),
    },
    {
        label: 'Categorii',
        path: '/admin/categories',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
        ),
    },
    {
        label: 'Furnizori',
        path: '/admin/suppliers',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
        ),
    },
    {
        label: 'Comenzi',
        path: '/admin/orders',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="8" cy="21" r="1"/>
                <circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
        ),
    },
]

export default function AdminLayout({ children, ordersCount }) {
    const navigate = useNavigate()
    const location = useLocation()

    const isActive = (item) =>
        item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path)

    return (
        <div className={styles.layout}>

            {/* ── Sidebar ── */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.sidebarTitle}>Admin Panel</div>
                    <div className={styles.sidebarSub}>TrustCart</div>
                </div>

                <nav className={styles.nav}>
                    {NAV_ITEMS.map(item => (
                        <button
                            key={item.path}
                            className={`${styles.navItem} ${isActive(item) ? styles.navItemActive : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            {item.icon}
                            {item.label}
                            {item.label === 'Comenzi' && ordersCount > 0 && (
                                <span className={styles.navBadge}>{ordersCount}</span>
                            )}
                        </button>
                    ))}

                    <div className={styles.navDivider} />

                    <button
                        className={styles.navItem}
                        onClick={() => navigate('/')}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                            <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                        Înapoi la site
                    </button>
                </nav>
            </aside>

            {/* ── Main content ── */}
            <main className={styles.main}>
                {children}
            </main>

        </div>
    )
}