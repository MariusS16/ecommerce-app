import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axiosInstance from '../api/axiosInstance'
import ProductCard from '../components/ui/ProductCard'
import styles from './Products.module.css'

const PRODUCTS_PER_PAGE = 12

const SORT_OPTIONS = [
    { value: 'newest',    label: 'Cele mai noi' },
    { value: 'price_asc', label: 'Preț crescător' },
    { value: 'price_desc', label: 'Preț descrescător' },
    { value: 'name_asc',  label: 'Nume A-Z' },
]

const CATEGORY_ICONS = {
    'Telefoane & Tablete':  '📱',
    'PC & Laptop':  '💻',
    'Gaming':     '🎮',
    'Audio':      '🎧',
    'Casa':  '🏡',
    'Electrocasnice': '📺',
    'Carti': '📚',
    'Sport': '🎾',
    'Fashion': '👓',
    'Audio & Video': '📷',
}

export default function Products() {
    const navigate = useNavigate()
    // useSearchParams — citește și modifică parametrii din URL
    // Echivalent Vue: useRoute().query
    const [searchParams, setSearchParams] = useSearchParams()

    // Citim parametrii din URL la mount
    const urlSearch     = searchParams.get('search') || ''
    const urlCategoryId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : null

    // ── State filtre ──
    const [selectedCategoryId, setSelectedCategoryId] = useState(urlCategoryId)
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    const [sortBy, setSortBy] = useState('newest')
    const [inStockOnly, setInStockOnly] = useState(false)
    const [searchTerm] = useState(urlSearch)

    // ── State date ──
    const [allProducts, setAllProducts]   = useState([])  // toate produsele
    const [categories, setCategories]     = useState([])
    const [loading, setLoading]           = useState(true)
    const [loadingMore, setLoadingMore]   = useState(false)
    const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE)

    // ── Fetch date ──
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                // Fetch categorii
                const catRes = await axiosInstance.get('/api/categories')
                setCategories(catRes.data)

                // Fetch produse în funcție de context
                let prodRes
                if (urlSearch) {
                    // Căutare după termen
                    prodRes = await axiosInstance.get(`/api/products/search?term=${encodeURIComponent(urlSearch)}`)
                } else if (urlCategoryId) {
                    // Filtrare după categorie
                    prodRes = await axiosInstance.get(`/api/products/category/${urlCategoryId}`)
                } else {
                    // Toate produsele
                    prodRes = await axiosInstance.get('/api/products')
                }
                setAllProducts(prodRes.data)
            } catch (err) {
                console.error('Failed to fetch:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [urlSearch, urlCategoryId])
    // Dependențele [urlSearch, urlCategoryId] — se re-rulează când se schimbă URL-ul

    // ── Schimb categorie ──
    const handleCategoryChange = async (categoryId) => {
        setSelectedCategoryId(categoryId)
        setVisibleCount(PRODUCTS_PER_PAGE)
        setLoading(true)

        try {
            let res
            if (categoryId === null) {
                res = await axiosInstance.get('/api/products')
                setSearchParams({})  // curăță URL
            } else {
                res = await axiosInstance.get(`/api/products/category/${categoryId}`)
                setSearchParams({ categoryId: categoryId.toString() })
            }
            setAllProducts(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // ── Filtrare + sortare locală ──
    // Aplicăm filtrele pe produsele deja încărcate (fără request suplimentar)
    const filteredProducts = allProducts
        .filter(p => {
            // Fitru ptodus INACTIVE - nu le afișăm deloc
            if (!p.isActive) return false
            // Filtru preț min
            if (minPrice && p.price < Number(minPrice)) return false
            // Filtru preț max
            if (maxPrice && p.price > Number(maxPrice)) return false
            // Filtru stoc
            if (inStockOnly && p.stock === 0 ) return false
            return true
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price_asc':  return a.price - b.price
                case 'price_desc': return b.price - a.price
                case 'name_asc':   return a.name.localeCompare(b.name)
                case 'newest':
                default:
                    // Sortare după ID descrescător (cele mai noi = ID mai mare)
                    return (b.id || 0) - (a.id || 0)
            }
        })

    // Produsele vizibile = primele `visibleCount` din lista filtrată
    const visibleProducts = filteredProducts.slice(0, visibleCount)
    const hasMore = visibleCount < filteredProducts.length

    // ── Load more ──
    const handleLoadMore = () => {
        setLoadingMore(true)
        // Simulăm un mic delay ca să fie mai natural
        setTimeout(() => {
            setVisibleCount(prev => prev + PRODUCTS_PER_PAGE)
            setLoadingMore(false)
        }, 400)
    }

    // ── Reset filtre ──
    const handleReset = () => {
        setSelectedCategoryId(null)
        setMinPrice('')
        setMaxPrice('')
        setSortBy('newest')
        setInStockOnly(false)
        setVisibleCount(PRODUCTS_PER_PAGE)
        setSearchParams({})
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setLoading(true)
        axiosInstance.get('/api/products')
            .then(res => setAllProducts(res.data))
            .catch(console.error)
            .finally(() => setLoading(false))
    }

    // ── Numele categoriei active ──
    const activeCategoryName = selectedCategoryId
        ? categories.find(c => c.id === selectedCategoryId)?.name
        : null

    return (
        <div className={styles.page}>

            {/* ── Header ── */}
            <div className={styles.pageHeader}>
                <div className={styles.breadcrumb}>
                    <button className={styles.breadcrumbLink} onClick={() => navigate('/')}>
                        Acasă
                    </button>
                    ›
                    <span>
            {activeCategoryName || (urlSearch ? `Căutare: "${urlSearch}"` : 'Produse')}
          </span>
                </div>
                <p className={styles.resultsCount}>
                    <strong>{filteredProducts.length}</strong> produse găsite
                </p>
            </div>

            {/* ── Layout ── */}
            <div className={styles.layout}>

                {/* ══ SIDEBAR ══ */}
                <aside className={styles.sidebar}>

                    {/* Categorii */}
                    <div className={styles.filterCard}>
                        <p className={styles.filterTitle}>Categorii</p>
                        <div className={styles.catList}>
                            {/* Opțiunea "Toate" */}
                            <button
                                className={`${styles.catItem} ${!selectedCategoryId ? styles.catItemActive : ''}`}
                                onClick={() => handleCategoryChange(null)}
                            >
                                <span>🏪 Toate produsele</span>
                                <span className={styles.catBadge}>{allProducts.length}</span>
                            </button>

                            {/* Categoriile de la backend */}
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    className={`${styles.catItem} ${selectedCategoryId === cat.id ? styles.catItemActive : ''}`}
                                    onClick={() => handleCategoryChange(cat.id)}
                                >
                  <span>
                    {CATEGORY_ICONS[cat.name] || '📦'} {cat.name}
                  </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preț */}
                    <div className={styles.filterCard}>
                        <p className={styles.filterTitle}>Preț (RON)</p>
                        <div className={styles.priceInputs}>
                            <div>
                                <p className={styles.priceLabel}>Minim</p>
                                <input
                                    type="number"
                                    placeholder="0"
                                    className={styles.priceInput}
                                    value={minPrice}
                                    onChange={e => {
                                        setMinPrice(e.target.value)
                                        setVisibleCount(PRODUCTS_PER_PAGE)
                                    }}
                                />
                            </div>
                            <div>
                                <p className={styles.priceLabel}>Maxim</p>
                                <input
                                    type="number"
                                    placeholder="Orice"
                                    className={styles.priceInput}
                                    value={maxPrice}
                                    onChange={e => {
                                        setMaxPrice(e.target.value)
                                        setVisibleCount(PRODUCTS_PER_PAGE)
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sortare */}
                    <div className={styles.filterCard}>
                        <p className={styles.filterTitle}>Sortare</p>
                        <div className={styles.sortList}>
                            {SORT_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    className={`${styles.sortItem} ${sortBy === opt.value ? styles.sortItemActive : ''}`}
                                    onClick={() => {
                                        setSortBy(opt.value)
                                        setVisibleCount(PRODUCTS_PER_PAGE)
                                    }}
                                >
                                    <div className={`${styles.radio} ${sortBy === opt.value ? styles.radioActive : ''}`}>
                                        {sortBy === opt.value && <div className={styles.radioDot} />}
                                    </div>
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Doar în stoc */}
                    <div className={styles.filterCard}>
                        <div className={styles.toggleRow}>
                            <span className={styles.toggleLabel}>Doar produse în stoc</span>
                            <div
                                className={`${styles.toggle} ${inStockOnly ? styles.toggleOn : styles.toggleOff}`}
                                onClick={() => {
                                    setInStockOnly(!inStockOnly)
                                    setVisibleCount(PRODUCTS_PER_PAGE)
                                }}
                            >
                                <div className={`${styles.toggleDot} ${inStockOnly ? styles.toggleDotOn : styles.toggleDotOff}`} />
                            </div>
                        </div>
                    </div>

                    {/* Reset */}
                    <button className={styles.resetBtn} onClick={handleReset}>
                        ✕ Resetează filtrele
                    </button>

                </aside>

                {/* ══ MAIN — grid produse ══ */}
                <main className={styles.main}>

                    {/* Toolbar cu tag-uri active */}
                    {(urlSearch || activeCategoryName || inStockOnly || minPrice || maxPrice) && (
                        <div className={styles.toolbar}>
                            {urlSearch && (
                                <span className={styles.activeTag}>
                  🔍 "{urlSearch}"
                  <button className={styles.activeTagClose} onClick={handleReset}>×</button>
                </span>
                            )}
                            {activeCategoryName && (
                                <span className={styles.activeTag}>
                  {CATEGORY_ICONS[activeCategoryName]} {activeCategoryName}
                                    <button className={styles.activeTagClose} onClick={() => handleCategoryChange(null)}>×</button>
                </span>
                            )}
                            {inStockOnly && (
                                <span className={styles.activeTag}>
                  ✅ Doar în stoc
                  <button className={styles.activeTagClose} onClick={() => setInStockOnly(false)}>×</button>
                </span>
                            )}
                            {(minPrice || maxPrice) && (
                                <span className={styles.activeTag}>
                  💰 {minPrice || '0'} — {maxPrice || '∞'} RON
                  <button className={styles.activeTagClose} onClick={() => { setMinPrice(''); setMaxPrice('') }}>×</button>
                </span>
                            )}
                        </div>
                    )}

                    {/* Grid */}
                    <div className={styles.productsGrid}>
                        {loading ? (
                            // Skeleton loading
                            [...Array(PRODUCTS_PER_PAGE)].map((_, i) => (
                                <div key={i} className={styles.skeleton} />
                            ))
                        ) : visibleProducts.length === 0 ? (
                            // Empty state
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>🔍</div>
                                <p className={styles.emptyTitle}>Niciun produs găsit</p>
                                <p className={styles.emptySubtitle}>
                                    Încearcă să modifici filtrele sau caută altceva
                                </p>
                            </div>
                        ) : (
                            // Produse reale
                            visibleProducts.map((product, i) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: i < PRODUCTS_PER_PAGE ? i * 0.04 : 0 }}
                                    // delay doar la prima încărcare, nu la load more
                                >
                                    <ProductCard
                                        product={product}
                                    />
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Load more */}
                    {!loading && hasMore && (
                        <div className={styles.loadMoreWrapper}>
                            <div>
                                <button
                                    className={styles.loadMoreBtn}
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                >
                                    {loadingMore ? (
                                        <span className={styles.spinnerSm} />
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                             stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                            <polyline points="6 9 12 15 18 9"/>
                                        </svg>
                                    )}
                                    {loadingMore ? 'Se încarcă...' : 'Încarcă mai multe'}
                                </button>
                                <p className={styles.loadMoreInfo}>
                                    {visibleCount} din {filteredProducts.length} produse
                                </p>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    )
}