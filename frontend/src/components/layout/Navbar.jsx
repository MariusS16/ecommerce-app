// // import { useState, useEffect, useRef } from 'react'
// // import { useNavigate } from 'react-router-dom'
// // import { useAuth } from '../../hooks/useAuth'
// // import { useCart } from '../../hooks/useCart'
// // import styles from './Navbar.module.css'
// //
// // export default function Navbar() {
// //     const navigate = useNavigate()
// //     const { isLoggedIn, isAdmin, user, logout } = useAuth()
// //     const { cartCount } = useCart()
// //
// //     const [dropdownOpen, setDropdownOpen] = useState(false)
// //     const [searchTerm, setSearchTerm] = useState('')
// //
// //     // Referință la dropdown — pentru a-l închide când dai click în afara lui
// //     // useRef = referință directă la un element DOM, fără re-render
// //     // Echivalent Vue: ref="dropdownRef" pe element
// //     const dropdownRef = useRef(null)
// //
// //     // Închide dropdown-ul când dai click oriunde în afara lui
// //     useEffect(() => {
// //         function handleClickOutside(event) {
// //             // dropdownRef.current = elementul DOM al dropdown-ului
// //             // .contains(event.target) = verifică dacă click-ul a fost înăuntrul lui
// //             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
// //                 setDropdownOpen(false)
// //             }
// //         }
// //
// //         // Adaugă listener pe întregul document
// //         document.addEventListener('mousedown', handleClickOutside)
// //
// //         // Cleanup — șterge listener-ul când componenta dispare din pagină
// //         // Echivalent Vue: onUnmounted(() => { ... })
// //         return () => {
// //             document.removeEventListener('mousedown', handleClickOutside)
// //         }
// //     }, [])
// //     // [] = efectul rulează doar la mount/unmount, nu la fiecare render
// //
// //     // Când user apasă Enter în search
// //     const handleSearch = (e) => {
// //         if (e.key === 'Enter' && searchTerm.trim()) {
// //             navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`)
// //             setSearchTerm('')
// //         }
// //     }
// //
// //     const handleLogout = () => {
// //         logout()
// //         setDropdownOpen(false)
// //         navigate('/')
// //     }
// //
// //     // Generează inițialele pentru avatar (ex: "marius@gmail.com" → "MA")
// //     const getInitials = (email) => {
// //         if (!email) return '?'
// //         const name = email.split('@')[0]       // "marius"
// //         return name.slice(0, 2).toUpperCase() // "MA"
// //     }
// //
// //     // Numele scurt afișat lângă avatar (ex: "marius@gmail.com" → "marius")
// //     const getDisplayName = (email) => {
// //         if (!email) return ''
// //         return email.split('@')[0]
// //     }
// //
// //     return (
// //         <nav className={styles.navbar}>
// //             <div className={styles.navContent}>
// //
// //                 {/* ── Logo ── */}
// //                 <div className={styles.logo} onClick={() => navigate('/')}>
// //                     <span className={styles.logoShop}>Trust</span>
// //                     <span className={styles.logoAdvisor}>Cart</span>
// //                 </div>
// //
// //                 {/* ── Search bar ── */}
// //                 <div className={styles.searchContainer}>
// //                   <span className={styles.searchIcon}>
// //                     {/* Icon SVG Lucide Search — inline, fără librărie extra deocamdată */}
// //                       <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
// //                            stroke="currentColor" strokeWidth="2"
// //                            strokeLinecap="round" strokeLinejoin="round">
// //                       <circle cx="11" cy="11" r="8"/>
// //                       <path d="m21 21-4.35-4.35"/>
// //                     </svg>
// //                   </span>
// //
// //                     {<input
// //                         type="text"
// //                         placeholder="Caută produse... "
// //                         className={styles.searchInput}
// //                         value={searchTerm}
// //                         onChange={(e) => setSearchTerm(e.target.value)}
// //                         onKeyDown={handleSearch}
// //                     />}
// //                 </div>
// //
// //                 {/* ── Acțiuni dreapta ── */}
// //                 <div className={styles.navActions}>
// //
// //                     {/* Coș — doar dacă ești logat */}
// //                     {isLoggedIn && (
// //                         <button className={styles.cartButton} onClick={() => navigate('/cart')}>
// //                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
// //                                  stroke="currentColor" strokeWidth="2"
// //                                  strokeLinecap="round" strokeLinejoin="round">
// //                                 <circle cx="8" cy="21" r="1"/>
// //                                 <circle cx="19" cy="21" r="1"/>
// //                                 <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
// //                             </svg>
// //                             Coș
// //                             {/* Badge — apare doar dacă sunt produse în coș */}
// //                             {cartCount > 0 && (
// //                                 <span className={styles.cartBadge}>{cartCount}</span>
// //                             )}
// //                         </button>
// //                     )}
// //
// //                     {/* Wishlist — doar dacă ești logat */}
// //                     {isLoggedIn && (
// //                         <button className={styles.navButton} onClick={() => navigate('/wishlist')}>
// //                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
// //                                  stroke="currentColor" strokeWidth="2"
// //                                  strokeLinecap="round" strokeLinejoin="round">
// //                                 <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
// //                             </svg>
// //                             Wishlist
// //                         </button>
// //                     )}
// //
// //                     {/* Admin link — doar dacă ești admin */}
// //                     {isAdmin && (
// //                         <button className={styles.navButton} onClick={() => navigate('/admin')}>
// //                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
// //                                  stroke="currentColor" strokeWidth="2"
// //                                  strokeLinecap="round" strokeLinejoin="round">
// //                                 <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
// //                                 <circle cx="12" cy="12" r="3"/>
// //                             </svg>
// //                             Admin
// //                         </button>
// //                     )}
// //
// //                     {/* Divider — apare doar dacă ești logat */}
// //                     {isLoggedIn && <div className={styles.divider} />}
// //
// //                     {/* User logat → dropdown | Nelogat → Login + Register */}
// //                     {isLoggedIn ? (
// //                         <div className={styles.userMenu} ref={dropdownRef}>
// //                             <button
// //                                 className={styles.userButton}
// //                                 onClick={() => setDropdownOpen(!dropdownOpen)}
// //                             >
// //                                 <div className={styles.userAvatar}>
// //                                     {getInitials(user?.email)}
// //                                 </div>
// //                                 <span>{getDisplayName(user?.email)}</span>
// //                                 <svg
// //                                     className={`${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ''}`}
// //                                     width="12" height="12" viewBox="0 0 24 24" fill="none"
// //                                     stroke="currentColor" strokeWidth="2.5"
// //                                     strokeLinecap="round" strokeLinejoin="round">
// //                                     <polyline points="6 9 12 15 18 9"/>
// //                                 </svg>
// //                             </button>
// //
// //                             {/* Dropdown menu */}
// //                             {dropdownOpen && (
// //                                 <div className={styles.dropdown}>
// //                                     <div className={styles.dropdownHeader}>
// //                                         <p className={styles.dropdownEmail}>{user?.email}</p>
// //                                     </div>
// //
// //                                     <button
// //                                         className={styles.dropdownItem}
// //                                         onClick={() => { navigate('/account'); setDropdownOpen(false) }}
// //                                     >
// //                                         <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
// //                                              stroke="currentColor" strokeWidth="2"
// //                                              strokeLinecap="round" strokeLinejoin="round">
// //                                             <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
// //                                             <circle cx="12" cy="7" r="4"/>
// //                                         </svg>
// //                                         Contul meu
// //                                     </button>
// //
// //                                     <button
// //                                         className={styles.dropdownItem}
// //                                         onClick={() => { navigate('/orders'); setDropdownOpen(false) }}
// //                                     >
// //                                         <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
// //                                              stroke="currentColor" strokeWidth="2"
// //                                              strokeLinecap="round" strokeLinejoin="round">
// //                                             <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
// //                                             <line x1="3" y1="6" x2="21" y2="6"/>
// //                                             <path d="M16 10a4 4 0 0 1-8 0"/>
// //                                         </svg>
// //                                         Comenzile mele
// //                                     </button>
// //
// //                                     <div className={styles.dropdownDivider} />
// //
// //                                     <button
// //                                         className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
// //                                         onClick={handleLogout}
// //                                     >
// //                                         <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
// //                                              stroke="currentColor" strokeWidth="2"
// //                                              strokeLinecap="round" strokeLinejoin="round">
// //                                             <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
// //                                             <polyline points="16 17 21 12 16 7"/>
// //                                             <line x1="21" y1="12" x2="9" y2="12"/>
// //                                         </svg>
// //                                         Logout
// //                                     </button>
// //                                 </div>
// //                             )}
// //                         </div>
// //                     ) : (
// //                         <>
// //                             <button className={styles.loginButton} onClick={() => navigate('/login')}>
// //                                 Login
// //                             </button>
// //                             <button className={styles.registerButton} onClick={() => navigate('/register')}>
// //                                 Înregistrare
// //                             </button>
// //                         </>
// //                     )}
// //
// //                 </div>
// //             </div>
// //         </nav>
// //     )
// // }
//
// import { useState, useEffect, useRef, useCallback } from 'react'
// import { useNavigate, useLocation } from 'react-router-dom'
// import { useAuth } from '../../hooks/useAuth'
// import { useCart } from '../../hooks/useCart'
// import { useWishlist } from '../../hooks/useWishlist'
// import axiosInstance from '../../api/axiosInstance'
// import styles from './Navbar.module.css'
//
// // Frazele pentru animația typewriter
// const TYPEWRITER_PHRASES = [
//     'Caută iPhone 16 Pro...',
//     'Caută laptop gaming...',
//     'Caută căști wireless...',
//     'Caută monitor 4K...',
//     'Caută placă video RTX...',
// ]
//
// export default function Navbar() {
//     const navigate   = useNavigate()
//     const location   = useLocation()
//     const { user, isLoggedIn, logout } = useAuth()
//     const { cart }   = useCart()
//     const { wishlistCount } = useWishlist()
//
//     // ── State ──
//     const [showMegaMenu,  setShowMegaMenu]  = useState(false)
//     const [showCartDrop,  setShowCartDrop]  = useState(false)
//     const [showUserDrop,  setShowUserDrop]  = useState(false)
//     const [categories,    setCategories]    = useState([])
//     const [searchFocused, setSearchFocused] = useState(false)
//     const [searchTerm,    setSearchTerm]    = useState('')
//     const [suggestions,   setSuggestions]   = useState([])
//     const [navbarVisible, setNavbarVisible] = useState(true)
//
//     // Typewriter state
//     const [displayText,   setDisplayText]   = useState('')
//     const [phraseIdx,     setPhraseIdx]     = useState(0)
//     const [charIdx,       setCharIdx]       = useState(0)
//     const [isDeleting,    setIsDeleting]    = useState(false)
//
//     const isHomePage = location.pathname === '/'
//
//     // ── Refs pentru timere ──
//     const megaTimeout  = useRef(null)
//     const cartTimeout  = useRef(null)
//     const userTimeout  = useRef(null)
//     const typeTimer    = useRef(null)
//
//     // ── Navbar hide/show pe Home ──
//     // Pe Home: ascuns inițial, apare după ce scrollezi din hero
//     useEffect(() => {
//         if (!isHomePage) {
//             setNavbarVisible(true)
//             return
//         }
//
//         // Pe home — ascuns inițial
//         setNavbarVisible(false)
//
//         const handleScroll = () => {
//             // Hero-ul e aproximativ 100vh înălțime
//             const heroHeight = window.innerHeight * 0.85
//             setNavbarVisible(window.scrollY > heroHeight)
//         }
//
//         window.addEventListener('scroll', handleScroll, { passive: true })
//         return () => window.removeEventListener('scroll', handleScroll)
//     }, [isHomePage])
//
//     // ── Fetch categorii ──
//     useEffect(() => {
//         axiosInstance.get('/api/categories')
//             .then(res => setCategories(res.data))
//             .catch(console.error)
//     }, [])
//
//     // ── Typewriter animation ──
//     useEffect(() => {
//         if (searchFocused) return
//         // Oprim animația când userul e în search
//
//         const currentPhrase = TYPEWRITER_PHRASES[phraseIdx]
//         let delay = isDeleting ? 40 : 70
//
//         if (!isDeleting && charIdx === currentPhrase.length) {
//             delay = 1800 // Pauză la final
//         } else if (isDeleting && charIdx === 0) {
//             delay = 300  // Pauză înainte de fraza următoare
//         }
//
//         typeTimer.current = setTimeout(() => {
//             if (!isDeleting && charIdx < currentPhrase.length) {
//                 setDisplayText(currentPhrase.substring(0, charIdx + 1))
//                 setCharIdx(prev => prev + 1)
//             } else if (!isDeleting && charIdx === currentPhrase.length) {
//                 setIsDeleting(true)
//             } else if (isDeleting && charIdx > 0) {
//                 setDisplayText(currentPhrase.substring(0, charIdx - 1))
//                 setCharIdx(prev => prev - 1)
//             } else if (isDeleting && charIdx === 0) {
//                 setIsDeleting(false)
//                 setPhraseIdx(prev => (prev + 1) % TYPEWRITER_PHRASES.length)
//             }
//         }, delay)
//
//         return () => clearTimeout(typeTimer.current)
//     }, [charIdx, isDeleting, phraseIdx, searchFocused])
//
//     // ── Search suggestions ──
//     useEffect(() => {
//         if (!searchTerm.trim() || searchTerm.length < 2) {
//             setSuggestions([])
//             return
//         }
//
//         // Debounce — așteptăm 300ms după ultima tastă
//         const debounceTimer = setTimeout(async () => {
//             try {
//                 const res = await axiosInstance.get(
//                     `/api/products/search?term=${encodeURIComponent(searchTerm)}`
//                 )
//                 // Primele 5 rezultate
//                 setSuggestions(res.data.slice(0, 5))
//             } catch (err) {
//                 console.error(err)
//             }
//         }, 300)
//
//         return () => clearTimeout(debounceTimer)
//     }, [searchTerm])
//
//     // ── Handlers search ──
//     const handleSearchFocus = () => {
//         setSearchFocused(true)
//     }
//
//     const handleSearchBlur = () => {
//         // Delay ca să putem face click pe sugestii înainte să se ascundă
//         setTimeout(() => {
//             setSearchFocused(false)
//             if (!searchTerm) setSearchTerm('')
//         }, 150)
//     }
//
//     const handleSearchKeyDown = (e) => {
//         if (e.key === 'Enter' && searchTerm.trim()) {
//             navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`)
//             setSearchFocused(false)
//             setSearchTerm('')
//         }
//         if (e.key === 'Escape') {
//             setSearchFocused(false)
//             setSearchTerm('')
//         }
//     }
//
//     const handleSuggestionClick = (product) => {
//         navigate(`/products/${product.id}`)
//         setSearchFocused(false)
//         setSearchTerm('')
//     }
//
//     const handleSeeAllResults = () => {
//         if (searchTerm.trim()) {
//             navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`)
//             setSearchFocused(false)
//             setSearchTerm('')
//         }
//     }
//
//     // ── Hover helpers cu delay ──
//     // Delay la închidere — lasă userul să mute mouse-ul la dropdown
//     const makeHoverHandlers = (setFn, timeoutRef) => ({
//         onMouseEnter: () => {
//             clearTimeout(timeoutRef.current)
//             setFn(true)
//         },
//         onMouseLeave: () => {
//             timeoutRef.current = setTimeout(() => setFn(false), 150)
//         },
//     })
//
//     const megaHandlers  = makeHoverHandlers(setShowMegaMenu,  megaTimeout)
//     const cartHandlers  = makeHoverHandlers(setShowCartDrop,  cartTimeout)
//     const userHandlers  = makeHoverHandlers(setShowUserDrop,  userTimeout)
//
//     // ── Logout ──
//     const handleLogout = () => {
//         logout()
//         setShowUserDrop(false)
//         navigate('/')
//     }
//
//     // ── Inițiale avatar ──
//     const initials = user
//         ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
//         : 'U'
//
//     // ── Format preț ──
//     const formatPrice = (price) =>
//         new Intl.NumberFormat('ro-RO', {
//             minimumFractionDigits: 0,
//             maximumFractionDigits: 2,
//         }).format(price)
//
//     const cartItemCount = cart?.totalItems || 0
//     const cartTotal     = cart?.totalPrice || 0
//
//     // Pe login/register nu afișăm navbar
//     const hideNavbar = ['/login', '/register'].includes(location.pathname)
//     if (hideNavbar) return null
//
//     return (
//         <>
//             <header
//                 className={`${styles.navbar} ${
//                     isHomePage
//                         ? navbarVisible ? styles.navbarVisible : styles.navbarHidden
//                         : ''
//                 }`}
//             >
//                 {/* ── Logo ── */}
//                 <div className={styles.logo} onClick={() => navigate('/')}>
//                     TrustCart
//                 </div>
//
//                 {/* ── Buton Produse cu Mega Menu ── */}
//                 <div {...megaHandlers}>
//                     <button
//                         className={styles.productsBtn}
//                         onClick={() => navigate('/products')}
//                     >
//                         Produse
//                         <svg
//                             className={`${styles.chevron} ${showMegaMenu ? styles.chevronOpen : ''}`}
//                             width="14" height="14" viewBox="0 0 24 24"
//                             fill="none" stroke="currentColor"
//                             strokeWidth="2.5" strokeLinecap="round"
//                         >
//                             <polyline points="6 9 12 15 18 9"/>
//                         </svg>
//                     </button>
//                 </div>
//
//                 {/* ── Search Bar ── */}
//                 <div className={`${styles.searchContainer} ${searchFocused ? styles.searchContainerExpanded : ''}`}>
//                     <div className={`${styles.searchWrap} ${searchFocused ? styles.searchWrapExpanded : ''}`}>
//
//                         <svg
//                             className={styles.searchIcon}
//                             width="14" height="14" viewBox="0 0 24 24"
//                             fill="none" stroke="currentColor"
//                             strokeWidth="2.5" strokeLinecap="round"
//                         >
//                             <circle cx="11" cy="11" r="8"/>
//                             <path d="m21 21-4.35-4.35"/>
//                         </svg>
//
//                         <input
//                             type="text"
//                             className={`${styles.searchInput} ${searchTerm ? styles.searchInputTyping : ''}`}
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             onFocus={handleSearchFocus}
//                             onBlur={handleSearchBlur}
//                             onKeyDown={handleSearchKeyDown}
//                         />
//
//                         {/* Typewriter placeholder — ascuns când userul scrie */}
//                         {!searchTerm && (
//                             <div className={styles.placeholderOverlay}>
//                                 {searchFocused ? (
//                                     <span style={{ color: '#D1D5DB' }}>Caută produse...</span>
//                                 ) : (
//                                     <>
//                                         <span>{displayText}</span>
//                                         <span className={styles.cursor} />
//                                     </>
//                                 )}
//                             </div>
//                         )}
//
//                         {/* Sugestii — FĂRĂ iconițe */}
//                         {searchFocused && (
//                             <div className={styles.searchSuggestions}>
//                                 {suggestions.length > 0 ? (
//                                     <>
//                                         {suggestions.map((product, i) => (
//                                             <div key={product.id}>
//                                                 {i > 0 && <div className={styles.suggDivider} />}
//                                                 <button
//                                                     className={styles.suggItem}
//                                                     onMouseDown={() => handleSuggestionClick(product)}
//                                                 >
//                                                     <span className={styles.suggName}>{product.name}</span>
//                                                     <span className={styles.suggCategory}>
//                             {product.category?.name}
//                           </span>
//                                                 </button>
//                                             </div>
//                                         ))}
//                                         <div className={styles.suggDivider} />
//                                         <button
//                                             className={styles.suggFooter}
//                                             onMouseDown={handleSeeAllResults}
//                                         >
//                                             <svg width="12" height="12" viewBox="0 0 24 24"
//                                                  fill="none" stroke="currentColor" strokeWidth="2.5"
//                                                  strokeLinecap="round">
//                                                 <circle cx="11" cy="11" r="8"/>
//                                                 <path d="m21 21-4.35-4.35"/>
//                                             </svg>
//                                             Caută "{searchTerm}" în catalog
//                                         </button>
//                                     </>
//                                 ) : searchTerm.length >= 2 ? (
//                                     <div className={styles.suggEmpty}>
//                                         Niciun rezultat pentru "{searchTerm}"
//                                     </div>
//                                 ) : (
//                                     <div className={styles.suggEmpty}>
//                                         Scrie cel puțin 2 caractere...
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//
//                     </div>
//                 </div>
//
//                 {/* ── Acțiuni dreapta ── */}
//                 <div className={styles.navActions}>
//
//                     {/* Wishlist */}
//                     <button
//                         className={styles.navBtn}
//                         onClick={() => navigate('/wishlist')}
//                     >
//                         <svg width="15" height="15" viewBox="0 0 24 24"
//                              fill="none" stroke="currentColor"
//                              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                             <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
//                         </svg>
//                         Wishlist
//                         {wishlistCount > 0 && (
//                             <div className={`${styles.badge} ${styles.badgeWishlist}`}>
//                                 {wishlistCount}
//                             </div>
//                         )}
//                     </button>
//
//                     {/* Coș cu dropdown hover */}
//                     <div className={styles.btnWrapper} {...cartHandlers}>
//                         <button
//                             className={styles.navBtn}
//                             onClick={() => navigate('/cart')}
//                         >
//                             <svg width="15" height="15" viewBox="0 0 24 24"
//                                  fill="none" stroke="currentColor"
//                                  strokeWidth="2" strokeLinecap="round">
//                                 <circle cx="8" cy="21" r="1"/>
//                                 <circle cx="19" cy="21" r="1"/>
//                                 <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
//                             </svg>
//                             Coș
//                             {cartItemCount > 0 && (
//                                 <div className={`${styles.badge} ${styles.badgeCart}`}>
//                                     {cartItemCount}
//                                 </div>
//                             )}
//                         </button>
//
//                         {/* Dropdown coș */}
//                         {showCartDrop && (
//                             <div className={`${styles.dropdown} ${styles.cartDropdown}`}>
//                                 {!cart?.items?.length ? (
//                                     <div className={styles.cartEmpty}>Coșul tău este gol</div>
//                                 ) : (
//                                     <>
//                                         <div className={styles.cartItems}>
//                                             {cart.items.slice(0, 3).map(item => (
//                                                 <div key={item.id} className={styles.cartItem}>
//                                                     <div
//                                                         className={styles.cartItemImg}
//                                                         onClick={() => navigate(`/products/${item.product.id}`)}
//                                                     >
//                                                         {item.product.imageUrl ? (
//                                                             <img src={item.product.imageUrl} alt={item.product.name} />
//                                                         ) : (
//                                                             <svg width="18" height="18" viewBox="0 0 24 24"
//                                                                  fill="none" stroke="#D1D5DB" strokeWidth="1.2">
//                                                                 <rect x="3" y="3" width="18" height="18" rx="2"/>
//                                                                 <circle cx="8.5" cy="8.5" r="1.5"/>
//                                                                 <path d="m21 15-5-5L5 21"/>
//                                                             </svg>
//                                                         )}
//                                                     </div>
//                                                     <div style={{ flex: 1 }}>
//                                                         <div
//                                                             className={styles.cartItemName}
//                                                             onClick={() => navigate(`/products/${item.product.id}`)}
//                                                         >
//                                                             {item.product.name}
//                                                         </div>
//                                                         <div className={styles.cartItemQty}>
//                                                             x{item.quantity}
//                                                         </div>
//                                                     </div>
//                                                     <div className={styles.cartItemPrice}>
//                                                         {formatPrice(item.subtotal)} RON
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                         <div className={styles.cartFooter}>
//                                             <div className={styles.cartTotalRow}>
//                         <span className={styles.cartTotalLbl}>
//                           Total ({cart.totalItems} produse)
//                         </span>
//                                                 <span className={styles.cartTotalVal}>
//                           {formatPrice(cartTotal)} RON
//                         </span>
//                                             </div>
//                                             <button
//                                                 className={styles.cartCheckoutBtn}
//                                                 onClick={() => navigate('/checkout/address')}
//                                             >
//                                                 <svg width="13" height="13" viewBox="0 0 24 24"
//                                                      fill="none" stroke="white" strokeWidth="2.5"
//                                                      strokeLinecap="round">
//                                                     <rect x="1" y="4" width="22" height="16" rx="2"/>
//                                                     <line x1="1" y1="10" x2="23" y2="10"/>
//                                                 </svg>
//                                                 Mergi la Checkout
//                                             </button>
//                                         </div>
//                                     </>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//
//                     {/* User — logat sau nelogat */}
//                     {isLoggedIn ? (
//                         <div className={styles.btnWrapper} {...userHandlers}>
//                             <div className={styles.userAvatar}>{initials}</div>
//
//                             {showUserDrop && (
//                                 <div className={`${styles.dropdown} ${styles.userDropdown}`}>
//                                     <div className={styles.userDropdownHeader}>
//                                         <div className={styles.userDropdownName}>
//                                             {user?.firstName} {user?.lastName}
//                                         </div>
//                                         <div className={styles.userDropdownEmail}>{user?.email}</div>
//                                     </div>
//
//                                     <button
//                                         className={styles.userDropdownItem}
//                                         onClick={() => { navigate('/account'); setShowUserDrop(false) }}
//                                     >
//                                         <svg width="14" height="14" viewBox="0 0 24 24"
//                                              fill="none" stroke="currentColor" strokeWidth="2"
//                                              strokeLinecap="round">
//                                             <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
//                                             <circle cx="12" cy="7" r="4"/>
//                                         </svg>
//                                         Contul meu
//                                     </button>
//
//                                     <button
//                                         className={styles.userDropdownItem}
//                                         onClick={() => { navigate('/orders'); setShowUserDrop(false) }}
//                                     >
//                                         <svg width="14" height="14" viewBox="0 0 24 24"
//                                              fill="none" stroke="currentColor" strokeWidth="2"
//                                              strokeLinecap="round">
//                                             <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
//                                             <polyline points="14 2 14 8 20 8"/>
//                                         </svg>
//                                         Comenzile mele
//                                     </button>
//
//                                     <button
//                                         className={styles.userDropdownItem}
//                                         onClick={() => { navigate('/wishlist'); setShowUserDrop(false) }}
//                                     >
//                                         <svg width="14" height="14" viewBox="0 0 24 24"
//                                              fill="none" stroke="currentColor" strokeWidth="2"
//                                              strokeLinecap="round" strokeLinejoin="round">
//                                             <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
//                                         </svg>
//                                         Wishlist
//                                     </button>
//
//                                     {user?.role === 'ADMIN' && (
//                                         <>
//                                             <div className={styles.userDropdownDivider} />
//                                             <button
//                                                 className={styles.userDropdownItem}
//                                                 onClick={() => { navigate('/admin'); setShowUserDrop(false) }}
//                                             >
//                                                 <svg width="14" height="14" viewBox="0 0 24 24"
//                                                      fill="none" stroke="currentColor" strokeWidth="2"
//                                                      strokeLinecap="round">
//                                                     <circle cx="12" cy="12" r="3"/>
//                                                     <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
//                                                 </svg>
//                                                 Admin Panel
//                                             </button>
//                                         </>
//                                     )}
//
//                                     <div className={styles.userDropdownDivider} />
//                                     <button
//                                         className={`${styles.userDropdownItem} ${styles.userDropdownDanger}`}
//                                         onClick={handleLogout}
//                                     >
//                                         <svg width="14" height="14" viewBox="0 0 24 24"
//                                              fill="none" stroke="currentColor" strokeWidth="2"
//                                              strokeLinecap="round">
//                                             <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
//                                             <polyline points="16 17 21 12 16 7"/>
//                                             <line x1="21" y1="12" x2="9" y2="12"/>
//                                         </svg>
//                                         Deconectare
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     ) : (
//                         <>
//                             <button className={styles.loginBtn} onClick={() => navigate('/login')}>
//                                 Autentificare
//                             </button>
//                             <button className={styles.registerBtn} onClick={() => navigate('/register')}>
//                                 Înregistrare
//                             </button>
//                         </>
//                     )}
//
//                 </div>
//             </header>
//
//             {/* ── Mega Menu — în afara header-ului pentru poziționare fixă ── */}
//             {showMegaMenu && (
//                 <>
//                     <div
//                         className={styles.megaOverlay}
//                         onClick={() => setShowMegaMenu(false)}
//                     />
//                     <div
//                         className={styles.megaMenuWrapper}
//                         {...megaHandlers}
//                     >
//                         <div className={styles.megaMenu}>
//                             <div className={styles.megaInner}>
//                                 <p className={styles.megaTitle}>Categorii</p>
//                                 <div className={styles.megaGrid}>
//                                     {categories.map(cat => (
//                                         <button
//                                             key={cat.id}
//                                             className={styles.megaItem}
//                                             onClick={() => {
//                                                 navigate(`/products?categoryId=${cat.id}`)
//                                                 setShowMegaMenu(false)
//                                             }}
//                                         >
//                                             {cat.name}
//                                         </button>
//                                     ))}
//                                 </div>
//                                 <div className={styles.megaFooter}>
//                                     <button
//                                         className={styles.megaFooterLink}
//                                         onClick={() => {
//                                             navigate('/products')
//                                             setShowMegaMenu(false)
//                                         }}
//                                     >
//                                         Vezi toate produsele →
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </>
//             )}
//         </>
//     )
// }

import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../hooks/useWishlist'
import axiosInstance from '../../api/axiosInstance'
import styles from './Navbar.module.css'

const TYPEWRITER_PHRASES = [
    'Caută iPhone 16 Pro...',
    'Caută laptop gaming...',
    'Caută căști wireless...',
    'Caută monitor 4K...',
    'Caută placă video RTX...',
]

export default function Navbar() {
    const navigate  = useNavigate()
    const location  = useLocation()
    const { user, isLoggedIn, logout } = useAuth()
    const { cart, removeFromCart }     = useCart()
    const { wishlistItems, wishlistCount, toggleWishlist } = useWishlist()

    // ── Dropdowns ──
    const [showMegaMenu, setShowMegaMenu] = useState(false)
    const [showCartDrop, setShowCartDrop] = useState(false)
    const [showWishDrop, setShowWishDrop] = useState(false)
    const [showUserDrop, setShowUserDrop] = useState(false)

    // ── Categorii ──
    const [categories, setCategories] = useState([])

    // ── Search ──
    const [searchFocused, setSearchFocused] = useState(false)
    const [searchTerm,    setSearchTerm]    = useState('')
    const [suggestions,   setSuggestions]   = useState([])

    // ── Navbar visibility pe Home ──
    const [navbarVisible, setNavbarVisible] = useState(true)
    const isHomePage = location.pathname === '/'

    // ── Typewriter ──
    const [displayText, setDisplayText] = useState('')
    const [phraseIdx,   setPhraseIdx]   = useState(0)
    const [charIdx,     setCharIdx]     = useState(0)
    const [isDeleting,  setIsDeleting]  = useState(false)

    // ── Refs ──
    const megaTimeout = useRef(null)
    const cartTimeout = useRef(null)
    const wishTimeout = useRef(null)
    const userTimeout = useRef(null)
    const typeTimer   = useRef(null)

    // ── Navbar hide pe Home ──
    useEffect(() => {
        if (!isHomePage) {
            setNavbarVisible(true)
            return
        }
        setNavbarVisible(false)
        const handleScroll = () => {
            setNavbarVisible(window.scrollY > window.innerHeight * 0.85)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [isHomePage])

    // ── Fetch categorii ──
    useEffect(() => {
        axiosInstance.get('/api/categories')
            .then(res => setCategories(res.data))
            .catch(console.error)
    }, [])

    // ── Typewriter ──
    useEffect(() => {
        if (searchFocused) return
        const currentPhrase = TYPEWRITER_PHRASES[phraseIdx]
        let delay = isDeleting ? 40 : 70
        if (!isDeleting && charIdx === currentPhrase.length) delay = 1800
        else if (isDeleting && charIdx === 0) delay = 300

        typeTimer.current = setTimeout(() => {
            if (!isDeleting && charIdx < currentPhrase.length) {
                setDisplayText(currentPhrase.substring(0, charIdx + 1))
                setCharIdx(p => p + 1)
            } else if (!isDeleting && charIdx === currentPhrase.length) {
                setIsDeleting(true)
            } else if (isDeleting && charIdx > 0) {
                setDisplayText(currentPhrase.substring(0, charIdx - 1))
                setCharIdx(p => p - 1)
            } else {
                setIsDeleting(false)
                setPhraseIdx(p => (p + 1) % TYPEWRITER_PHRASES.length)
            }
        }, delay)

        return () => clearTimeout(typeTimer.current)
    }, [charIdx, isDeleting, phraseIdx, searchFocused])

    // ── Search debounce ──
    useEffect(() => {
        if (!searchTerm.trim() || searchTerm.length < 2) {
            setSuggestions([])
            return
        }
        const t = setTimeout(async () => {
            try {
                const res = await axiosInstance.get(
                    `/api/products/search?term=${encodeURIComponent(searchTerm)}`
                )
                setSuggestions(res.data.filter(p => p.isActive).slice(0, 5))
            } catch (err) { console.error(err) }
        }, 300)
        return () => clearTimeout(t)
    }, [searchTerm])

    const [profile, setProfile] = useState(null)

    useEffect(() => {
        if (!isLoggedIn) return
        axiosInstance.get('/api/users/me')
            .then(res => setProfile(res.data))
            .catch(console.error)
    }, [isLoggedIn])

    // ── Hover helpers ──
    const makeHoverHandlers = (setFn, ref) => ({
        onMouseEnter: () => { clearTimeout(ref.current); setFn(true) },
        onMouseLeave: () => { ref.current = setTimeout(() => setFn(false), 150) },
    })

    const megaHandlers = makeHoverHandlers(setShowMegaMenu, megaTimeout)
    const cartHandlers = makeHoverHandlers(setShowCartDrop, cartTimeout)
    const wishHandlers = makeHoverHandlers(setShowWishDrop, wishTimeout)
    const userHandlers = makeHoverHandlers(setShowUserDrop, userTimeout)

    // ── Search handlers ──
    const handleSearchFocus = () => setSearchFocused(true)

    const handleSearchBlur = () => {
        setTimeout(() => {
            setSearchFocused(false)
        }, 150)
    }

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`)
            setSearchFocused(false)
            setSearchTerm('')
        }
        if (e.key === 'Escape') {
            setSearchFocused(false)
            setSearchTerm('')
        }
    }

    const handleSuggestionClick = (product) => {
        navigate(`/products/${product.id}`)
        setSearchFocused(false)
        setSearchTerm('')
    }

    const handleSeeAllResults = () => {
        if (searchTerm.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`)
            setSearchFocused(false)
            setSearchTerm('')
        }
    }

    // ── Helpers ──
    const handleLogout = () => {
        logout()
        setShowUserDrop(false)
        navigate('/')
    }

    const handleWishlistRemove = async (e, productId) => {
        e.stopPropagation()
        await toggleWishlist(productId)
    }

    const handleCartDelete = async (e, productId) => {
        e.stopPropagation()
        await removeFromCart(productId)
    }

    const formatPrice = (p) =>
        new Intl.NumberFormat('ro-RO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(p)

    const initials = profile
        ? `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase()
        : user?.email?.[0]?.toUpperCase() || 'U'

    const cartItemCount = cart?.totalItems || 0
    const cartTotal     = cart?.totalPrice || 0

    // Nu afișăm navbar pe login/register
    if (['/login', '/register'].includes(location.pathname)) return null

    return (
        <>
            <header
                className={`${styles.navbar} ${
                    isHomePage
                        ? navbarVisible ? styles.navbarVisible : styles.navbarHidden
                        : ''
                }`}
            >
                <div className={styles.navbarInner}>

                    {/* ── Logo ── */}
                    <div className={styles.logo} onClick={() => navigate('/')}>
                        TrustCart
                    </div>

                    {/* ── Buton Produse ── */}
                    <div {...megaHandlers}>
                        <button
                            className={styles.productsBtn}
                            onClick={() => navigate('/products')}
                        >
                            Produse
                            <svg
                                className={`${styles.chevron} ${showMegaMenu ? styles.chevronOpen : ''}`}
                                width="14" height="14" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor"
                                strokeWidth="2.5" strokeLinecap="round"
                            >
                                <polyline points="6 9 12 15 18 9"/>
                            </svg>
                        </button>
                    </div>

                    {/* ── Search ── */}
                    <div className={`${styles.searchContainer} ${searchFocused ? styles.searchContainerExpanded : ''}`}>
                        <div className={`${styles.searchWrap} ${searchFocused ? styles.searchWrapExpanded : ''}`}>

                            <svg className={styles.searchIcon} width="14" height="14"
                                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 strokeWidth="2.5" strokeLinecap="round">
                                <circle cx="11" cy="11" r="8"/>
                                <path d="m21 21-4.35-4.35"/>
                            </svg>

                            <input
                                type="text"
                                className={`${styles.searchInput} ${searchTerm ? styles.searchInputTyping : ''}`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={handleSearchFocus}
                                onBlur={handleSearchBlur}
                                onKeyDown={handleSearchKeyDown}
                            />

                            {/* Typewriter */}
                            {!searchTerm && (
                                <div className={styles.placeholderOverlay}>
                                    {searchFocused ? (
                                        <span style={{ color: '#D1D5DB' }}>Caută produse...</span>
                                    ) : (
                                        <>
                                            <span>{displayText}</span>
                                            <span className={styles.cursor} />
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Sugestii */}
                            {searchFocused && (
                                <div className={styles.searchSuggestions}>
                                    {suggestions.length > 0 ? (
                                        <>
                                            {suggestions.map((product, i) => (
                                                <div key={product.id}>
                                                    {i > 0 && <div className={styles.suggDivider} />}
                                                    <button
                                                        className={styles.suggItem}
                                                        onMouseDown={() => handleSuggestionClick(product)}
                                                    >
                                                        <span className={styles.suggName}>{product.name}</span>
                                                        <span className={styles.suggCategory}>{product.category?.name}</span>
                                                    </button>
                                                </div>
                                            ))}
                                            <div className={styles.suggDivider} />
                                            <button
                                                className={styles.suggFooter}
                                                onMouseDown={handleSeeAllResults}
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24"
                                                     fill="none" stroke="currentColor" strokeWidth="2.5"
                                                     strokeLinecap="round">
                                                    <circle cx="11" cy="11" r="8"/>
                                                    <path d="m21 21-4.35-4.35"/>
                                                </svg>
                                                Caută "{searchTerm}" în catalog
                                            </button>
                                        </>
                                    ) : searchTerm.length >= 2 ? (
                                        <div className={styles.suggEmpty}>
                                            Niciun rezultat pentru "{searchTerm}"
                                        </div>
                                    ) : (
                                        <div className={styles.suggEmpty}>
                                            Scrie cel puțin 2 caractere...
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                        <button
                            className={styles.aiRoundBtn}
                            onClick={() => navigate('/recommendations')}
                            title="AI Recomandări"
                        >
                            <div className={styles.aiRoundPulse} />
                            <svg viewBox="-2.4 -2.4 28.80 28.80" width="18" height="18" fill="none">
                                <path
                                    d="M12 3C12 7.97056 16.0294 12 21 12C16.0294 12 12 16.0294 12 21C12 16.0294 7.97056 12 3 12C5.6655 12 8.06036 10.8412 9.70832 9"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>

                    </div>


                    {/* ── Actions dreapta ── */}
                    <div className={styles.navActions}>

                        {/* Wishlist */}
                        <div className={styles.btnWrapper} {...wishHandlers}>
                            <button className={styles.navBtn} onClick={() => navigate('/wishlist')}>
                                <svg width="15" height="15" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor"
                                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                </svg>
                                Wishlist
                                {wishlistCount > 0 && (
                                    <div className={`${styles.badge} ${styles.badgeWishlist}`}>
                                        {wishlistCount}
                                    </div>
                                )}
                            </button>

                            {showWishDrop && (
                                <div className={`${styles.dropdown} ${styles.wishlistDropdown}`}>
                                    <div className={styles.wishlistHeader}>
                                        <span className={styles.wishlistHeaderTitle}>Wishlist</span>
                                        <span className={styles.wishlistHeaderCount}>
                      {wishlistCount} {wishlistCount === 1 ? 'produs' : 'produse'}
                    </span>
                                    </div>

                                    {wishlistItems.length === 0 ? (
                                        <div className={styles.wishlistEmpty}>Niciun produs salvat</div>
                                    ) : (
                                        <>
                                            <div className={styles.wishlistItems}>
                                                {wishlistItems.map(item => (
                                                    <div
                                                        key={item.id}
                                                        className={styles.wishlistItem}
                                                        onClick={() => {
                                                            navigate(`/products/${item.product.id}`)
                                                            setShowWishDrop(false)
                                                        }}
                                                    >
                                                        <div className={styles.wishlistItemImg}>
                                                            {item.product.imageUrl ? (
                                                                <img src={item.product.imageUrl} alt={item.product.name} />
                                                            ) : (
                                                                <svg width="16" height="16" viewBox="0 0 24 24"
                                                                     fill="none" stroke="#D1D5DB" strokeWidth="1.2">
                                                                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                                                                    <circle cx="8.5" cy="8.5" r="1.5"/>
                                                                    <path d="m21 15-5-5L5 21"/>
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div className={styles.wishlistItemInfo}>
                                                            <div className={styles.wishlistItemName}>{item.product.name}</div>
                                                            <div className={styles.wishlistItemPrice}>
                                                                {formatPrice(item.product.price)} RON
                                                            </div>
                                                        </div>
                                                        <button
                                                            className={styles.wishlistItemRemove}
                                                            onClick={(e) => handleWishlistRemove(e, item.product.id)}
                                                            title="Elimină din wishlist"
                                                        >
                                                            <svg width="12" height="12" viewBox="0 0 24 24"
                                                                 fill="none" stroke="currentColor" strokeWidth="2.5"
                                                                 strokeLinecap="round">
                                                                <line x1="18" y1="6" x2="6" y2="18"/>
                                                                <line x1="6" y1="6" x2="18" y2="18"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className={styles.wishlistFooter}>
                                                <button
                                                    className={styles.wishlistViewBtn}
                                                    onClick={() => { navigate('/wishlist'); setShowWishDrop(false) }}
                                                >
                                                    <svg width="13" height="13" viewBox="0 0 24 24"
                                                         fill="none" stroke="currentColor" strokeWidth="2"
                                                         strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                                    </svg>
                                                    Vezi toate ({wishlistCount})
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Coș */}
                        <div className={styles.btnWrapper} {...cartHandlers}>
                            <button className={styles.navBtn} onClick={() => navigate('/cart')}>
                                <svg width="15" height="15" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor"
                                     strokeWidth="2" strokeLinecap="round">
                                    <circle cx="8" cy="21" r="1"/>
                                    <circle cx="19" cy="21" r="1"/>
                                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                                </svg>
                                Coș
                                {cartItemCount > 0 && (
                                    <div className={`${styles.badge} ${styles.badgeCart}`}>
                                        {cartItemCount}
                                    </div>
                                )}
                            </button>

                            {showCartDrop && (
                                <div className={`${styles.dropdown} ${styles.cartDropdown}`}>
                                    {!cart?.items?.length ? (
                                        <div className={styles.cartEmpty}>Coșul tău este gol</div>
                                    ) : (
                                        <>
                                            <div className={styles.cartItems}>
                                                {cart.items.map(item => (
                                                    <div key={item.id} className={styles.cartItem}>
                                                        <div
                                                            className={styles.cartItemImg}
                                                            onClick={() => navigate(`/products/${item.product.id}`)}
                                                        >
                                                            {item.product.imageUrl ? (
                                                                <img src={item.product.imageUrl} alt={item.product.name} />
                                                            ) : (
                                                                <svg width="18" height="18" viewBox="0 0 24 24"
                                                                     fill="none" stroke="#D1D5DB" strokeWidth="1.2">
                                                                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                                                                    <circle cx="8.5" cy="8.5" r="1.5"/>
                                                                    <path d="m21 15-5-5L5 21"/>
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div className={styles.cartItemInfo}>
                                                            <div
                                                                className={styles.cartItemName}
                                                                onClick={() => navigate(`/products/${item.product.id}`)}
                                                            >
                                                                {item.product.name}
                                                            </div>
                                                            <div className={styles.cartItemQty}>
                                                                x{item.quantity} · {formatPrice(item.product.price)} RON/buc
                                                            </div>
                                                        </div>
                                                        <div className={styles.cartItemPrice}>
                                                            {formatPrice(item.subtotal)} RON
                                                        </div>
                                                        <button
                                                            className={styles.cartItemDelete}
                                                            onClick={(e) => handleCartDelete(e, item.product.id)}
                                                            title="Șterge din coș"
                                                        >
                                                            <svg width="11" height="11" viewBox="0 0 24 24"
                                                                 fill="none" stroke="currentColor" strokeWidth="2.5"
                                                                 strokeLinecap="round">
                                                                <polyline points="3 6 5 6 21 6"/>
                                                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                                                <path d="M10 11v6M14 11v6"/>
                                                                <path d="M9 6V4h6v2"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className={styles.cartFooter}>
                                                <div className={styles.cartTotalRow}>
                          <span className={styles.cartTotalLbl}>
                            Total ({cart.totalItems} produse)
                          </span>
                                                    <span className={styles.cartTotalVal}>
                            {formatPrice(cartTotal)} RON
                          </span>
                                                </div>
                                                <button
                                                    className={styles.cartCheckoutBtn}
                                                    onClick={() => navigate('/checkout/address')}
                                                >
                                                    <svg width="13" height="13" viewBox="0 0 24 24"
                                                         fill="none" stroke="white" strokeWidth="2.5"
                                                         strokeLinecap="round">
                                                        <rect x="1" y="4" width="22" height="16" rx="2"/>
                                                        <line x1="1" y1="10" x2="23" y2="10"/>
                                                    </svg>
                                                    Mergi la Checkout
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* User */}
                        {isLoggedIn ? (
                            <div className={styles.btnWrapper} {...userHandlers}>
                                <div className={styles.userAvatar}>{initials}</div>

                                {showUserDrop && (
                                    <div className={`${styles.dropdown} ${styles.userDropdown}`}>
                                        <div className={styles.userDropdownHeader}>
                                            <div className={styles.userDropdownName}>
                                                {user?.firstName} {user?.lastName}
                                            </div>
                                            <div className={styles.userDropdownEmail}>{user?.email}</div>
                                        </div>

                                        {[
                                            { label: 'Contul meu', path: '/account', icon: <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>, icon2: <circle cx="12" cy="7" r="4"/> },
                                        ].map(item => null)}

                                        <button
                                            className={styles.userDropdownItem}
                                            onClick={() => { navigate('/account'); setShowUserDrop(false) }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                            </svg>
                                            Contul meu
                                        </button>

                                        <button
                                            className={styles.userDropdownItem}
                                            onClick={() => { navigate('/orders'); setShowUserDrop(false) }}
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

                                        <button
                                            className={styles.userDropdownItem}
                                            onClick={() => { navigate('/wishlist'); setShowUserDrop(false) }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                            </svg>
                                            Wishlist
                                        </button>

                                        {user?.role === 'ADMIN' && (
                                            <>
                                                <div className={styles.userDropdownDivider} />
                                                <button
                                                    className={styles.userDropdownItem}
                                                    onClick={() => { navigate('/admin'); setShowUserDrop(false) }}
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                        <circle cx="12" cy="12" r="3"/>
                                                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                                                    </svg>
                                                    Admin Panel
                                                </button>
                                            </>
                                        )}

                                        <div className={styles.userDropdownDivider} />
                                        <button
                                            className={`${styles.userDropdownItem} ${styles.userDropdownDanger}`}
                                            onClick={handleLogout}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                                <polyline points="16 17 21 12 16 7"/>
                                                <line x1="21" y1="12" x2="9" y2="12"/>
                                            </svg>
                                            Deconectare
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <button className={styles.loginBtn} onClick={() => navigate('/login')}>
                                    Autentificare
                                </button>
                                <button className={styles.registerBtn} onClick={() => navigate('/register')}>
                                    Înregistrare
                                </button>
                            </>
                        )}

                    </div>
                </div>
            </header>

            {/* ── Mega Menu ── */}
            {showMegaMenu && (
                <>
                    <div
                        className={styles.megaOverlay}
                        onClick={() => setShowMegaMenu(false)}
                    />
                    <div className={styles.megaMenuWrapper} {...megaHandlers}>
                        <div className={styles.megaMenu}>
                            <div className={styles.megaInner}>
                                <p className={styles.megaTitle}>Categorii</p>
                                <div className={styles.megaGrid}>
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            className={styles.megaItem}
                                            onClick={() => {
                                                navigate(`/products?categoryId=${cat.id}`)
                                                setShowMegaMenu(false)
                                            }}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                                <div className={styles.megaFooter}>
                                    <button
                                        className={styles.megaFooterLink}
                                        onClick={() => { navigate('/products'); setShowMegaMenu(false) }}
                                    >
                                        Vezi toate produsele →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}