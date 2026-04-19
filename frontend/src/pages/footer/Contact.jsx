import { useState } from 'react'
import { motion } from 'framer-motion'
import styles from './StaticPage.module.css'

export default function Contact() {
    const [form, setForm] = useState({
        name: '', email: '', subject: '', message: ''
    })
    const [sent, setSent] = useState(false)

    const handleSubmit = () => {
        if (!form.name || !form.email || !form.message) return
        // Simulăm trimitere
        setSent(true)
    }

    return (
        <div className={styles.page}>

            <div className={styles.hero}>
                <div className={styles.heroBg} />
                <motion.div
                    className={styles.heroContent}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className={styles.heroBadge}>Suntem aici pentru tine</div>
                    <h1 className={styles.heroTitle}>
                        <span className={styles.heroGradient}>Contact</span>
                    </h1>
                    <p className={styles.heroSub}>
                        Ai întrebări sau sugestii? Ne poți contacta oricând.
                    </p>
                </motion.div>
            </div>

            <div className={styles.container}>
                <div className={styles.contactGrid}>

                    {/* Info contact */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className={styles.sectionTitle} style={{ marginBottom: 24 }}>
                            Informații de contact
                        </h2>

                        {[
                            {
                                icon: (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         stroke="#6366F1" strokeWidth="2" strokeLinecap="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                ),
                                label: 'Email',
                                value: 'mariusboss1607@gmail.com',
                            },
                            {
                                icon: (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         stroke="#6366F1" strokeWidth="2" strokeLinecap="round">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                        <polyline points="9 22 9 12 15 12 15 22"/>
                                    </svg>
                                ),
                                label: 'Universitate',
                                value: 'Universitatea Transilvania din Brașov',
                            },
                            {
                                icon: (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         stroke="#6366F1" strokeWidth="2" strokeLinecap="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                        <circle cx="12" cy="10" r="3"/>
                                    </svg>
                                ),
                                label: 'Locație',
                                value: 'Brașov, România',
                            },
                        ].map(item => (
                            <div key={item.label} className={styles.contactItem}>
                                <div className={styles.contactIcon}>{item.icon}</div>
                                <div>
                                    <div className={styles.contactLabel}>{item.label}</div>
                                    <div className={styles.contactValue}>{item.value}</div>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Formular */}
                    <motion.div
                        className={styles.contactForm}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {sent ? (
                            <motion.div
                                className={styles.sentMsg}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                            >
                                <div style={{ fontSize: '3rem', marginBottom: 12 }}>✅</div>
                                <h3>Mesaj trimis!</h3>
                                <p>Îți mulțumim pentru mesaj. Vom reveni cu un răspuns în cel mai scurt timp.</p>
                            </motion.div>
                        ) : (
                            <>
                                <h3 className={styles.formTitle}>Trimite un mesaj</h3>
                                <div className={styles.formGrid}>
                                    <div className={styles.field}>
                                        <label className={styles.label}>Nume complet *</label>
                                        <input className={styles.input}
                                               placeholder="Numele tău"
                                               value={form.name}
                                               onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label className={styles.label}>Email *</label>
                                        <input className={styles.input} type="email"
                                               placeholder="email@exemplu.com"
                                               value={form.email}
                                               onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                        />
                                    </div>
                                    <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                                        <label className={styles.label}>Subiect</label>
                                        <input className={styles.input}
                                               placeholder="Subiectul mesajului"
                                               value={form.subject}
                                               onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                                        />
                                    </div>
                                    <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                                        <label className={styles.label}>Mesaj *</label>
                                        <textarea
                                            className={`${styles.input} ${styles.textarea}`}
                                            placeholder="Scrie mesajul tău..."
                                            value={form.message}
                                            onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <button className={styles.submitBtn} onClick={handleSubmit}>
                                    Trimite mesajul
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                         stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                        <line x1="22" y1="2" x2="11" y2="13"/>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                                    </svg>
                                </button>
                            </>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}