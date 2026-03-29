import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useWishlist } from '../hooks/useWishlist'
import ProductCard from '../components/ui/ProductCard'
import AccountLayout from '../components/layout/AccountLayout'
import styles from './Wishlist.module.css'

export default function Wishlist() {
    const navigate = useNavigate()
    const { wishlistItems, toggleWishlist } = useWishlist()

    // Extragem produsele din wishlist items
    const products = wishlistItems.map(item => item.product)

    return (
        <AccountLayout>
            <div>

                {/* Empty state */}
                {products.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>❤️</div>
                        <h2 className={styles.emptyTitle}>Wishlist-ul tău e gol</h2>
                        <p className={styles.emptySubtitle}>
                            Salvează produsele care îți plac apăsând pe inimă.
                            Le vei găsi aici oricând vrei să le cumperi.
                        </p>
                        <button
                            className={styles.emptyBtn}
                            onClick={() => navigate('/products')}
                        >
                            Explorează produsele
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className={styles.header}>
                            <div>
                                <h1 className={styles.title}>Wishlist</h1>
                                <p className={styles.subtitle}>
                                    {products.length} {products.length === 1 ? 'produs salvat' : 'produse salvate'}
                                </p>
                            </div>
                            <button
                                className={styles.clearBtn}
                                onClick={async () => {
                                    if (!window.confirm('Ești sigur că vrei să golești wishlist-ul?')) return
                                    // Eliminăm toate produsele unul câte unul
                                    for (const product of products) {
                                        await toggleWishlist(product.id)
                                    }
                                }}
                            >
                                ✕ Golește wishlist
                            </button>
                        </div>

                        {/* Grid produse */}
                        <div className={styles.grid}>
                            <AnimatePresence>
                                {products.map((product, i) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3, delay: i * 0.05 }}
                                        layout
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </>
                )}

            </div>
        </AccountLayout>
    )
}