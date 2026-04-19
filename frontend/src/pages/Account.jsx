import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axiosInstance from '../api/axiosInstance'
import { useWishlist } from '../hooks/useWishlist'
import AccountLayout from '../components/layout/AccountLayout'
import styles from './Account.module.css'

// ── Calculare putere parolă ──
const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' }
    let score = 0
    if (password.length >= 6)  score++
    if (password.length >= 10) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score <= 1) return { score, label: 'Foarte slabă', color: '#EF4444' }
    if (score === 2) return { score, label: 'Slabă',        color: '#F97316' }
    if (score === 3) return { score, label: 'Bună',         color: '#F59E0B' }
    if (score === 4) return { score, label: 'Puternică',    color: '#10B981' }
    return              { score, label: 'Foarte puternică', color: '#059669' }
}

export default function Account() {
    // ── State profil ──
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [form, setForm]       = useState({
        firstName: '', lastName: '', phoneNumber: ''
    })
    const [saving, setSaving]   = useState(false)
    const [profileMsg, setProfileMsg] = useState(null)
    // profileMsg = { type: 'success'|'error', text: '...' }

    // ── State comenzi (pt statistici) ──
    const [ordersCount, setOrdersCount] = useState(0)

    // ── Wishlist ──
    const { wishlistCount } = useWishlist()

    // ── AI searches — din localStorage ──
    const aiSearches = parseInt(localStorage.getItem('ai_search_count') || '0')

    // ── State modal parolă ──
    const [showPassModal, setShowPassModal] = useState(false)
    const [passForm, setPassForm] = useState({
        currentPassword: '', newPassword: '', confirmPassword: ''
    })
    const [passMsg,   setPassMsg]   = useState(null)
    const [changingPass, setChangingPass] = useState(false)
    const [showCurrentPw, setShowCurrentPw] = useState(false)
    const [showNewPw,     setShowNewPw]     = useState(false)

    const strength = getPasswordStrength(passForm.newPassword)

    // ── Fetch date la mount ──
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, ordersRes] = await Promise.all([
                    axiosInstance.get('/api/users/me'),
                    axiosInstance.get('/api/orders'),
                ])
                setProfile(profileRes.data)
                setForm({
                    firstName:   profileRes.data.firstName,
                    lastName:    profileRes.data.lastName,
                    phoneNumber: profileRes.data.phoneNumber || '',
                })
                setOrdersCount(ordersRes.data.length)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // ── Salvare profil ──
    const handleSaveProfile = async () => {
        setSaving(true)
        setProfileMsg(null)
        try {
            const res = await axiosInstance.put('/api/users/me', {
                firstName:   form.firstName   || null,
                lastName:    form.lastName    || null,
                phoneNumber: form.phoneNumber || null,
            })
            setProfile(res.data)
            setProfileMsg({ type: 'success', text: 'Profilul a fost actualizat cu succes!' })
        } catch (err) {
            setProfileMsg({ type: 'error', text: 'Eroare la salvare. Încearcă din nou.' })
        } finally {
            setSaving(false)
        }
    }

    // ── Schimbare parolă ──
    const handleChangePassword = async () => {
        setPassMsg(null)

        if (!passForm.currentPassword || !passForm.newPassword || !passForm.confirmPassword) {
            setPassMsg({ type: 'error', text: 'Completează toate câmpurile.' })
            return
        }

        if (passForm.newPassword !== passForm.confirmPassword) {
            setPassMsg({ type: 'error', text: 'Parolele noi nu coincid.' })
            return
        }

        if (strength.score < 2) {
            setPassMsg({ type: 'error', text: 'Parola este prea slabă.' })
            return
        }

        setChangingPass(true)
        try {
            await axiosInstance.put('/api/users/me/password', {
                currentPassword: passForm.currentPassword,
                newPassword:     passForm.newPassword,
            })
            setPassMsg({ type: 'success', text: 'Parola a fost schimbată cu succes!' })
            // Închidem modalul după 1.5s
            setTimeout(() => {
                setShowPassModal(false)
                setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                setPassMsg(null)
            }, 1500)
        } catch (err) {
            const msg = err.response?.data?.message || 'Eroare la schimbarea parolei.'
            setPassMsg({ type: 'error', text: msg })
        } finally {
            setChangingPass(false)
        }
    }

    const handleClosePassModal = () => {
        setShowPassModal(false)
        setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setPassMsg(null)
    }

    const formatPrice = (p) =>
        new Intl.NumberFormat('ro-RO', { minimumFractionDigits: 0 }).format(p)

    if (loading) {
        return (
            <AccountLayout>
                <div className={styles.loadingWrap}>
                    <div className={styles.spinner} />
                </div>
            </AccountLayout>
        )
    }

    return (
        <AccountLayout>

            {/* ── Stat cards ── */}
            <div className={styles.statsRow}>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#EEF2FF' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                             stroke="#6366F1" strokeWidth="2" strokeLinecap="round">
                            <circle cx="8" cy="21" r="1"/>
                            <circle cx="19" cy="21" r="1"/>
                            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                        </svg>
                    </div>
                    <div>
                        <div className={styles.statValue}>{ordersCount}</div>
                        <div className={styles.statLabel}>Comenzi plasate</div>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#FEF2F2' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                             stroke="#EF4444" strokeWidth="2" strokeLinecap="round"
                             strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </div>
                    <div>
                        <div className={styles.statValue}>{wishlistCount}</div>
                        <div className={styles.statLabel}>Produse în wishlist</div>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#F5F3FF' }}>
                        <svg viewBox="-2.4 -2.4 28.80 28.80" width="18" height="18" fill="none">
                            <path
                                d="M12 3C12 7.97056 16.0294 12 21 12C16.0294 12 12 16.0294 12 21C12 16.0294 7.97056 12 3 12C5.6655 12 8.06036 10.8412 9.70832 9"
                                stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"
                            />
                        </svg>
                    </div>
                    <div>
                        <div className={styles.statValue}>{aiSearches}</div>
                        <div className={styles.statLabel}>Căutări AI făcute</div>
                    </div>
                </div>

            </div>

            {/* ── Date personale ── */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <div>
                        <h2 className={styles.cardTitle}>Date personale</h2>
                        <p className={styles.cardSub}>
                            Actualizează informațiile profilului tău
                        </p>
                    </div>
                </div>
                <div className={styles.cardBody}>

                    <div className={styles.formRow}>
                        <div className={styles.field}>
                            <label className={styles.label}>Prenume</label>
                            <input
                                className={styles.input}
                                value={form.firstName}
                                onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
                                placeholder="Prenumele tău"
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Nume</label>
                            <input
                                className={styles.input}
                                value={form.lastName}
                                onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
                                placeholder="Numele tău"
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.field}>
                            <label className={styles.label}>Email</label>
                            <input
                                className={`${styles.input} ${styles.inputDisabled}`}
                                value={profile?.email || ''}
                                disabled
                            />
                            <span className={styles.fieldHint}>
                Emailul nu poate fi modificat
              </span>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Telefon</label>
                            <input
                                className={styles.input}
                                value={form.phoneNumber}
                                onChange={e => setForm(p => ({ ...p, phoneNumber: e.target.value }))}
                                placeholder="07XX XXX XXX"
                            />
                        </div>
                    </div>

                    {/* Mesaj succes/eroare */}
                    <AnimatePresence>
                        {profileMsg && (
                            <motion.div
                                className={`${styles.msg} ${
                                    profileMsg.type === 'success' ? styles.msgSuccess : styles.msgError
                                }`}
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                {profileMsg.type === 'success' ? '✓' : '⚠'} {profileMsg.text}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className={styles.cardFooter}>
                        <button
                            className={styles.btnSecondary}
                            onClick={() => setShowPassModal(true)}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <rect x="3" y="11" width="18" height="11" rx="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            Schimbă parola
                        </button>
                        <button
                            className={styles.btnPrimary}
                            onClick={handleSaveProfile}
                            disabled={saving}
                        >
                            {saving ? 'Se salvează...' : 'Salvează modificările'}
                        </button>
                    </div>

                </div>
            </div>

            {/* ══ MODAL SCHIMBARE PAROLĂ ══ */}
            <AnimatePresence>
                {showPassModal && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) handleClosePassModal()
                        }}
                    >
                        <motion.div
                            className={styles.modal}
                            initial={{ scale: 0.95, y: -12, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        >
                            {/* Header */}
                            <div className={styles.modalHeader}>
                                <div>
                                    <h3 className={styles.modalTitle}>Schimbă parola</h3>
                                    <p className={styles.modalSub}>
                                        Recomandăm o parolă puternică, unică
                                    </p>
                                </div>
                                <button
                                    className={styles.modalClose}
                                    onClick={handleClosePassModal}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                        <line x1="18" y1="6" x2="6" y2="18"/>
                                        <line x1="6" y1="6" x2="18" y2="18"/>
                                    </svg>
                                </button>
                            </div>

                            {/* Body */}
                            <div className={styles.modalBody}>

                                {/* Parola curentă */}
                                <div className={styles.field} style={{ marginBottom: 16 }}>
                                    <label className={styles.label}>Parola curentă</label>
                                    <div className={styles.inputWrap}>
                                        <input
                                            className={styles.input}
                                            type={showCurrentPw ? 'text' : 'password'}
                                            placeholder="Parola ta actuală"
                                            value={passForm.currentPassword}
                                            onChange={e => setPassForm(p => ({
                                                ...p, currentPassword: e.target.value
                                            }))}
                                        />
                                        <button
                                            className={styles.eyeBtn}
                                            onClick={() => setShowCurrentPw(p => !p)}
                                            tabIndex={-1}
                                        >
                                            {showCurrentPw ? (
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                                     stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                                    <line x1="1" y1="1" x2="23" y2="23"/>
                                                </svg>
                                            ) : (
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                                     stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                    <circle cx="12" cy="12" r="3"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Parola nouă */}
                                <div className={styles.field} style={{ marginBottom: 16 }}>
                                    <label className={styles.label}>Parola nouă</label>
                                    <div className={styles.inputWrap}>
                                        <input
                                            className={styles.input}
                                            type={showNewPw ? 'text' : 'password'}
                                            placeholder="Minim 6 caractere"
                                            value={passForm.newPassword}
                                            onChange={e => setPassForm(p => ({
                                                ...p, newPassword: e.target.value
                                            }))}
                                        />
                                        <button
                                            className={styles.eyeBtn}
                                            onClick={() => setShowNewPw(p => !p)}
                                            tabIndex={-1}
                                        >
                                            {showNewPw ? (
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                                     stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                                    <line x1="1" y1="1" x2="23" y2="23"/>
                                                </svg>
                                            ) : (
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                                     stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                    <circle cx="12" cy="12" r="3"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    {/* Indicator putere parolă */}
                                    {passForm.newPassword && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <div className={styles.strengthBars}>
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <div
                                                        key={i}
                                                        className={styles.strengthBar}
                                                        style={{
                                                            background: i <= strength.score
                                                                ? strength.color
                                                                : '#E5E7EB',
                                                            transition: 'background 0.3s ease'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <div
                                                className={styles.strengthLabel}
                                                style={{ color: strength.color }}
                                            >
                                                {strength.label}
                                                {strength.score <= 2 && (
                                                    <span className={styles.strengthHint}>
                            — adaugă majuscule, cifre sau simboluri
                          </span>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Confirmare parolă */}
                                <div className={styles.field} style={{ marginBottom: 16 }}>
                                    <label className={styles.label}>Confirmă parola nouă</label>
                                    <div className={styles.inputWrap}>
                                        <input
                                            className={`${styles.input} ${
                                                passForm.confirmPassword &&
                                                passForm.confirmPassword !== passForm.newPassword
                                                    ? styles.inputError : ''
                                            }`}
                                            type="password"
                                            placeholder="Repetă parola nouă"
                                            value={passForm.confirmPassword}
                                            onChange={e => setPassForm(p => ({
                                                ...p, confirmPassword: e.target.value
                                            }))}
                                        />
                                    </div>
                                    {passForm.confirmPassword &&
                                        passForm.confirmPassword !== passForm.newPassword && (
                                            <span className={styles.fieldError}>
                      Parolele nu coincid
                    </span>
                                        )}
                                    {passForm.confirmPassword &&
                                        passForm.confirmPassword === passForm.newPassword && (
                                            <span className={styles.fieldSuccess}>
                      ✓ Parolele coincid
                    </span>
                                        )}
                                </div>

                                {/* Mesaj succes/eroare */}
                                <AnimatePresence>
                                    {passMsg && (
                                        <motion.div
                                            className={`${styles.msg} ${
                                                passMsg.type === 'success' ? styles.msgSuccess : styles.msgError
                                            }`}
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            {passMsg.type === 'success' ? '✓' : '⚠'} {passMsg.text}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </div>

                            {/* Footer */}
                            <div className={styles.modalFooter}>
                                <button
                                    className={styles.btnOutline}
                                    onClick={handleClosePassModal}
                                >
                                    Anulează
                                </button>
                                <button
                                    className={styles.btnPrimary}
                                    onClick={handleChangePassword}
                                    disabled={changingPass}
                                >
                                    {changingPass ? 'Se schimbă...' : 'Schimbă parola'}
                                </button>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </AccountLayout>
    )
}