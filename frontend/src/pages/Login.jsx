import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import axiosInstance from '../api/axiosInstance'
import styles from './Login.module.css'

// ── Animații reutilizabile ──

// de jos in sus
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
})

// de stânga la dreapta
const fadeLeft = (delay = 0) => ({
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, delay },
})

// de sus in jos la loop
const floating = {
    animate: {
        y: [-10, 10, -10],
        transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
    },
}

// aceeași animație, dar cu delay diferit pentru fiecare formă geometrică
const floatingDelayed = (delay) => ({
    animate: {
        y: [-10, 10, -10],
        transition: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay },
    },
})

const glowPulse = {
    animate: {
        opacity: [0.5, 1, 0.5],
        transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
}

// ── Panoul stânga — același pentru Login și Register ──
function LeftPanel({ isRegister = false }) {
    const features = [
        {
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                    <path d="M19 3v4M21 5h-4"/>
                </svg>
            ),
            text: 'Recomandări Inteligente',
        },
        {
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
            ),
            text: 'Transparență Totală',
        },
        {
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                    <polyline points="16 7 22 7 22 13"/>
                </svg>
            ),
            text: 'Încredere pe Termen Lung',
        },
    ]

    return (
        <div className={styles.leftPanel}>
            {/* Imagine fundal */}
            <img
                src="https://images.unsplash.com/photo-1689443111384-1cf214df988a?w=800&q=80"
                alt=""
                className={styles.leftBgImage}
            />
            <div className={styles.leftOverlay} />

            {/* Forme geometrice flotante */}
            <motion.div className={styles.shape1} {...floating} />
            <motion.div className={styles.shape2} {...floatingDelayed(1)} />
            <motion.div className={styles.shape3} {...floatingDelayed(0.5)} />

            {/* Conținut */}
            <div className={styles.leftContent}>
                {/* Logo box */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4, type: 'spring' }}
                >
                    <div className={styles.logoBox}>
                        <span className={styles.logoInitials}>TC</span>
                    </div>
                </motion.div>

                {/* Nume + badge */}
                <motion.div {...fadeUp(0.6)}>
                    <h1 className={styles.appName}>TrustCart</h1>
                    <div className={styles.trustedBadge}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                             stroke="white" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        Trusted Advisor
                    </div>
                </motion.div>

                {/* Feature pills */}
                <div className={styles.features}>
                    {features.map((f, i) => (
                        <motion.div
                            key={f.text}
                            className={styles.featurePill}
                            {...fadeLeft(0.8 + i * 0.1)}
                        >
                            <span className={styles.featureIcon}>{f.icon}</span>
                            <span className={styles.featureText}>{f.text}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ── Componenta principală Login ──
export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [errors, setErrors] = useState({})

    const validate = () => {
        const e = {}
        if (!email.trim()) e.email = 'Email-ul este obligatoriu'
        else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Email invalid'
        if (!password) e.password = 'Parola este obligatorie'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        // ↑ Oprește comportamentul default al browserului
        // Fără asta, pagina s-ar reîncărca la submit
        // Echivalent Vue: @submit.prevent
        if (!validate()) return
        setLoading(true)
        setError('')
        try {
            const res = await axiosInstance.post('/api/auth/login', { email, password })
            const { token, email: userEmail, role } = res.data
            login({ email: userEmail, role }, token)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Email sau parolă incorectă')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.page}>
            {/* Blob-uri fundal */}
            <motion.div className={styles.blobBlue} {...glowPulse} />
            <motion.div
                className={styles.blobGreen}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            />

            <motion.div
                className={styles.container}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className={styles.glassCard}>
                    <div className={styles.grid}>

                        {/* Stânga */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <LeftPanel />
                        </motion.div>

                        {/* Dreapta — formular */}
                        <motion.div
                            className={styles.rightPanel}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <motion.div {...fadeUp(0.4)}>
                                <h2 className={styles.formTitle}>Bine ai revenit! 👋</h2>
                                <p className={styles.formSubtitle}>
                                    Autentifică-te pentru a accesa contul tău și recomandările personalizate
                                </p>
                            </motion.div>

                            {error && (
                                <motion.div className={styles.alert} {...fadeUp(0)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" y1="8" x2="12" y2="12"/>
                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                    {error}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit}>
                                //Magia e că **butonul nu apelează direct `handleSubmit`** — în schimb, butonul cu `type="submit"` declanșează evenimentul `onSubmit` al form-ului.

                                {/* Email */}
                                <motion.div className={styles.field} {...fadeLeft(0.5)}>
                                    <label className={styles.label}>Adresă Email</label>
                                    <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </span>
                                        <input
                                            type="email"
                                            placeholder="exemplu@email.com"
                                            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
                                </motion.div>

                                {/* Parolă */}
                                <motion.div className={styles.field} {...fadeLeft(0.6)}>
                                    <label className={styles.label}>Parolă</label>
                                    <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </span>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            className={`${styles.input} ${styles.inputWithEye} ${errors.password ? styles.inputError : ''}`}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className={styles.eyeButton}
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                     stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                                    <line x1="1" y1="1" x2="23" y2="23"/>
                                                </svg>
                                            ) : (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                     stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                    <circle cx="12" cy="12" r="3"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
                                </motion.div>

                                {/* Remember me + Forgot password */}
                                <motion.div className={styles.rowBetween} {...fadeUp(0.7)}>
                                    <label className={styles.rememberMe}>
                                        <input type="checkbox" />
                                        Ține-mă minte
                                    </label>
                                    <a href="#" className={styles.forgotPassword}>Ai uitat parola?</a>
                                </motion.div>

                                {/* Submit */}
                                <motion.div {...fadeUp(0.8)}>
                                    <button
                                        type="submit"
                                        className={styles.submitButton}
                                        disabled={loading}
                                    >
                                        {loading && <span className={styles.spinner} />}
                                        {loading ? 'Se autentifică...' : 'Autentificare'}
                                    </button>
                                </motion.div>

                            </form>

                            {/* Switch la register */}
                            <motion.p className={styles.switchText} {...fadeUp(0.9)}>
                                Nu ai cont?{' '}
                                <button className={styles.switchLink} onClick={() => navigate('/register')}>
                                    Înregistrează-te
                                </button>
                            </motion.p>

                            {/* Back to home */}
                            <motion.div className={styles.backHome} {...fadeUp(1.1)}>
                                <button className={styles.backHomeBtn} onClick={() => navigate('/')}>
                                    ← Înapoi la pagina principală
                                </button>
                            </motion.div>

                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}