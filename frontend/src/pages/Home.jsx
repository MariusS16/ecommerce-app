import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axiosInstance from '../api/axiosInstance'
import ProductCard from '../components/ui/ProductCard'
import styles from './Home.module.css'

const CATEGORY_CONFIG = [
    {
        name: 'Telefoane',
        categoryId: 1,
        image: 'https://images.unsplash.com/photo-1742762379583-1a461c76f141?w=400&q=80',
        gradient: 'linear-gradient(135deg, rgba(139,92,246,0.75), rgba(236,72,153,0.75))',
        icon: (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                 stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
        ),
    },
    {
        name: 'Laptopuri',
        categoryId: 4,
        image: 'https://images.unsplash.com/photo-1576057122708-9608db46b2f3?w=400&q=80',
        gradient: 'linear-gradient(135deg, rgba(59,130,246,0.75), rgba(6,182,212,0.75))',
        icon: (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                 stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="2" y1="20" x2="22" y2="20"/>
            </svg>
        ),
    },
    {
        name: 'Gaming',
        categoryId: 5,
        image: 'https://images.unsplash.com/photo-1658671141384-c4317684a1a3?w=400&q=80',
        gradient: 'linear-gradient(135deg, rgba(239,68,68,0.75), rgba(249,115,22,0.75))',
        icon: (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                 stroke="white" strokeWidth="1.5" strokeLinecap="round">
                <line x1="6" y1="12" x2="10" y2="12"/>
                <line x1="8" y1="10" x2="8" y2="14"/>
                <line x1="15" y1="11" x2="15.01" y2="11"/>
                <line x1="17" y1="13" x2="17.01" y2="13"/>
                <path d="M6 5h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/>
            </svg>
        ),
    },
    {
        name: 'Audio & Video',
        categoryId: 10,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
        gradient: 'linear-gradient(135deg, rgba(234,179,8,0.75), rgba(249,115,22,0.75))',
        icon: (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                 stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
            </svg>
        ),
    },
    {
        name: 'Electrocasnice',
        categoryId: 6,
        image: 'https://images.unsplash.com/photo-1586208958839-06c17cacdf08?q=80&w=965&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        gradient: 'linear-gradient(135deg, rgba(99,102,241,0.75), rgba(139,92,246,0.75))',
        icon: (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                 stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
            </svg>
        ),
    },
    {
        name: 'Sport',
        categoryId: 8,
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        gradient: 'linear-gradient(135deg, rgba(16,185,129,0.75), rgba(5,150,105,0.75))',
        icon: (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                 stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
        ),
    },
]

const STATS = [
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
        ),
        value: '500', suffix: '+', label: 'Produse în catalog',
    },
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <path d="M8 21h8M12 17v4"/>
            </svg>
        ),
        value: '10', suffix: '+', label: 'Platforme externe',
    },
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
            </svg>
        ),
        value: '24', suffix: 'h', label: 'Cache AI actualizat',
    },
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
        ),
        value: '100', suffix: '%', label: 'Transparent',
    },
]

// Produse placeholder pentru floating card (înlocuit cu date reale)
const PLACEHOLDER_PRODUCTS = [
    { name: 'iPhone 16 Pro', price: '8.299', color: '#EEF2FF' },
    { name: 'MacBook Air M3', price: '6.499', color: '#F0FDF4' },
    { name: 'RTX 4070 Ti',   price: '3.799', color: '#FFF7ED' },
    { name: 'Sony XM5',      price: '1.299', color: '#FDF4FF' },
]

export default function Home() {
    const navigate = useNavigate()
    const trackRef = useRef(null)

    const [searchTerm, setSearchTerm] = useState('')
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axiosInstance.get('/api/products')
                setProducts(res.data)
            } catch (err) {
                console.error('Failed to fetch products:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            // navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`)
            navigate(`/recommendations?query=${encodeURIComponent(searchTerm.trim())}&auto=true`)
        }
    }

    const scrollCarousel = (direction) => {
        if (!trackRef.current) return
        // Găsim primul card și calculăm lățimea lui + gap
        const card = trackRef.current.querySelector(`.${styles.prodCardWrap}`)
        const cardWidth = card ? card.offsetWidth + 14 : 220
        // Scrollăm cu exact o lățime de card
        trackRef.current.scrollBy({ left: direction * cardWidth, behavior: 'smooth' })
    }

    return (
        <div>

            {/* ══ HERO — full screen ══ */}
            <section className={styles.hero}>
                <div className={styles.heroBg} />
                <div className={styles.heroOverlay} />
                <motion.div
                    className={styles.heroBlob1}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className={styles.heroBlob2}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                />

                <div className={styles.heroInner}>

                    {/* ── Stânga ── */}
                    <motion.div
                        className={styles.heroLeft}
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        {/* Badge */}
                        <motion.div
                            className={styles.heroBadge}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                            Consilierul tău de încredere
                        </motion.div>

                        {/* Titlu */}
                        <motion.h1
                            className={styles.heroTitle}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            Găsim cele mai bune
                            <span className={styles.heroTitleGradient}>
                produse pentru tine
              </span>
                        </motion.h1>

                        {/* Subtitlu */}
                        <motion.p
                            className={styles.heroSubtitle}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            TrustCart nu doar vinde, {' '}
                            <span>recomandă</span>! Dacă un produs este mai bun pe
                            altă platformă, îți spunem sincer.
                        </motion.p>

                        {/* Search */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <div className={styles.heroSearchWrap}>
                                <input
                                    className={styles.heroSearchInput}
                                    placeholder="Ce produs cauți astăzi?"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleSearch}
                                />
                                <button
                                    className={styles.heroSearchBtn}
                                    onClick={() => searchTerm.trim() &&
                                        navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`)
                                    }
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                         stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                        <circle cx="11" cy="11" r="8"/>
                                        <path d="m21 21-4.35-4.35"/>
                                    </svg>
                                    Caută
                                </button>
                            </div>
                            <p className={styles.heroHint}>
                                Apasă <span>Enter</span> — rezultate interne + recomandări AI automat
                            </p>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            className={styles.heroStats}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                        >
                            {STATS.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    className={styles.heroStatItem}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                                >
                                    <div className={styles.heroStatIcon}>{stat.icon}</div>
                                    <div className={styles.heroStatValue}>
                                        {stat.value}<span>{stat.suffix}</span>
                                    </div>
                                    <div className={styles.heroStatLabel}>{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* ── Dreapta — floating card ── */}
                    <motion.div
                        className={styles.heroRight}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        <div className={styles.floatingCardRelative}>
                            {/* Badge "Top Oferte" */}
                            <motion.div
                                className={styles.topOferteBadge}
                                animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                     stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                                    <polyline points="16 7 22 7 22 13"/>
                                </svg>
                                Top Oferte
                            </motion.div>

                            {/* Card principal */}
                            <motion.div
                                className={styles.floatingCard}
                                animate={{ y: [0, -16, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <div className={styles.floatingCardHeader}>
                                    <div className={styles.floatingCardIcon}>
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                             stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className={styles.floatingCardTitle}>Produse Recomandate</p>
                                        <p className={styles.floatingCardSub}>Selectate pentru tine</p>
                                    </div>
                                </div>

                                {/* Grid 2x2 cu produse */}
                                <div className={styles.floatingProductsGrid}>
                                    {(products.slice(0, 4).length > 0 ? products.slice(0, 4) : PLACEHOLDER_PRODUCTS).map((product, i) => (
                                        <motion.div
                                            key={i}
                                            className={styles.floatingProduct}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.4, delay: 0.9 + i * 0.1 }}
                                            onClick={() => product.id && navigate(`/products/${product.id}`)}
                                        >
                                            {/* Imagine sau placeholder colorat */}
                                            <div
                                                className={styles.floatingProductImg}
                                                style={{ background: product.color || '#EEF2FF' }}
                                            >
                                                {product.imageUrl ? (
                                                    <img src={product.imageUrl} alt={product.name}
                                                         style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                                                         stroke="#D1D5DB" strokeWidth="1.2">
                                                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                                                        <circle cx="8.5" cy="8.5" r="1.5"/>
                                                        <path d="m21 15-5-5L5 21"/>
                                                    </svg>
                                                )}
                                            </div>
                                            <div className={styles.floatingProductBody}>
                                                <p className={styles.floatingProductName}>
                                                    {product.name}
                                                </p>
                                                <p className={styles.floatingProductPrice}>
                                                    {product.price ? `${Number(product.price).toLocaleString('ro-RO')} RON` : product.price + ' RON'}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                </div>

                {/* Wave divider */}
                <div className={styles.waveDivider}>
                    <svg viewBox="0 0 1200 80" preserveAspectRatio="none"
                         style={{ width: '100%', height: 60 }}>
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                              fill="#F8FAFC" opacity="0.4"/>
                        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                              fill="#F8FAFC" opacity="0.6"/>
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                              fill="#F8FAFC"/>
                    </svg>
                </div>
            </section>

            {/* ══ CATEGORII cu imagini ══ */}
            <section className={`${styles.section} ${styles.sectionGray}`}>
                <div className={styles.sectionHeaderRow}>
                    <div>
                        <p className={styles.sectionLabel}>Explorează</p>
                        <h2 className={styles.sectionTitle}>Categorii populare</h2>
                    </div>
                    <button className={styles.seeAll} onClick={() => navigate('/category')}>
                        Vezi toate →
                    </button>
                </div>

                <div className={styles.categoriesGrid}>
                    {CATEGORY_CONFIG.map((cat, i) => (
                        <motion.div
                            key={cat.name}
                            className={styles.catCard}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            onClick={() => navigate(`/products?categoryId=${cat.categoryId}`)}
                        >
                            <img src={cat.image} alt={cat.name} className={styles.catCardImg} />
                            <div className={styles.catCardOverlay} style={{ background: cat.gradient }} />
                            <div className={styles.catCardContent}>
                                <span className={styles.catCardIcon}>{cat.icon}</span>
                                <p className={styles.catCardName}>{cat.name}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ══ PRODUSE FEATURED — carousel ══ */}
            <section className={`${styles.section} ${styles.sectionWhite}`}>
                <div className={styles.sectionHeaderRow}>
                    <div>
                        <p className={styles.sectionLabel}>Din catalogul nostru</p>
                        <h2 className={styles.sectionTitle}>Produse recomandate</h2>
                    </div>
                    <button className={styles.seeAll} onClick={() => navigate('/products')}>
                        Vezi toate →
                    </button>
                </div>

                <div className={styles.carouselOuter}>
                    <div className={styles.carouselWrapper}>

                        {/* Săgeată stânga */}
                        <button
                            className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
                            onClick={() => scrollCarousel(-1)}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <polyline points="15 18 9 12 15 6"/>
                            </svg>
                        </button>

                        {/* Track */}
                        <div
                            className={styles.carouselTrack}
                            ref={trackRef}
                        >
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <div key={i} className={`${styles.prodCardWrap} ${styles.skeleton}`} />
                                ))
                            ) : (
                                products.slice(0, 10).map((product) => (
                                    <div key={product.id} className={styles.prodCardWrap}>
                                        <ProductCard
                                            product={product}
                                        />
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Săgeată dreapta */}
                        <button
                            className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
                            onClick={() => scrollCarousel(1)}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <polyline points="9 18 15 12 9 6"/>
                            </svg>
                        </button>

                    </div>
                </div>
            </section>

            {/* ══ AI SECTION ══ */}
            <section className={styles.aiSection}>
                <div className={styles.aiBg} />
                <div className={styles.aiOverlay} />

                <div className={styles.aiInner}>

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <p className={styles.aiLabel}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                            </svg>
                            AI Powered
                        </p>
                        <h2 className={styles.aiTitle}>
                            Găsim cele mai bune oferte
                            pentru tine — <span>instant</span>
                        </h2>
                        <p className={styles.aiDesc}>
                            Sistemul nostru AI caută simultan în catalogul intern și pe
                            platformele externe și îți prezintă transparent diferențele
                            de preț. Nu mai pierzi timp comparând manual.
                        </p>
                        <button className={styles.aiBtn} onClick={() => navigate('/recommendations')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 stroke="white" strokeWidth="2.5">
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                            </svg>
                            Încearcă AI Search
                        </button>
                    </motion.div>

                    <motion.div
                        className={styles.aiDemoCard}
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className={styles.aiQuery}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"/>
                                <path d="m21 21-4.35-4.35"/>
                            </svg>
                            "laptop gaming RTX 4060"
                        </div>

                        <div className={styles.aiResult}>
                            <div className={styles.aiResultIcon}
                                 style={{ background: 'rgba(99,102,241,0.15)' }}>🏪</div>
                            <div>
                                <p className={styles.aiResultName}>ASUS TUF Gaming F15</p>
                                <p className={styles.aiResultPrice}>4.299 RON</p>
                            </div>
                            <span className={styles.aiBadge}
                                  style={{ background: 'rgba(99,102,241,0.2)', color: '#818CF8' }}>
                Intern
              </span>
                        </div>

                        <div className={styles.aiResult}>
                            <div className={styles.aiResultIcon}
                                 style={{ background: 'rgba(16,185,129,0.15)' }}>🛒</div>
                            <div>
                                <p className={styles.aiResultName}>Lenovo IdeaPad Gaming 3</p>
                                <p className={styles.aiResultPrice}>
                                    3.899 RON ·{' '}
                                    <span className={styles.aiResultSave} style={{ color: '#34D399' }}>
                    -400 RON
                  </span>
                                </p>
                            </div>
                            <span className={styles.aiBadge}
                                  style={{ background: 'rgba(16,185,129,0.2)', color: '#34D399' }}>
                eMAG
              </span>
                        </div>

                        <div className={styles.aiResult}>
                            <div className={styles.aiResultIcon}
                                 style={{ background: 'rgba(245,158,11,0.15)' }}>⚡</div>
                            <div>
                                <p className={styles.aiResultName}>HP Victus 15 RTX 4060</p>
                                <p className={styles.aiResultPrice}>
                                    4.099 RON ·{' '}
                                    <span className={styles.aiResultSave} style={{ color: '#FCD34D' }}>
                    -200 RON
                  </span>
                                </p>
                            </div>
                            <span className={styles.aiBadge}
                                  style={{ background: 'rgba(245,158,11,0.2)', color: '#FCD34D' }}>
                Altex
              </span>
                        </div>

                    </motion.div>
                </div>
            </section>

        </div>
    )
}