import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './NotFound.module.css'

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className={styles.page}>
            <motion.div
                className={styles.content}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Numărul 404 animat */}
                <div className={styles.errorCode}>
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    >
                        4
                    </motion.span>
                    <motion.div
                        className={styles.zeroWrap}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
                    >
                        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                            <circle cx="60" cy="60" r="54"
                                    stroke="url(#grad404)" strokeWidth="8" fill="none"/>
                            <circle cx="60" cy="60" r="18" fill="url(#grad404)" opacity="0.15"/>
                            <defs>
                                <linearGradient id="grad404" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#6366F1"/>
                                    <stop offset="100%" stopColor="#10B981"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </motion.div>
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                    >
                        4
                    </motion.span>
                </div>

                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Pagina nu a fost găsită
                </motion.h1>

                <motion.p
                    className={styles.sub}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Se pare că pagina pe care o cauți nu există sau a fost mutată.
                    <br/>Nu-ți face griji, te putem ajuta să ajungi unde trebuie!
                </motion.p>

                <motion.div
                    className={styles.actions}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <button
                        className={styles.btnPrimary}
                        onClick={() => navigate('/')}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                             stroke="white" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                            <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                        Înapoi acasă
                    </button>
                    <button
                        className={styles.btnOutline}
                        onClick={() => navigate('/products')}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                        Caută produse
                    </button>
                </motion.div>

                {/* Linkuri rapide */}
                <motion.div
                    className={styles.quickLinks}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    <span className={styles.quickLinksLabel}>Pagini populare:</span>
                    {[
                        { label: 'Produse', path: '/products' },
                        { label: 'AI Recomandări', path: '/recommendations' },
                        { label: 'Contul meu', path: '/account' },
                        { label: 'Comenzile mele', path: '/orders' },
                    ].map(link => (
                        <button
                            key={link.path}
                            className={styles.quickLink}
                            onClick={() => navigate(link.path)}
                        >
                            {link.label}
                        </button>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    )
}