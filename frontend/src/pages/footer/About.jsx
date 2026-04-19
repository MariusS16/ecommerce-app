import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './StaticPage.module.css'

export default function About() {
    const navigate = useNavigate()

    return (
        <div className={styles.page}>

            {/* Hero */}
            <div className={styles.hero}>
                <div className={styles.heroBg} />
                <motion.div
                    className={styles.heroContent}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className={styles.heroBadge}>Despre proiect</div>
                    <h1 className={styles.heroTitle}>
                        TrustCart <br/>
                        <span className={styles.heroGradient}>Transparență în e-commerce</span>
                    </h1>
                    <p className={styles.heroSub}>
                        O platformă care nu doar vinde, ci și recomandă sincer —
                        chiar și concurența, dacă oferă o valoare mai bună.
                    </p>
                </motion.div>
            </div>

            <div className={styles.container}>

                {/* Despre proiect */}
                <motion.section
                    className={styles.section}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                >
                    <div className={styles.sectionGrid}>
                        <div>
                            <div className={styles.sectionBadge}>Contextul proiectului</div>
                            <h2 className={styles.sectionTitle}>Ce este TrustCart?</h2>
                            <p className={styles.sectionText}>
                                TrustCart este o aplicație web de comerț electronic dezvoltată
                                ca proiect de licență la <strong>Universitatea Națională de Știință și Tehnologie POLITEHNICA București</strong>,
                                Facultatea de Automatică și Calculatoare.
                            </p>
                            <div className={styles.inlineNotice}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     style={{ flexShrink: 0, marginTop: 1 }}>
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="8" x2="12" y2="12"/>
                                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                                <span>
                                <strong>Acesta nu este un magazin online real.</strong> TrustCart este
                                        un proiect academic cu scop demonstrativ — produsele, prețurile și
                                        comenzile sunt fictive și nu implică tranzacții financiare reale.
                                </span>
                            </div>
                            <p className={styles.sectionText}>
                                Conceptul central al platformei este acela de <strong>"consilier de încredere"</strong> —
                                spre deosebire de magazinele online tradiționale care se concentrează exclusiv
                                pe vânzarea propriilor produse, TrustCart integrează un sistem de recomandări
                                bazat pe inteligență artificială care compară prețurile și disponibilitatea
                                produselor atât din catalogul intern, cât și de pe platforme externe precum
                                eMAG, Altex și Flanco.
                            </p>
                        </div>
                        <div className={styles.sectionVisual}>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon} style={{ background: '#EEF2FF' }}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                         stroke="#6366F1" strokeWidth="2" strokeLinecap="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className={styles.featureTitle}>Transparență totală</div>
                                    <div className={styles.featureDesc}>
                                        Recomandăm sincer, chiar și concurența
                                    </div>
                                </div>
                            </div>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon} style={{ background: '#F0FDF4' }}>
                                    <svg viewBox="-2.4 -2.4 28.80 28.80" width="22" height="22" fill="none">
                                        <path d="M12 3C12 7.97056 16.0294 12 21 12C16.0294 12 12 16.0294 12 21C12 16.0294 7.97056 12 3 12C5.6655 12 8.06036 10.8412 9.70832 9"
                                              stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className={styles.featureTitle}>Powered by AI</div>
                                    <div className={styles.featureDesc}>
                                        Perplexity API pentru căutare în timp real
                                    </div>
                                </div>
                            </div>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon} style={{ background: '#FFFBEB' }}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                         stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" y1="8" x2="12" y2="12"/>
                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className={styles.featureTitle}>Decizii informate</div>
                                    <div className={styles.featureDesc}>
                                        Comparație reală de prețuri și specificații
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Stack tehnic */}
                <motion.section
                    className={styles.section}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                >
                    <div className={styles.sectionBadge}>Tehnologii folosite</div>
                    <h2 className={styles.sectionTitle}>Stack tehnic</h2>
                    <div className={styles.techGrid}>
                        {[
                            { name: 'Kotlin + Spring Boot',  role: 'Backend',    color: '#EEF2FF', tc: '#6366F1' },
                            { name: 'React 18 + Vite',        role: 'Frontend',   color: '#F0FDF4', tc: '#10B981' },
                            { name: 'PostgreSQL',             role: 'Baza de date', color: '#FFFBEB', tc: '#F59E0B' },
                            { name: 'Perplexity API',         role: 'AI / ML',    color: '#FDF4FF', tc: '#A855F7' },
                            { name: 'Spring Security + JWT',  role: 'Securitate', color: '#FEF2F2', tc: '#EF4444' },
                            { name: 'Docker',                 role: 'DevOps',     color: '#F0F9FF', tc: '#0EA5E9' },
                        ].map(tech => (
                            <div key={tech.name} className={styles.techCard}
                                 style={{ background: tech.color }}>
                                <div className={styles.techName}>{tech.name}</div>
                                <div className={styles.techRole}
                                     style={{ color: tech.tc }}>{tech.role}</div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Despre autor */}
                <motion.section
                    className={`${styles.section} ${styles.authorSection}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                >
                    <div className={styles.authorCard}>
                        <img
                            src="https://lh3.googleusercontent.com/a/ACg8ocKCnL0okH_ILKjnQXc_RO0ZvxS8zTqD37fykl2P6H6aYg3QfcNx=s360-c-no"
                            alt="Marius Slincu"
                            className={styles.authorPhoto}
                        />
                        <div className={styles.authorInfo}>
                            <div className={styles.authorBadge}>Autor proiect</div>
                            <h3 className={styles.authorName}>Marius Slincu</h3>
                            <p className={styles.authorDesc}>
                                Student în anul IV la Facultatea de Automatică și Calculatoare -
                                UNSTPB, specializarea CTI.
                                TrustCart reprezintă lucrarea de licență, un proiect full-stack
                                care combină dezvoltarea modernă de aplicații web cu tehnici
                                avansate de integrare AI.
                            </p>
                            <div className={styles.authorTags}>
                                <span>Full-Stack Developer</span>
                                <span>Kotlin</span>
                                <span>React</span>
                                <span>AI Integration</span>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* CTA */}
                <motion.section
                    className={styles.ctaSection}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <h2 className={styles.ctaTitle}>
                        Încearcă TrustCart acum
                    </h2>
                    <p className={styles.ctaSub}>
                        Descoperă cum AI-ul te poate ajuta să iei decizii mai bune de cumpărare
                    </p>
                    <div className={styles.ctaActions}>
                        <button className={styles.ctaBtnPrimary}
                                onClick={() => navigate('/recommendations')}>
                            Caută cu AI
                        </button>
                        <button className={styles.ctaBtnOutline}
                                onClick={() => navigate('/products')}>
                            Explorează produsele
                        </button>
                    </div>
                </motion.section>

            </div>
        </div>
    )
}