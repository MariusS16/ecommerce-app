import { useState } from 'react';
import axiosInstance from '../../api/axiosInstance'
import styles from './Feedback.module.css';

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const icons = {
    package: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>
        </svg>
    ),
    truck: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
    ),
    headphones: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
        </svg>
    ),
    sparkles: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
        </svg>
    ),
    moreHorizontal: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
        </svg>
    ),
    search: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
    ),
    heart: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
    ),
    shoppingCart: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
    ),
    clipboardList: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/>
        </svg>
    ),
    settings: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
        </svg>
    ),
    check: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
    ),
    send: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
    ),
    checkCircle: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
    ),
    messageSquare: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
    ),
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORY_OPTIONS = [
    { value: '',                   label: 'Select a category...',   icon: null },
    { value: 'Products',           label: 'Products',               icon: icons.package },
    { value: 'Delivery',           label: 'Delivery',               icon: icons.truck },
    { value: 'Customer Support',   label: 'Customer Support',       icon: icons.headphones },
    { value: 'AI Recommendations', label: 'AI Recommendations',     icon: icons.sparkles },
    { value: 'Other',              label: 'Other',                  icon: icons.moreHorizontal },
];

const EXPERIENCE_OPTIONS = [
    { value: 'Excellent',     label: 'Excellent',     color: '#059669' },
    { value: 'Good',          label: 'Good',          color: '#3B82F6' },
    { value: 'Satisfactory',  label: 'Satisfactory',  color: '#F59E0B' },
    { value: 'Poor',          label: 'Poor',          color: '#EF4444' },
];

const FEATURES_OPTIONS = [
    { value: 'Product Search',       icon: icons.search },
    { value: 'AI Recommendations',   icon: icons.sparkles },
    { value: 'Shopping Cart',        icon: icons.shoppingCart },
    { value: 'Wishlist',             icon: icons.heart },
    { value: 'Order History',        icon: icons.clipboardList },
    { value: 'Other',                icon: icons.settings },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Feedback() {
    const [form, setForm] = useState({
        category: '',
        experience: '',
        usefulFeatures: [],
        suggestions: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const toggleFeature = (value) => {
        setForm((prev) => ({
            ...prev,
            usefulFeatures: prev.usefulFeatures.includes(value)
                ? prev.usefulFeatures.filter((v) => v !== value)
                : [...prev.usefulFeatures, value],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.category)   { setError('Please select a category.');          return; }
        if (!form.experience) { setError('Please select your overall experience.'); return; }
        setLoading(true);
        try {
            await axiosInstance.post('http://localhost:8080/api/feedback', form);
            setSubmitted(true);
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Success state ──
    if (submitted) {
        return (
            <div className={styles.page}>
                <div className={styles.successCard}>
                    <div className={styles.successIconWrap}>{icons.checkCircle}</div>
                    <h2>Thank you for your feedback!</h2>
                    <p>Your input helps us improve TrustCart for everyone.</p>
                    <button className={styles.resetBtn} onClick={() => { setForm({ category: '', experience: '', usefulFeatures: [], suggestions: '' }); setSubmitted(false); }}>
                        Submit another response
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>

                {/* ── Header ── */}
                <div className={styles.header}>
                    <div className={styles.headerIcon}>{icons.messageSquare}</div>
                    <h1 className={styles.title}>Share Your Feedback</h1>
                    <p className={styles.subtitle}>
                        Help us build a better experience — your opinion matters.
                    </p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>

                    {/* ── SELECT — Category ── */}
                    <div className={styles.field}>
                        <label className={styles.label}>
                            Select Category <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.selectWrapper}>
                            <select
                                className={styles.select}
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                            >
                                {CATEGORY_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <div className={styles.selectChevron}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* ── RADIO — Experience ── */}
                    <div className={styles.field}>
                        <label className={styles.label}>
                            Overall Experience <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.radioGrid}>
                            {EXPERIENCE_OPTIONS.map((opt) => (
                                <label key={opt.value} className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="experience"
                                        value={opt.value}
                                        checked={form.experience === opt.value}
                                        onChange={(e) => setForm({ ...form, experience: e.target.value })}
                                        className={styles.hiddenInput}
                                    />
                                    <div
                                        className={`${styles.radioCard} ${form.experience === opt.value ? styles.radioCardActive : ''}`}
                                        style={form.experience === opt.value ? { '--accent': opt.color } : {}}
                                    >
                                        <div className={styles.radioIndicator}
                                             style={form.experience === opt.value ? { background: opt.color, borderColor: opt.color } : {}}>
                                            {form.experience === opt.value && <div className={styles.radioDot} />}
                                        </div>
                                        <span>{opt.label}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* ── CHECKBOXES — Useful Features ── */}
                    <div className={styles.field}>
                        <label className={styles.label}>Which features did you find useful?</label>
                        <p className={styles.hint}>Select all that apply</p>
                        <div className={styles.featuresGrid}>
                            {FEATURES_OPTIONS.map((opt) => {
                                const active = form.usefulFeatures.includes(opt.value);
                                return (
                                    <label key={opt.value} className={styles.featureLabel}>
                                        <input
                                            type="checkbox"
                                            checked={active}
                                            onChange={() => toggleFeature(opt.value)}
                                            className={styles.hiddenInput}
                                        />
                                        <div className={`${styles.featureCard} ${active ? styles.featureCardActive : ''}`}>
                                            <div className={`${styles.featureIcon} ${active ? styles.featureIconActive : ''}`}>
                                                {opt.icon}
                                            </div>
                                            <span className={styles.featureLabel2}>{opt.value}</span>
                                            <div className={`${styles.featureCheck} ${active ? styles.featureCheckActive : ''}`}>
                                                {icons.check}
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── TEXTAREA — Suggestions ── */}
                    <div className={styles.field}>
                        <label className={styles.label}>Suggestions or Comments</label>
                        <p className={styles.hint}>Tell us how we can improve</p>
                        <textarea
                            className={styles.textarea}
                            placeholder="Share your thoughts, ideas, or report an issue..."
                            value={form.suggestions}
                            onChange={(e) => setForm({ ...form, suggestions: e.target.value })}
                            rows={5}
                            maxLength={2000}
                        />
                        <div className={styles.charRow}>
                            <span />
                            <span className={`${styles.charCount} ${form.suggestions.length > 1800 ? styles.charCountWarn : ''}`}>
                {form.suggestions.length} / 2000
              </span>
                        </div>
                    </div>

                    {/* ── Error ── */}
                    {error && (
                        <div className={styles.errorBox}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.errorIcon}>
                                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* ── Submit ── */}
                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        <span className={styles.submitIcon}>{icons.send}</span>
                        {loading ? 'Sending...' : 'Submit Feedback'}
                    </button>

                </form>
            </div>
        </div>
    );
}