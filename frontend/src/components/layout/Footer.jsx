// import { useNavigate } from 'react-router-dom'
// import styles from './Footer.module.css'
//
// export default function Footer() {
//     const navigate = useNavigate()
//
//     return (
//         <footer className={styles.footer}>
//             <div className={styles.footerContent}>
//
//                 <div className={styles.footerGrid}>
//
//                     {/* Coloana 1 — Brand */}
//                     <div className={styles.brandCol}>
//                         <div className={styles.logo} onClick={() => navigate('/')}>
//                             <span className={styles.logoShop}>Trust</span>
//                             <span className={styles.logoAdvisor}>Cart</span>
//                         </div>
//                         <p className={styles.brandDescription}>
//                             Platforma ta de e-commerce inteligentă. Găsim cele mai bune
//                             oferte din catalogul nostru și de pe platformele externe —
//                             transparent și corect.
//                         </p>
//                         <div className={styles.socialLinks}>
//
//                             <a href="https://github.com/MariusS16"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className={styles.socialButton}
//                             >
//                             <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//                                 <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
//                             </svg>
//                         </a>
//
//                         <a href="https://www.linkedin.com/in/mariusslincu"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className={styles.socialButton}
//                         >
//                         <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//                             <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
//                         </svg>
//                     </a>
//                 </div>
//             </div>
//
//             {/* Coloana 2 — Produse */}
//             <div className={styles.linkCol}>
//                 <p className={styles.colTitle}>Produse</p>
//                 <div className={styles.footerLinks}>
//                     <button className={styles.footerLink} onClick={() => navigate('/products')}>
//                         Toate produsele
//                     </button>
//                     <button className={styles.footerLink} onClick={() => navigate('/products')}>
//                         Categorii
//                     </button>
//                     <button className={styles.footerLink} onClick={() => navigate('/recommendations')}>
//                         ✨ AI Recommendations
//                     </button>
//                 </div>
//             </div>
//
//             {/* Coloana 3 — Cont */}
//             <div className={styles.linkCol}>
//                 <p className={styles.colTitle}>Contul meu</p>
//                 <div className={styles.footerLinks}>
//                     <button className={styles.footerLink} onClick={() => navigate('/login')}>
//                         Login
//                     </button>
//                     <button className={styles.footerLink} onClick={() => navigate('/register')}>
//                         Înregistrare
//                     </button>
//                     <button className={styles.footerLink} onClick={() => navigate('/orders')}>
//                         Comenzile mele
//                     </button>
//                     <button className={styles.footerLink} onClick={() => navigate('/wishlist')}>
//                         Wishlist
//                     </button>
//                 </div>
//             </div>
//
//             {/* Coloana 4 — Informații */}
//             <div className={styles.linkCol}>
//                 <p className={styles.colTitle}>Informații</p>
//                 <div className={styles.footerLinks}>
//                     <button className={styles.footerLink} onClick={() => navigate('/about')}>
//                         Despre noi
//                     </button>
//                     <button className={styles.footerLink} onClick={() => navigate('/contact')}>
//                         Contact
//                     </button>
//                     <button className={styles.footerLink} onClick={() => navigate('/terms')}>
//                         Termeni și condiții
//                     </button>
//                     <button className={styles.footerLink} onClick={() => navigate('/privacy')}>
//                         Politica de confidențialitate
//                     </button>
//                 </div>
//             </div>
//
//         </div>
//
//     {/* Rândul de jos */}
//     <div className={styles.footerBottom}>
//         <p className={styles.copyright}>
//             © 2026 TrustCart. Toate drepturile rezervate.
//         </p>
//         <p className={styles.copyright}>
//             Proiect licență · Universitatea Națională de Știință și Tehnologie POLITEHNICA București
//         </p>
//     </div>
//
// </div>
// </footer>
// )
// }

import { useNavigate } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
    const navigate = useNavigate()
    const year = new Date().getFullYear()

    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>

                {/* ── Coloana Brand ── */}
                <div className={styles.brandCol}>
                    <div className={styles.logo} onClick={() => navigate('/')}>
                        <span className={styles.logoTrust}>Trust</span>
                        <span className={styles.logoCart}>Cart</span>
                    </div>

                    <p className={styles.brandDesc}>
                        Platforma ta de e-commerce inteligentă. Găsim cele mai bune
                        oferte din catalogul nostru și de pe platformele externe —
                        transparent și corect.
                    </p>

                    {/* AI Badge */}
                    <div className={styles.aiBadge}>
                        <svg viewBox="-2.4 -2.4 28.80 28.80" width="13" height="13" fill="none">
                            <path
                                d="M12 3C12 7.97056 16.0294 12 21 12C16.0294 12 12 16.0294 12 21C12 16.0294 7.97056 12 3 12C5.6655 12 8.06036 10.8412 9.70832 9"
                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                            />
                        </svg>
                        Powered by AI
                    </div>

                    {/* Social links din footer-ul existent */}
                    <div className={styles.socialLinks}>

                        <a href="https://github.com/MariusS16"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialBtn}
                        title="GitHub"
                        >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                        </svg>
                    </a>


                    <a href="https://www.linkedin.com/in/mariusslincu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialBtn}
                    title="LinkedIn"
                    >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                </a>
            </div>

            <p className={styles.uniInfo}>
                Proiect licență · Universitatea Națională de Știință și Tehnologie POLITEHNICA București
            </p>
        </div>

    {/* ── Coloana Produse ── */}
    <div className={styles.linkCol}>
        <h4 className={styles.colTitle}>Produse</h4>
        <ul className={styles.linkList}>
            <li>
                <button className={styles.footerLink}
                        onClick={() => navigate('/products')}>
                    Toate produsele
                </button>
            </li>
            <li>
                <button className={styles.footerLink}
                        onClick={() => navigate('/products')}>
                    Categorii
                </button>
            </li>
            <li>
                <button className={styles.footerLink}
                        onClick={() => navigate('/recommendations')}>
                    AI Recomandări ✨
                </button>
            </li>
        </ul>
    </div>

    {/* ── Coloana Cont ── */}
    <div className={styles.linkCol}>
        <h4 className={styles.colTitle}>Contul meu</h4>
        <ul className={styles.linkList}>
            <li>
                <button className={styles.footerLink}
                        onClick={() => navigate('/login')}>
                    Autentificare
                </button>
            </li>
            <li>
                <button className={styles.footerLink}
                        onClick={() => navigate('/register')}>
                    Înregistrare
                </button>
            </li>
            <li>
                <button className={styles.footerLink}
                        onClick={() => navigate('/orders')}>
                    Comenzile mele
                </button>
            </li>
            <li>
                <button className={styles.footerLink}
                        onClick={() => navigate('/wishlist')}>
                    Wishlist
                </button>
            </li>
        </ul>
    </div>

    {/* ── Coloana Informații ── */}
    <div className={styles.linkCol}>
        <h4 className={styles.colTitle}>Informații</h4>
        <ul className={styles.linkList}>
            <li>
                <button className={styles.footerLink}
                        onClick={() => navigate('/about')}>
                    Despre noi
                </button>
            </li>
            <li>
                <button className={styles.footerLink}
                        onClick={() => navigate('/contact')}>
                    Contact
                </button>
            </li>
            <li>
                <button className={styles.footerLink}
                        onClick={() => navigate('/terms')}>
                    Termeni și condiții
                </button>
            </li>
            <li>
                <button className={styles.footerLink}
                        onClick={() => navigate('/privacy')}>
                    Politica de confidențialitate
                </button>
            </li>
        </ul>
    </div>

</div>

    {/* ── Bottom bar ── */}
    <div className={styles.bottomBar}>
        <div className={styles.bottomInner}>
            <span>© {year} TrustCart. Toate drepturile rezervate.</span>
            <div className={styles.bottomLinks}>
                <button className={styles.bottomLink}
                        onClick={() => navigate('/terms')}>
                    Termeni
                </button>
                <button className={styles.bottomLink}
                        onClick={() => navigate('/privacy')}>
                    Confidențialitate
                </button>
                <button className={styles.bottomLink}
                        onClick={() => navigate('/contact')}>
                    Contact
                </button>
            </div>
        </div>
    </div>
</footer>
)
}