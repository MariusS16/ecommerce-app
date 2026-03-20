import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import styles from './ProductCard.module.css'

/**
 * Props:
 * - product — obiectul produs de la backend (id, name, price, stock, imageUrl, category, isActive)
 * - isInWishlist — boolean, inima e roșie sau nu
 * - onWishlistToggle — funcție apelată când dai click pe inimă
 */
export default function ProductCard({
                                        product,
                                        isInWishlist = false,
                                        onWishlistToggle,
                                    }) {
    const navigate = useNavigate()
    const { isLoggedIn } = useAuth()
    const { addToCart } = useCart()

    const isOutOfStock = product.stock === 0 || !product.isActive

    // Click pe card → pagina de detalii produs
    const handleCardClick = () => {
        navigate(`/products/${product.id}`)
    }

    // Click pe butonul de coș — stopPropagation oprește
    // evenimentul să "urce" la card și să navigheze
    // Echivalent Vue: @click.stop
    const handleAddToCart = async (e) => {
        e.stopPropagation()
        if (!isLoggedIn) {
            navigate('/login')
            return
        }
        await addToCart(product.id, 1)
    }

    const handleWishlistClick = (e) => {
        e.stopPropagation()
        if (!isLoggedIn) {
            navigate('/login')
            return
        }
        onWishlistToggle?.(product.id)
        // ?. = optional chaining — dacă onWishlistToggle e undefined, nu crăpă
    }

    // Formatează prețul: 8299.99 → "8.299,99"
    const formatPrice = (price) => {
        return new Intl.NumberFormat('ro-RO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price)
    }

    return (
        <div className={styles.card} onClick={handleCardClick}>

            {/* ── Zona imagine ── */}
            <div className={styles.imageContainer}>

                {/* Overlay + badge pentru stoc epuizat */}
                {isOutOfStock && (
                    <>
                        <div className={styles.outOfStockOverlay} />
                        <div className={styles.outOfStockBadge}>Stoc epuizat</div>
                    </>
                )}

                {/* Imaginea produsului sau placeholder */}
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className={styles.image}
                    />
                ) : (
                    <svg className={styles.imagePlaceholder}
                         width="56" height="56" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" strokeWidth="1.2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="m21 15-5-5L5 21"/>
                    </svg>
                )}

                {/* Buton wishlist */}
                <button
                    className={`${styles.wishlistBtn} ${isInWishlist ? styles.active : ''}`}
                    onClick={handleWishlistClick}
                    title={isInWishlist ? 'Elimină din wishlist' : 'Adaugă la wishlist'}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24"
                         fill={isInWishlist ? '#EF4444' : 'none'}
                         stroke={isInWishlist ? '#EF4444' : '#9CA3AF'}
                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                </button>

            </div>

            {/* ── Conținut ── */}
            <div className={styles.content}>

                {/* Categorie */}
                <p className={styles.category}>
                    {product.category?.name || 'General'}
                </p>

                {/* Nume produs */}
                <p className={styles.name}>{product.name}</p>

                {/* Indicator stoc */}
                <div className={styles.stockIndicator}>
                    <div className={`${styles.stockDot} ${isOutOfStock ? styles.stockDotRed : styles.stockDotGreen}`} />
                    <span className={`${styles.stockText} ${isOutOfStock ? styles.stockTextRed : styles.stockTextGreen}`}>
            {isOutOfStock ? 'Stoc epuizat' : 'În stoc'}
          </span>
                </div>

                {/* Preț */}
                <p className={styles.price}>
                    {formatPrice(product.price)}
                    <span className={styles.priceCurrency}> RON</span>
                </p>

                {/* Buton — diferit în funcție de stoc */}
                {isOutOfStock ? (
                    <button className={styles.disabledBtn} disabled>
                        Indisponibil
                    </button>
                ) : (
                    <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                        <svg width="15" height="15" viewBox="0 0 24 24"
                             fill="none" stroke="white" strokeWidth="2.2"
                             strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="8" cy="21" r="1"/>
                            <circle cx="19" cy="21" r="1"/>
                            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                        </svg>
                        Adaugă în coș
                    </button>
                )}

            </div>
        </div>
    )
}