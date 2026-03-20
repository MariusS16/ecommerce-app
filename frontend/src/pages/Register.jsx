// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../hooks/useAuth'
// import axiosInstance from '../api/axiosInstance'
// import styles from './Login.module.css'
// // Refolosim același CSS — același design, câmpuri în plus
//
// export default function Register() {
//     const navigate = useNavigate()
//     const { login } = useAuth()
//
//     const [form, setForm] = useState({
//         firstName: '',
//         lastName: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//     })
//
//     const [showPassword, setShowPassword] = useState(false)
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//     const [loading, setLoading] = useState(false)
//     const [error, setError] = useState('')
//     const [errors, setErrors] = useState({})
//
//     // Handler generic pentru toate câmpurile
//     // În loc de câte un setter per câmp, folosim un singur handler
//     const handleChange = (e) => {
//         const { name, value } = e.target
//         setForm(prev => ({ ...prev, [name]: value }))
//         // Șterge eroarea câmpului când userul începe să scrie
//         if (errors[name]) {
//             setErrors(prev => ({ ...prev, [name]: '' }))
//         }
//     }
//
//     const validate = () => {
//         const newErrors = {}
//         if (!form.firstName.trim()) newErrors.firstName = 'Prenumele este obligatoriu'
//         if (!form.lastName.trim()) newErrors.lastName = 'Numele este obligatoriu'
//         if (!form.email.trim()) newErrors.email = 'Email-ul este obligatoriu'
//         else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email invalid'
//         if (!form.password) newErrors.password = 'Parola este obligatorie'
//         else if (form.password.length < 6) newErrors.password = 'Minim 6 caractere'
//         if (!form.confirmPassword) newErrors.confirmPassword = 'Confirmă parola'
//         else if (form.password !== form.confirmPassword) {
//             newErrors.confirmPassword = 'Parolele nu coincid'
//         }
//         setErrors(newErrors)
//         return Object.keys(newErrors).length === 0
//     }
//
//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         if (!validate()) return
//
//         setLoading(true)
//         setError('')
//
//         try {
//             const response = await axiosInstance.post('/api/auth/register', {
//                 firstName: form.firstName,
//                 lastName: form.lastName,
//                 email: form.email,
//                 password: form.password,
//             })
//
//             const { token, email: userEmail, role } = response.data
//             login({ email: userEmail, role }, token)
//             navigate('/')
//         } catch (err) {
//             setError(err.response?.data?.message || 'A apărut o eroare. Încearcă din nou.')
//         } finally {
//             setLoading(false)
//         }
//     }
//
//     return (
//         <div className={styles.page}>
//             <div className={styles.card}>
//
//                 {/* ── Panoul stânga ── */}
//                 <div className={styles.leftPanel}>
//                     <div className={styles.circle1} />
//                     <div className={styles.circle2} />
//                     <div className={styles.circle3} />
//
//                     <div className={styles.logoTag}>
//                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
//                              stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                             <circle cx="8" cy="21" r="1"/>
//                             <circle cx="19" cy="21" r="1"/>
//                             <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
//                         </svg>
//                         <span className={styles.logoTagText}>TrustCart</span>
//                     </div>
//
//                     <div className={styles.floatingCard}>
//                         <div className={styles.floatingCardIcon}>
//                             <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
//                                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                 <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
//                             </svg>
//                         </div>
//                         <p className={styles.floatingCardTitle}>Alătură-te acum</p>
//                         <p className={styles.floatingCardDesc}>
//                             Wishlist, comenzi și recomandări AI personalizate
//                         </p>
//                         <div className={styles.floatingCardDivider} />
//                         {[
//                             'Cont gratuit pe viață',
//                             'Recomandări AI incluse',
//                             'Prețuri transparente',
//                         ].map((item) => (
//                             <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
//                                 <div style={{
//                                     width: 18, height: 18,
//                                     background: 'rgba(255,255,255,0.2)',
//                                     borderRadius: '50%',
//                                     display: 'flex', alignItems: 'center', justifyContent: 'center',
//                                     flexShrink: 0,
//                                 }}>
//                                     <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
//                                          stroke="white" strokeWidth="3" strokeLinecap="round">
//                                         <polyline points="20 6 9 17 4 12"/>
//                                     </svg>
//                                 </div>
//                                 <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.85)' }}>{item}</span>
//                             </div>
//                         ))}
//                     </div>
//
//                     <p className={styles.leftBottom}>
//                         Cel mai transparent marketplace din România
//                     </p>
//                 </div>
//
//                 {/* ── Panoul dreapta ── */}
//                 <div className={styles.rightPanel}>
//                     <div className={styles.form}>
//                         <h1 className={styles.formTitle}>Creează cont</h1>
//                         <p className={styles.formSubtitle}>Completează datele de mai jos</p>
//
//                         {error && (
//                             <div className={styles.alert}>
//                                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
//                                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
//                                     <circle cx="12" cy="12" r="10"/>
//                                     <line x1="12" y1="8" x2="12" y2="12"/>
//                                     <line x1="12" y1="16" x2="12.01" y2="16"/>
//                                 </svg>
//                                 {error}
//                             </div>
//                         )}
//
//                         <form onSubmit={handleSubmit}>
//
//                             {/* Prenume + Nume */}
//                             <div className={styles.nameGrid}>
//                                 <div>
//                                     <label className={styles.label}>Prenume</label>
//                                     <input
//                                         type="text"
//                                         name="firstName"
//                                         placeholder="Marius"
//                                         className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
//                                         value={form.firstName}
//                                         onChange={handleChange}
//                                     />
//                                     {errors.firstName && (
//                                         <p className={styles.errorMessage}>{errors.firstName}</p>
//                                     )}
//                                 </div>
//                                 <div>
//                                     <label className={styles.label}>Nume</label>
//                                     <input
//                                         type="text"
//                                         name="lastName"
//                                         placeholder="Ionescu"
//                                         className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
//                                         value={form.lastName}
//                                         onChange={handleChange}
//                                     />
//                                     {errors.lastName && (
//                                         <p className={styles.errorMessage}>{errors.lastName}</p>
//                                     )}
//                                 </div>
//                             </div>
//
//                             {/* Email */}
//                             <div className={styles.field}>
//                                 <label className={styles.label}>Email</label>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     placeholder="marius@example.com"
//                                     className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
//                                     value={form.email}
//                                     onChange={handleChange}
//                                 />
//                                 {errors.email && (
//                                     <p className={styles.errorMessage}>{errors.email}</p>
//                                 )}
//                             </div>
//
//                             {/* Parolă */}
//                             <div className={styles.field}>
//                                 <label className={styles.label}>Parolă</label>
//                                 <div className={styles.inputWrapper}>
//                                     <input
//                                         type={showPassword ? 'text' : 'password'}
//                                         name="password"
//                                         placeholder="Minim 6 caractere"
//                                         className={`${styles.input} ${styles.inputWithIcon} ${errors.password ? styles.inputError : ''}`}
//                                         value={form.password}
//                                         onChange={handleChange}
//                                     />
//                                     <button type="button" className={styles.eyeButton}
//                                             onClick={() => setShowPassword(!showPassword)}>
//                                         {showPassword ? (
//                                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
//                                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//                                                 <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
//                                                 <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
//                                                 <line x1="1" y1="1" x2="23" y2="23"/>
//                                             </svg>
//                                         ) : (
//                                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
//                                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//                                                 <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
//                                                 <circle cx="12" cy="12" r="3"/>
//                                             </svg>
//                                         )}
//                                     </button>
//                                 </div>
//                                 {errors.password && (
//                                     <p className={styles.errorMessage}>{errors.password}</p>
//                                 )}
//                             </div>
//
//                             {/* Confirmă parola */}
//                             <div className={styles.field}>
//                                 <label className={styles.label}>Confirmă parola</label>
//                                 <div className={styles.inputWrapper}>
//                                     <input
//                                         type={showConfirmPassword ? 'text' : 'password'}
//                                         name="confirmPassword"
//                                         placeholder="Repetă parola"
//                                         className={`${styles.input} ${styles.inputWithIcon} ${errors.confirmPassword ? styles.inputError : ''}`}
//                                         value={form.confirmPassword}
//                                         onChange={handleChange}
//                                     />
//                                     <button type="button" className={styles.eyeButton}
//                                             onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
//                                         {showConfirmPassword ? (
//                                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
//                                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//                                                 <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
//                                                 <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
//                                                 <line x1="1" y1="1" x2="23" y2="23"/>
//                                             </svg>
//                                         ) : (
//                                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
//                                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//                                                 <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
//                                                 <circle cx="12" cy="12" r="3"/>
//                                             </svg>
//                                         )}
//                                     </button>
//                                 </div>
//                                 {errors.confirmPassword && (
//                                     <p className={styles.errorMessage}>{errors.confirmPassword}</p>
//                                 )}
//                             </div>
//
//                             <button
//                                 type="submit"
//                                 className={styles.submitButton}
//                                 disabled={loading}
//                             >
//                                 {loading && <span className={styles.spinner} />}
//                                 {loading ? 'Se creează contul...' : 'Creează cont'}
//                             </button>
//
//                         </form>
//
//                         <p className={styles.switchText}>
//                             Ai deja cont?{' '}
//                             <button className={styles.switchLink} onClick={() => navigate('/login')}>
//                                 Autentifică-te
//                             </button>
//                         </p>
//                     </div>
//                 </div>
//
//             </div>
//         </div>
//     )
// }

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import axiosInstance from '../api/axiosInstance'
import styles from './Login.module.css'

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
})

const fadeLeft = (delay = 0) => ({
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, delay },
})

const floating = {
    animate: {
        y: [-10, 10, -10],
        transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
    },
}

const floatingDelayed = (delay) => ({
    animate: {
        y: [-10, 10, -10],
        transition: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay },
    },
})

// ── Panoul stânga pentru Register ──
function LeftPanelRegister() {
    const benefits = [
        'Cont gratuit pe viață',
        'Recomandări AI incluse',
        'Prețuri transparente',
        'Wishlist și comenzi salvate',
    ]

    return (
        <div className={styles.leftPanel}>
            <img
                src="https://images.unsplash.com/photo-1689443111384-1cf214df988a?w=800&q=80"
                alt=""
                className={styles.leftBgImage}
            />
            <div className={styles.leftOverlay} />

            <motion.div className={styles.shape1} {...floating} />
            <motion.div className={styles.shape2} {...floatingDelayed(1)} />
            <motion.div className={styles.shape3} {...floatingDelayed(0.5)} />

            <div className={styles.leftContent}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4, type: 'spring' }}
                >
                    <div className={styles.logoBox}>
                        <span className={styles.logoInitials}>TC</span>
                    </div>
                </motion.div>

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

                <div className={styles.features}>
                    {benefits.map((b, i) => (
                        <motion.div
                            key={b}
                            className={styles.featurePill}
                            {...fadeLeft(0.8 + i * 0.1)}
                        >
              <span className={styles.featureIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
                            <span className={styles.featureText}>{b}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function Register() {
    const navigate = useNavigate()
    const { login } = useAuth()

    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '',
        password: '', confirmPassword: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        // ↑ name = atributul name al input-ului (ex: "firstName")
        // ↑ value = ce a scris userul
        setForm(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
        // ↑ prev = starea anterioară a obiectului form
        // ...prev = copiază toate câmpurile existente
        // [name]: value = suprascrie doar câmpul modificat
        // Exemplu: dacă name="email", actualizează doar form.email
    }

    const validate = () => {
        const e = {}
        if (!form.firstName.trim()) e.firstName = 'Obligatoriu'
        if (!form.lastName.trim()) e.lastName = 'Obligatoriu'
        if (!form.email.trim()) e.email = 'Email-ul este obligatoriu'
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalid'
        if (!form.password) e.password = 'Parola este obligatorie'
        else if (form.password.length < 6) e.password = 'Minim 6 caractere'
        if (!form.confirmPassword) e.confirmPassword = 'Confirmă parola'
        else if (form.password !== form.confirmPassword) e.confirmPassword = 'Parolele nu coincid'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        if (!validate()) return
        setLoading(true)
        setError('')
        try {
            const res = await axiosInstance.post('/api/auth/register', {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                password: form.password,
            })
            const { token, email: userEmail, role } = res.data
            login({ email: userEmail, role }, token)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'A apărut o eroare. Încearcă din nou.')
        } finally {
            setLoading(false)
        }
    }

    // Icon ochi refolosit
    const EyeIcon = ({ visible }) => visible ? (
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
    )

    return (
        <div className={styles.page}>
            <motion.div
                className={styles.blobBlue}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
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

                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <LeftPanelRegister />
                        </motion.div>

                        <motion.div
                            className={styles.rightPanel}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <motion.div {...fadeUp(0.4)}>
                                <h2 className={styles.formTitle}>Creează cont</h2>
                                <p className={styles.formSubtitle}>Completează datele de mai jos pentru a începe</p>
                            </motion.div>

                            {error && (
                                <div className={styles.alert}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" y1="8" x2="12" y2="12"/>
                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>

                                {/* Prenume + Nume */}
                                <motion.div className={styles.nameGrid} {...fadeLeft(0.5)}>
                                    <div>
                                        <label className={styles.label}>Prenume</label>
                                        <input
                                            type="text" name="firstName" placeholder="Marius"
                                            className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                                            style={{ paddingLeft: '14px' }}
                                            value={form.firstName} onChange={handleChange}
                                        />
                                        {errors.firstName && <p className={styles.errorMessage}>{errors.firstName}</p>}
                                    </div>
                                    <div>
                                        <label className={styles.label}>Nume</label>
                                        <input
                                            type="text" name="lastName" placeholder="Ionescu"
                                            className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                                            style={{ paddingLeft: '14px' }}
                                            value={form.lastName} onChange={handleChange}
                                        />
                                        {errors.lastName && <p className={styles.errorMessage}>{errors.lastName}</p>}
                                    </div>
                                </motion.div>

                                {/* Email */}
                                <motion.div className={styles.field} {...fadeLeft(0.6)}>
                                    <label className={styles.label}>Email</label>
                                    <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </span>
                                        <input
                                            type="email" name="email" placeholder="marius@example.com"
                                            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                                            value={form.email} onChange={handleChange}
                                        />
                                    </div>
                                    {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
                                </motion.div>

                                {/* Parolă */}
                                <motion.div className={styles.field} {...fadeLeft(0.7)}>
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
                                            name="password" placeholder="Minim 6 caractere"
                                            className={`${styles.input} ${styles.inputWithEye} ${errors.password ? styles.inputError : ''}`}
                                            value={form.password} onChange={handleChange}
                                        />
                                        <button type="button" className={styles.eyeButton}
                                                onClick={() => setShowPassword(!showPassword)}>
                                            <EyeIcon visible={showPassword} />
                                        </button>
                                    </div>
                                    {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
                                </motion.div>

                                {/* Confirmă parola */}
                                <motion.div className={styles.field} {...fadeLeft(0.8)}>
                                    <label className={styles.label}>Confirmă parola</label>
                                    <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </span>
                                        <input
                                            type={showConfirm ? 'text' : 'password'}
                                            name="confirmPassword" placeholder="Repetă parola"
                                            className={`${styles.input} ${styles.inputWithEye} ${errors.confirmPassword ? styles.inputError : ''}`}
                                            value={form.confirmPassword} onChange={handleChange}
                                        />
                                        <button type="button" className={styles.eyeButton}
                                                onClick={() => setShowConfirm(!showConfirm)}>
                                            <EyeIcon visible={showConfirm} />
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <p className={styles.errorMessage}>{errors.confirmPassword}</p>}
                                </motion.div>

                                {/* Submit */}
                                <motion.div {...fadeUp(0.9)}>
                                    <button type="submit" className={styles.submitButton} disabled={loading}>
                                        {loading && <span className={styles.spinner} />}
                                        {loading ? 'Se creează contul...' : 'Creează cont'}
                                    </button>
                                </motion.div>

                            </form>

                            <motion.p className={styles.switchText} {...fadeUp(1.0)}>
                                Ai deja cont?{' '}
                                <button className={styles.switchLink} onClick={() => navigate('/login')}>
                                    Autentifică-te
                                </button>
                            </motion.p>

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