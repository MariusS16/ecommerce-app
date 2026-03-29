import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import styles from './AccountLayout.module.css'
import { useWishlist } from '../../hooks/useWishlist'

export default function AccountLayout({ children }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, logout } = useAuth()
    const { wishlistCount } = useWishlist()

    const isActive = (path) => location.pathname.startsWith(path)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    // Inițialele userului pentru avatar
    const initials = user
        ? `${user.email?.[0] || ''}${user.email?.[1] || ''}`.toUpperCase()
        : 'U'

    const navItems = [
        {
            label: 'Contul meu',
            path: '/account',
            exact: true,
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
            ),
        },
        {
            label: 'Comenzile mele',
            path: '/orders',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
            ),
        },
        {
            label: 'Wishlist',
            path: '/wishlist',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            ),
        },
    ]

    return (
        <div className={styles.page}>
            <div className={styles.layout}>

                {/* ── Sidebar ── */}
                <aside className={styles.sidebar}>

                    {/* User info */}
                    <div className={styles.sidebarUser}>
                        <div className={styles.avatar}>{initials}</div>
                        <div>
                            <p className={styles.userName}>
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className={styles.userEmail}>{user?.email}</p>
                        </div>
                    </div>

                    {/* Navigare */}
                    <nav className={styles.nav}>
                        {navItems.map(item => (
                            <button
                                key={item.path}
                                className={`${styles.navItem} ${
                                    item.exact
                                        ? location.pathname === item.path ? styles.navItemActive : ''
                                        : isActive(item.path) ? styles.navItemActive : ''
                                }`}
                                onClick={() => navigate(item.path)}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}

                        <div className={styles.navDivider} />

                        <button
                            className={`${styles.navItem} ${styles.navItemDanger}`}
                            onClick={handleLogout}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                <polyline points="16 17 21 12 16 7"/>
                                <line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                            Deconectare
                        </button>
                    </nav>
                </aside>

                {/* ── Conținut principal ── */}
                <main className={styles.main}>
                    {children}
                </main>

            </div>
        </div>
    )
}