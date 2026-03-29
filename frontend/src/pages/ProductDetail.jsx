import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axiosInstance from '../api/axiosInstance'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import ProductCard from '../components/ui/ProductCard'
import styles from './ProductDetail.module.css'
import { useWishlist } from '../hooks/useWishlist'

const CATEGORY_ICONS = {
    'Telefoane':  '📱',
    'Laptopuri':  '💻',
    'Gaming':     '🎮',
    'Audio':      '🎧',
    'Monitoare':  '🖥️',
    'Foto-Video': '📷',
}

export default function ProductDetail() {
    const { id } = useParams()
    // useParams() citește parametrii din URL
    // Dacă URL-ul e /products/5, id = "5"
    // Echivalent Vue: useRoute().params.id

    const navigate = useNavigate()
    const { isLoggedIn } = useAuth()
    const { addToCart } = useCart()
    const { isInWishlist, toggleWishlist } = useWishlist()

    // ── State ──
    const [product, setProduct]           = useState(null)
    const [similarProducts, setSimilar]   = useState([])
    const [loading, setLoading]           = useState(true)
    const [error, setError]               = useState(false)
    const [quantity, setQuantity]         = useState(1)
    const [addedToCart, setAddedToCart]   = useState(false)
    // addedToCart — arată un toast de confirmare după add to cart

    // ── Fetch produs ──
    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true)
            setError(false)
            // Reset state la fiecare schimbare de produs
            setQuantity(1)
            setAddedToCart(false)

            try {
                // Fetch produsul principal
                const res = await axiosInstance.get(`/api/products/${id}`)
                setProduct(res.data)

                // Fetch produse similare din aceeași categorie
                // Folosim ID-ul categoriei din răspuns
                if (res.data.category?.id) {
                    const simRes = await axiosInstance.get(
                        `/api/products/category/${res.data.category.id}`
                    )
                    // Excludem produsul curent din similare
                    const filtered = simRes.data.filter(p => p.id !== res.data.id)
                    setSimilar(filtered.slice(0, 4)) // max 4 similare
                }
            } catch (err) {
                console.error('Failed to fetch product:', err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [id])
    // [id] — re-rulează când userul navighează la alt produs
    // (ex: click pe un produs similar)

    // ── Adaugă în coș ──
    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            navigate('/login')
            return
        }

        const result = await addToCart(product.id, quantity)

        if (result.success) {
            setAddedToCart(true)
            // Ascunde toast-ul după 3 secunde
            setTimeout(() => setAddedToCart(false), 3000)
        }
    }

    // ── Toggle wishlist ──
    const handleWishlistToggle = async () => {
        if (!isLoggedIn) {
            navigate('/login')
            return
        }
        await toggleWishlist(product.id)
    }

    // ── Stepper ──
    const handleDecrement = () => {
        if (quantity > 1) setQuantity(quantity - 1)
    }

    const handleIncrement = () => {
        if (product && quantity < product.stock) {
            setQuantity(quantity + 1)
        }
    }

    // ── Formatare preț ──
    const formatPrice = (price) => {
        return new Intl.NumberFormat('ro-RO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price)
    }

    const isOutOfStock = product && (product.stock === 0 || !product.isActive)

    // ── Loading state ──
    if (loading) {
        return (
            <div className={styles.loadingState}>
                <div className={styles.skeletonImg} />
                <div>
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={styles.skeletonText}
                            style={{ width: i === 0 ? '60%' : i === 1 ? '90%' : '75%' }}
                        />
                    ))}
                </div>
            </div>
        )
    }

    // ── Error state ──
    if (error || !product) {
        return (
            <div className={styles.errorState}>
                <p className={styles.errorTitle}>Produsul nu a fost găsit</p>
                <p className={styles.errorSubtitle}>
                    Produsul căutat nu există sau a fost eliminat.
                </p>
                <button className={styles.backBtn} onClick={() => navigate('/products')}>
                    ← Înapoi la produse
                </button>
            </div>
        )
    }

    return (
        <div className={styles.page}>

            {/* ── Breadcrumb ── */}
            <nav className={styles.breadcrumb}>
                <button className={styles.breadLink} onClick={() => navigate('/')}>
                    Acasă
                </button>
                ›
                <button
                    className={styles.breadLink}
                    onClick={() => navigate(`/products?categoryId=${product.category?.id}`)}
                >
                    {product.category?.name}
                </button>
                ›
                <span className={styles.breadCurrent}>{product.name}</span>
            </nav>

            {/* ── Main: imagine + detalii ── */}
            <div className={styles.main}>

                {/* Stânga — imagine */}
                <motion.div
                    className={styles.imgSection}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className={styles.imgMain}>
                        {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} />
                        ) : (
                            <svg className={styles.imgPlaceholder}
                                 width="120" height="120" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="0.8">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <path d="m21 15-5-5L5 21"/>
                            </svg>
                        )}
                    </div>

                    {/* Thumbnails — deocamdată doar imaginea principală */}
                    <div className={styles.thumbs}>
                        <div className={`${styles.thumb} ${styles.thumbActive}`}>
                            {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} />
                            ) : (
                                <svg width="26" height="26" viewBox="0 0 24 24"
                                     fill="none" stroke="#C7D2FE" strokeWidth="1.2">
                                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                                    <circle cx="8.5" cy="8.5" r="1.5"/>
                                    <path d="m21 15-5-5L5 21"/>
                                </svg>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Dreapta — detalii */}
                <motion.div
                    className={styles.details}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Categorie + wishlist */}
                    <div className={styles.topRow}>
                        <button
                            className={styles.catTag}
                            onClick={() => navigate(`/products?categoryId=${product.category?.id}`)}
                        >
                            {CATEGORY_ICONS[product.category?.name] || '📦'}
                            {product.category?.name}
                        </button>

                        <button
                            className={`${styles.wishBtn} ${isInWishlist(product.id) ? styles.wishBtnActive : ''}`}
                            onClick={handleWishlistToggle}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24"
                                 fill={isInWishlist(product.id) ? '#EF4444' : 'none'}
                                 stroke={isInWishlist(product.id) ? '#EF4444' : '#9CA3AF'}
                                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </button>


                    </div>

                    {/* Titlu */}
                    <h1 className={styles.prodName}>{product.name}</h1>

                    {/* Stoc */}
                    <div className={styles.stockRow}>
                        <div
                            className={styles.stockDot}
                            style={{ background: isOutOfStock ? '#EF4444' : '#10B981' }}
                        />
                        <span
                            className={styles.stockText}
                            style={{ color: isOutOfStock ? '#EF4444' : '#10B981' }}
                        >
              {isOutOfStock ? 'Stoc epuizat' : 'În stoc'}
            </span>
                        {!isOutOfStock && (
                            <span className={styles.stockCount}>
                · {product.stock} bucăți disponibile
              </span>
                        )}
                    </div>

                    {/* Preț */}
                    <div className={styles.priceBox}>
                        <p className={styles.priceLabel}>Preț</p>
                        <p className={styles.price}>
                            {formatPrice(product.price)}
                            <span className={styles.priceCur}>RON</span>
                        </p>
                    </div>

                    {/* Toast confirmare */}
                    {addedToCart && (
                        <motion.div
                            className={styles.toast}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Produsul a fost adăugat în coș!
                        </motion.div>
                    )}

                    {/* Stepper + Add to cart */}
                    <div className={styles.addRow}>
                        <div className={styles.stepper}>
                            <button
                                className={`${styles.stepBtn} ${styles.stepBtnLeft}`}
                                onClick={handleDecrement}
                                disabled={quantity <= 1}
                            >
                                −
                            </button>
                            <span className={styles.stepVal}>{quantity}</span>
                            <button
                                className={`${styles.stepBtn} ${styles.stepBtnRight}`}
                                onClick={handleIncrement}
                                disabled={isOutOfStock || quantity >= product.stock}
                            >
                                +
                            </button>
                        </div>

                        <button
                            className={styles.addBtn}
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                        >
                            {isOutOfStock ? (
                                'Indisponibil'
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                         stroke="white" strokeWidth="2.2" strokeLinecap="round">
                                        <circle cx="8" cy="21" r="1"/>
                                        <circle cx="19" cy="21" r="1"/>
                                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                                    </svg>
                                    Adaugă în coș
                                </>
                            )}
                        </button>
                    </div>

                    {/* Descriere */}
                    <div className={styles.section}>
                        <p className={styles.sectionTitle}>Descriere</p>
                        {product.description ? (
                            <p className={styles.description}>{product.description}</p>
                        ) : (
                            <p className={styles.noDescription}>
                                Nu există descriere pentru acest produs.
                            </p>
                        )}
                    </div>

                    {/* Furnizor */}
                    {product.supplier && (
                        <div className={styles.section}>
                            <p className={styles.sectionTitle}>Furnizor</p>
                            <div className={styles.supplierCard}>
                                <div className={styles.supplierAvatar}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                         stroke="#6366F1" strokeWidth="2" strokeLinecap="round">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                        <polyline points="9 22 9 12 15 12 15 22"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className={styles.supplierName}>{product.supplier.name}</p>
                                    {product.supplier.contactEmail && (
                                        <p className={styles.supplierEmail}>
                                            {product.supplier.contactEmail}
                                        </p>
                                    )}
                                    {product.supplier.contactPhone && (
                                        <p className={styles.supplierPhone}>
                                            {product.supplier.contactPhone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                </motion.div>
            </div>

            {/* ── Produse similare ── */}
            {similarProducts.length > 0 && (
                <div className={styles.similar}>
                    <div className={styles.similarHeader}>
                        <h2 className={styles.similarTitle}>
                            Produse similare din {product.category?.name}
                        </h2>
                        <button
                            className={styles.seeAll}
                            onClick={() => navigate(`/products?categoryId=${product.category?.id}`)}
                        >
                            Vezi toate →
                        </button>
                    </div>

                    <div className={styles.similarGrid}>
                        {similarProducts.map((p, i) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.08 }}
                            >
                                <ProductCard
                                    product={p}
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