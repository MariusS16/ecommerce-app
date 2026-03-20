import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import styles from './Navbar.module.css'

export default function Navbar() {
    const navigate = useNavigate()
    const { isLoggedIn, isAdmin, user, logout } = useAuth()
    const { cartCount } = useCart()

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    // Referință la dropdown — pentru a-l închide când dai click în afara lui
    // useRef = referință directă la un element DOM, fără re-render
    // Echivalent Vue: ref="dropdownRef" pe element
    const dropdownRef = useRef(null)

    // Închide dropdown-ul când dai click oriunde în afara lui
    useEffect(() => {
        function handleClickOutside(event) {
            // dropdownRef.current = elementul DOM al dropdown-ului
            // .contains(event.target) = verifică dacă click-ul a fost înăuntrul lui
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false)
            }
        }

        // Adaugă listener pe întregul document
        document.addEventListener('mousedown', handleClickOutside)

        // Cleanup — șterge listener-ul când componenta dispare din pagină
        // Echivalent Vue: onUnmounted(() => { ... })
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])
    // [] = efectul rulează doar la mount/unmount, nu la fiecare render

    // Când user apasă Enter în search
    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`)
            setSearchTerm('')
        }
    }

    const handleLogout = () => {
        logout()
        setDropdownOpen(false)
        navigate('/')
    }

    // Generează inițialele pentru avatar (ex: "marius@gmail.com" → "MA")
    const getInitials = (email) => {
        if (!email) return '?'
        const name = email.split('@')[0]       // "marius"
        return name.slice(0, 2).toUpperCase() // "MA"
    }

    // Numele scurt afișat lângă avatar (ex: "marius@gmail.com" → "marius")
    const getDisplayName = (email) => {
        if (!email) return ''
        return email.split('@')[0]
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContent}>

                {/* ── Logo ── */}
                <div className={styles.logo} onClick={() => navigate('/')}>
                    <span className={styles.logoShop}>Trust</span>
                    <span className={styles.logoAdvisor}>Cart</span>
                </div>

                {/* ── Search bar ── */}
                <div className={styles.searchContainer}>
                  <span className={styles.searchIcon}>
                    {/* Icon SVG Lucide Search — inline, fără librărie extra deocamdată */}
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" strokeWidth="2"
                           strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                  </span>

                    {<input
                        type="text"
                        placeholder="Caută produse... "
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                    />}
                </div>

                {/* ── Acțiuni dreapta ── */}
                <div className={styles.navActions}>

                    {/* Coș — doar dacă ești logat */}
                    {isLoggedIn && (
                        <button className={styles.cartButton} onClick={() => navigate('/cart')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="8" cy="21" r="1"/>
                                <circle cx="19" cy="21" r="1"/>
                                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                            </svg>
                            Coș
                            {/* Badge — apare doar dacă sunt produse în coș */}
                            {cartCount > 0 && (
                                <span className={styles.cartBadge}>{cartCount}</span>
                            )}
                        </button>
                    )}

                    {/* Wishlist — doar dacă ești logat */}
                    {isLoggedIn && (
                        <button className={styles.navButton} onClick={() => navigate('/wishlist')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                            Wishlist
                        </button>
                    )}

                    {/* Admin link — doar dacă ești admin */}
                    {isAdmin && (
                        <button className={styles.navButton} onClick={() => navigate('/admin')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                            Admin
                        </button>
                    )}

                    {/* Divider — apare doar dacă ești logat */}
                    {isLoggedIn && <div className={styles.divider} />}

                    {/* User logat → dropdown | Nelogat → Login + Register */}
                    {isLoggedIn ? (
                        <div className={styles.userMenu} ref={dropdownRef}>
                            <button
                                className={styles.userButton}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <div className={styles.userAvatar}>
                                    {getInitials(user?.email)}
                                </div>
                                <span>{getDisplayName(user?.email)}</span>
                                <svg
                                    className={`${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ''}`}
                                    width="12" height="12" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9"/>
                                </svg>
                            </button>

                            {/* Dropdown menu */}
                            {dropdownOpen && (
                                <div className={styles.dropdown}>
                                    <div className={styles.dropdownHeader}>
                                        <p className={styles.dropdownEmail}>{user?.email}</p>
                                    </div>

                                    <button
                                        className={styles.dropdownItem}
                                        onClick={() => { navigate('/account'); setDropdownOpen(false) }}
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                             stroke="currentColor" strokeWidth="2"
                                             strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                            <circle cx="12" cy="7" r="4"/>
                                        </svg>
                                        Contul meu
                                    </button>

                                    <button
                                        className={styles.dropdownItem}
                                        onClick={() => { navigate('/orders'); setDropdownOpen(false) }}
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                             stroke="currentColor" strokeWidth="2"
                                             strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                            <line x1="3" y1="6" x2="21" y2="6"/>
                                            <path d="M16 10a4 4 0 0 1-8 0"/>
                                        </svg>
                                        Comenzile mele
                                    </button>

                                    <div className={styles.dropdownDivider} />

                                    <button
                                        className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                                        onClick={handleLogout}
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                             stroke="currentColor" strokeWidth="2"
                                             strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                            <polyline points="16 17 21 12 16 7"/>
                                            <line x1="21" y1="12" x2="9" y2="12"/>
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button className={styles.loginButton} onClick={() => navigate('/login')}>
                                Login
                            </button>
                            <button className={styles.registerButton} onClick={() => navigate('/register')}>
                                Înregistrare
                            </button>
                        </>
                    )}

                </div>
            </div>
        </nav>
    )
}