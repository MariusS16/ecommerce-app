import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axiosInstance from '../api/axiosInstance'
import { useCart } from '../hooks/useCart'
import styles from './Recommendations.module.css'
import altexLogo  from '../assets/externPlatforms/Altex.svg'
import emagLogo   from '../assets/externPlatforms/eMag.svg'
import flancoLogo from '../assets/externPlatforms/Flanco.svg'

const LOADING_STEPS = [
    'Căutare în catalogul intern...',
    'Interogare platforme externe...',
    'Analiză și comparare prețuri...',
    'Generare recomandare finală...',
]

const QUICK_CHIPS = [
    'iPhone 16 Pro', 'Laptop Dell', 'Căști Sony',
    'Samsung Galaxy', 'Monitor 4K',
]

const PLATFORM_CLASS = {
    'eMAG':      styles.platformEMAG,
    'Altex':     styles.platformAltex,
    'Amazon':    styles.platformAmazon,
    'Flanco':    styles.platformFlanco,
}

// Stele decorative random
const STARS = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
}))

export default function Recommendations() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { addToCart } = useCart()

    const queryParam = searchParams.get('query') || ''
    const autoSearch = searchParams.get('auto') === 'true'

    const [heroQuery,    setHeroQuery]    = useState(queryParam)
    const [resultsQuery, setResultsQuery] = useState(queryParam)
    const [showHero,     setShowHero]     = useState(!autoSearch)
    const [loading,      setLoading]      = useState(autoSearch)
    const [currentStep,  setCurrentStep]  = useState(0)
    const [result,       setResult]       = useState(null)
    const [error,        setError]        = useState(false)

    const stepTimers = useRef([])

    useEffect(() => {
        if (autoSearch && queryParam) performSearch(queryParam)
    }, [])

    const startLoadingSteps = () => {
        setCurrentStep(0)
        LOADING_STEPS.forEach((_, i) => {
            const t = setTimeout(() => setCurrentStep(i + 1), (i + 1) * 1500)
            stepTimers.current.push(t)
        })
    }

    const clearLoadingSteps = () => {
        stepTimers.current.forEach(clearTimeout)
        stepTimers.current = []
    }

    const performSearch = async (query) => {
        if (!query.trim()) return
        setShowHero(false)       // ascunde hero-ul
        setLoading(true)         // arată loading
        setResult(null)          // curăță rezultatele anterioare
        setError(false)          // curăță erorile anterioare
        setResultsQuery(query)   // salvează query-ul pentru afișare
        startLoadingSteps()      // pornește animația pașilor
        try {
            const res = await axiosInstance.post(
                `/api/recommendations/search?query=${encodeURIComponent(query.trim())}`
            )
            await new Promise(r => setTimeout(r, 2000))
            setResult(res.data)
        } catch (err) {
            console.error(err)
            setError(true)
        } finally {
            clearLoadingSteps()
            setLoading(false)
        }
    }

    const handleHeroSearch = () => performSearch(heroQuery)
    const handleHeroKeyDown = (e) => { if (e.key === 'Enter') handleHeroSearch() }

    const handleResultsSearch = () => performSearch(resultsQuery)
    const handleResultsKeyDown = (e) => { if (e.key === 'Enter') handleResultsSearch() }

    const handleNewSearch = () => {
        setShowHero(true)
        setResult(null)
        setError(false)
        setHeroQuery('')
    }

    const formatPrice = (p) =>
        new Intl.NumberFormat('ro-RO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(p)

    const cheapestExternal = result?.externalProducts?.length > 0
        ? result.externalProducts.reduce((a, b) => a.price < b.price ? a : b)
        : null

    const cheapestInternal = result?.internalProducts?.length > 0
        ? result.internalProducts.reduce((a, b) => a.price < b.price ? a : b)
        : null

    const PLATFORM_LOGOS = {
        'eMAG':    emagLogo,
        'Altex':   altexLogo,
        'Flanco':  flancoLogo,
    }

    const PlatformBadge = ({ platform }) => {
        const logo = PLATFORM_LOGOS[platform]

        if (logo) {
            return (
                <div className={`${styles.platformBadge} ${PLATFORM_CLASS[platform] || styles.platformDefault}`}>
                    <img
                        src={logo}
                        alt={platform}
                        style={{ height: '18px', width: 'auto', objectFit: 'contain' }}
                    />
                </div>
            )
        }

        // Fallback text dacă nu avem logo (ex: Amazon)
        return (
            <div className={`${styles.platformBadge} ${PLATFORM_CLASS[platform] || styles.platformDefault}`}>
                {platform}
            </div>
        )
    }

    const PriceDiff = ({ diff, pct }) => {
        if (diff === null || diff === undefined) return null
        if (diff === 0) return <div className={styles.priceDiffNeutral}>Același preț ca la noi</div>
        if (diff < 0)  return (
            <div className={styles.priceDiffCheaper}>
                {formatPrice(Math.abs(diff))} RON mai ieftin (-{Math.abs(pct?.toFixed(0))}%)
            </div>
        )
        return (
            <div className={styles.priceDiffPricier}>
                +{formatPrice(diff)} RON față de noi
            </div>
        )
    }

    const RecommendBanner = () => {
        if (!result) return null
        if (result.recommendation === 'external' && cheapestExternal) {
            const savings = cheapestInternal
                ? (cheapestInternal.price - cheapestExternal.price).toFixed(0) : null
            return (
                <div className={`${styles.recommendBanner} ${styles.recommendBannerExternal}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {savings && savings > 0
                        ? `Cel mai bun deal pe ${cheapestExternal.platform} — economisești ${savings} RON`
                        : `Platformele externe oferă cea mai bună valoare`
                    }
                </div>
            )
        }
        if (result.recommendation === 'internal') {
            return (
                <div className={styles.recommendBanner}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Catalogul TrustCart oferă cele mai bune prețuri pentru această căutare!
                </div>
            )
        }
        if (result.recommendation === 'both') {
            return (
                <div className={`${styles.recommendBanner} ${styles.recommendBannerBoth}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    Prețuri similare la noi și pe platforme externe — compară și alege!
                </div>
            )
        }
        return null
    }

    return (
        <div className={styles.page}>

            {/* ══ HERO ══ */}
            <AnimatePresence>
                {showHero && (
                    <motion.div
                        className={styles.hero}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Orbs */}
                        <div className={styles.orb1} />
                        <div className={styles.orb2} />

                        {/* Stele */}
                        <div className={styles.heroBg}>
                            {STARS.map(s => (
                                <div
                                    key={s.id}
                                    className={styles.star}
                                    style={{
                                        width: s.size, height: s.size,
                                        top: `${s.top}%`, left: `${s.left}%`,
                                        '--d': `${s.duration}s`,
                                        '--delay': `${s.delay}s`,
                                    }}
                                />
                            ))}
                        </div>

                        {/* Icon brain */}
                        <motion.div
                            className={styles.heroIcon}
                            fill="none" stroke="white"
                            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                            animate={{
                                rotate: [0, 360],
                                scale: [1, 1.15, 1],
                            }}
                            transition={{
                                rotate: { duration: 9, repeat: Infinity, ease: 'linear' },
                                scale:  { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                            }}
                        >
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 3C12 7.97056 16.0294 12 21 12C16.0294 12 12 16.0294 12 21C12 16.0294 7.97056 12 3 12C5.6655 12 8.06036 10.8412 9.70832 9"/>
                            </svg>
                        </motion.div>

                        <motion.h1
                            className={styles.heroTitle}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Recomandări AI<br/>
                            <span className={styles.heroTitleGradient}>Inteligente</span>
                        </motion.h1>

                        <motion.p
                            className={styles.heroSub}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Analizez piața pentru tine și găsesc cele mai bune oferte,
                            fie din catalogul nostru, fie de pe platforme externe
                        </motion.p>

                        <motion.div
                            className={styles.searchRow}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <svg className={styles.searchIconHero} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <circle cx="11" cy="11" r="8"/>
                                <path d="m21 21-4.35-4.35"/>
                            </svg>
                            <input
                                className={styles.searchInput}
                                placeholder="Caută orice produs... (ex: laptop, iPhone, căști)"
                                value={heroQuery}
                                onChange={(e) => setHeroQuery(e.target.value)}
                                onKeyDown={handleHeroKeyDown}
                                autoFocus
                            />
                            <button
                                className={styles.aiBtn}
                                onClick={handleHeroSearch}
                                disabled={!heroQuery.trim()}
                            >
                                <div className={styles.aiBtnGlow} />
                                <div className={styles.aiDot} />
                                Analizează
                            </button>
                        </motion.div>

                        {/* Quick chips */}
                        <motion.div
                            className={styles.chips}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {QUICK_CHIPS.map(chip => (
                                <button
                                    key={chip}
                                    className={styles.chip}
                                    onClick={() => {
                                        setHeroQuery(chip)
                                        performSearch(chip)
                                    }}
                                >
                                    <svg viewBox="-2.4 -2.4 28.80 28.80" width="12" height="12" fill="none">
                                        <path d="M12 3C12 7.97056 16.0294 12 21 12C16.0294 12 12 16.0294 12 21C12 16.0294 7.97056 12 3 12C5.6655 12 8.06036 10.8412 9.70832 9" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                    {chip}
                                </button>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══ LOADING ══ */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        className={styles.loadingSection}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className={styles.loadingCard}>
                            <div className={styles.aiSpinner} />
                            <div className={styles.loadingTitle}>AI-ul caută cele mai bune oferte...</div>
                            <div className={styles.loadingQuery}>"{resultsQuery}"</div>
                            <div className={styles.loadingSteps}>
                                {LOADING_STEPS.map((step, i) => {
                                    const isDone   = currentStep > i + 1
                                    const isActive = currentStep === i + 1
                                    return (
                                        <div key={i} className={`${styles.loadingStep} ${isDone ? styles.loadingStepDone : isActive ? styles.loadingStepActive : ''}`}>
                                            <div className={`${styles.stepDot} ${isDone ? styles.stepDotDone : isActive ? styles.stepDotActive : styles.stepDotIdle}`}>
                                                {isDone ? '✓' : i + 1}
                                            </div>
                                            {step}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══ ERROR ══ */}
            {error && !loading && (
                <div className={styles.resultsPage}>
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>⚠️</div>
                        <h2 className={styles.emptyTitle}>Căutarea a eșuat</h2>
                        <p className={styles.emptySub}>Serviciul AI nu este disponibil. Încearcă din nou.</p>
                        <button className={styles.retryBtn} onClick={() => performSearch(resultsQuery)}>
                            Încearcă din nou
                        </button>
                    </div>
                </div>
            )}

            {/* ══ REZULTATE ══ */}
            {result && !loading && (
                <div className={styles.resultsPage}>

                    <motion.div
                        className={styles.results}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className={styles.queryHeader}>
                            <h2 className={styles.queryTitle}>
                                Rezultate pentru <span>"{result.query}"</span>
                            </h2>

                            <button className={styles.newSearchBtn} onClick={handleNewSearch}>
                                ← Căutare nouă
                            </button>
                        </div>


                        {/* Reasoning */}
                        {result.reasoning && (
                            <div className={styles.aiReasoning}>
                                <div className={styles.aiReasoningIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M12 16v-4M12 8h.01"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className={styles.aiReasoningTitle}>Analiza AI</div>
                                    <div className={styles.aiReasoningText}>{result.reasoning}</div>
                                </div>
                            </div>
                        )}

                        <RecommendBanner />

                        {/* Niciun rezultat */}
                        {result.internalProducts.length === 0 && result.externalProducts.length === 0 && (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>🔍</div>
                                <h2 className={styles.emptyTitle}>Niciun produs găsit</h2>
                                <p className={styles.emptySub}>Încearcă cu alt termen de căutare.</p>
                                <button className={styles.retryBtn} onClick={handleNewSearch}>Căutare nouă</button>
                            </div>
                        )}

                        {/* Produse interne */}
                        {result.internalProducts.length > 0 && (
                            <>
                                <div className={styles.sectionTitle}>📦 Din catalogul TrustCart</div>
                                <div className={styles.internalGrid}>
                                    {result.internalProducts.map((product, i) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.08 }}
                                        >
                                            <div className={styles.internalCard} onClick={() => navigate(`/products/${product.id}`)}>
                                                <span className={styles.internalBadge}>TrustCart</span>
                                                <div className={styles.internalImg}>
                                                    {product.imageUrl ? (
                                                        <img src={product.imageUrl} alt={product.name} />
                                                    ) : (
                                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.2">
                                                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                                                            <circle cx="8.5" cy="8.5" r="1.5"/>
                                                            <path d="m21 15-5-5L5 21"/>
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className={styles.internalInfo}>
                                                    <div className={styles.internalName}>{product.name}</div>
                                                    <div className={styles.internalMeta}>
                                                        {product.category?.name} ·{' '}
                                                        <span style={{ color: product.stock > 0 ? '#10B981' : '#EF4444' }}>
                              {product.stock > 0 ? 'În stoc' : 'Stoc epuizat'}
                            </span>
                                                    </div>
                                                    <div className={styles.internalPrice}>
                                                        {formatPrice(product.price)}{' '}
                                                        <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>RON</span>
                                                    </div>
                                                    <div className={styles.internalPriceSub}>🚚 Livrare gratuită peste 200 RON</div>
                                                    {product.stock > 0 && (
                                                        <button
                                                            className={styles.addToCartBtn}
                                                            onClick={async (e) => {
                                                                e.stopPropagation()
                                                                await addToCart(product.id, 1)
                                                            }}
                                                        >
                                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
                                                                <circle cx="8" cy="21" r="1"/>
                                                                <circle cx="19" cy="21" r="1"/>
                                                                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                                                            </svg>
                                                            Adaugă în coș
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Produse externe */}
                        {result.externalProducts.length > 0 && (
                            <>
                                <div className={styles.sectionTitle}>🌐 De pe platforme externe</div>
                                <div className={styles.externalList}>
                                    {result.externalProducts.map((product, i) => {
                                        const isRecommended =
                                            (result.recommendation === 'external' && i === 0) ||
                                            (result.recommendation === 'both' &&
                                                product.price === cheapestExternal?.price &&
                                                product.priceDifference !== null &&
                                                product.priceDifference < 0)

                                        return (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                <div className={`${styles.externalCard} ${isRecommended ? styles.externalCardRecommended : ''}`}>
                                                    {isRecommended && (
                                                        <div className={styles.recommendedStar}>⭐ Recomandat AI</div>
                                                    )}
                                                    <PlatformBadge platform={product.platform} />
                                                    <div className={styles.externalInfo}>
                                                        <div className={styles.externalName} title={product.name}>
                                                            {product.name}
                                                        </div>
                                                        {product.specs && (
                                                            <div className={styles.externalSpecs}>{product.specs}</div>
                                                        )}
                                                    </div>
                                                    <div className={styles.externalPriceWrap}>
                                                        <div className={styles.externalPrice}>
                                                            {formatPrice(product.price)} RON
                                                        </div>
                                                        <PriceDiff diff={product.priceDifference} pct={product.percentageDifference} />
                                                    </div>

                                                    <a href={product.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.viewBtn}
                                                    onClick={(e) => e.stopPropagation()}
                                                    >
                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                                        <polyline points="15 3 21 3 21 9"/>
                                                        <line x1="10" y1="14" x2="21" y2="3"/>
                                                    </svg>
                                                    Vezi oferta
                                                </a>
                                            </div>
                                    </motion.div>
                                    )
                                    })}
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            )}

        </div>
    )
}