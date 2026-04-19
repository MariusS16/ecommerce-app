import { motion } from 'framer-motion'
import styles from './StaticPage.module.css'

const SECTIONS = [
    {
        title: '1. Acceptarea termenilor',
        content: `Prin accesarea și utilizarea platformei TrustCart, ești de acord cu acești Termeni și Condiții. Dacă nu ești de acord cu acești termeni, te rugăm să nu utilizezi platforma. TrustCart este un proiect educațional dezvoltat în cadrul  Universitatea Națională de Știință și Tehnologie POLITEHNICA București.`,
        notice: true,
    },
    {
        title: '2. Descrierea serviciului',
        content: `TrustCart este o platformă de comerț electronic care oferă atât produse din catalogul propriu, cât și recomandări de produse de pe platforme externe (eMAG, Altex, Flanco) prin intermediul unui sistem bazat pe inteligență artificială. Scopul principal este de a ajuta utilizatorii să ia decizii de cumpărare informate.`,
    },
    {
        title: '3. Contul de utilizator',
        content: `Pentru a beneficia de toate funcționalitățile platformei, este necesară crearea unui cont. Ești responsabil pentru menținerea confidențialității datelor de autentificare și pentru toate activitățile desfășurate prin contul tău. Ne rezervăm dreptul de a suspenda conturile care încalcă acești termeni.`,
    },
    {
        title: '4. Comenzi și plăți',
        content: `Comenzile plasate prin TrustCart sunt supuse disponibilității produselor în stoc. Prețurile afișate includ TVA. Acceptăm plata prin card bancar și ramburs. TrustCart nu stochează datele cardului tău bancar — tranzacțiile sunt procesate securizat.`,
    },
    {
        title: '5. Livrare și returnare',
        content: `Livrarea se efectuează în 2-5 zile lucrătoare pentru produsele din stoc. Produsele pot fi returnate în termen de 14 zile de la primire, în conformitate cu legislația europeană privind drepturile consumatorilor (OUG 34/2014). Costurile de returnare sunt suportate de client, cu excepția cazurilor în care produsul este defect.`,
    },
    {
        title: '6. Proprietatea intelectuală',
        content: `Toate materialele de pe această platformă (cod, design, conținut) sunt proprietatea proiectului TrustCart și sunt protejate de legile drepturilor de autor. Utilizarea neautorizată a acestor materiale este interzisă.`,
    },
    {
        title: '7. Limitarea răspunderii',
        content: `TrustCart nu poate fi ținut responsabil pentru informațiile furnizate de sistemul AI privind prețurile sau disponibilitatea produselor de pe platforme externe. Datele externe sunt furnizate cu titlu informativ și pot varia. Recomandăm verificarea prețurilor direct pe platformele respective înainte de achiziție.`,
    },
    {
        title: '8. Modificări ale termenilor',
        content: `Ne rezervăm dreptul de a modifica acești Termeni și Condiții în orice moment. Modificările vor fi comunicate utilizatorilor prin email sau prin notificare pe platformă. Continuarea utilizării platformei după publicarea modificărilor constituie acceptarea noilor termeni.`,
    },
]

export default function Terms() {
    return (
        <div className={styles.page}>

            <div className={styles.hero}>
                <div className={styles.heroBg} />
                <motion.div
                    className={styles.heroContent}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className={styles.heroBadge}>Legal</div>
                    <h1 className={styles.heroTitle}>
                        <span className={styles.heroGradient}>Termeni și Condiții</span>
                    </h1>
                    <p className={styles.heroSub}>
                        Ultima actualizare: Aprilie 2026
                    </p>
                </motion.div>
            </div>

            <div className={styles.container}>
                <div className={styles.termsLayout}>

                    {/* Sidebar navigare */}
                    <div className={styles.termsSidebar}>
                        <div className={styles.termsSidebarCard}>
                            <div className={styles.termsSidebarTitle}>Cuprins</div>
                            {SECTIONS.map((s, i) => (
                                <a
                                key={i}
                                href={`#section-${i}`}
                                className={styles.termsToc}
                                >
                            {s.title}
                                </a>
                                ))}
                        </div>
                    </div>

                    {/* Conținut */}
                    <div className={styles.termsContent}>
                        {SECTIONS.map((section, i) => (
                            <motion.div
                                key={i}
                                id={`section-${i}`}
                                className={styles.termsSection}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <h2 className={styles.termsSectionTitle}>{section.title}</h2>
                                <p className={styles.termsSectionText}>{section.content}</p>
                                {section.notice && (
                                    <div className={styles.termsNotice}>
                                        ⚠️ <strong>TrustCart este un proiect de licență</strong> realizat la
                                        Facultatea de Automatică și Calculatoare. Nu reprezintă un serviciu comercial real —
                                        nu se pot efectua cumpărături reale, iar datele afișate sunt fictive cu scop
                                        exclusiv demonstrativ.
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
}