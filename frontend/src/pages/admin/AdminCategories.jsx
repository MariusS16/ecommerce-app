import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axiosInstance from '../../api/axiosInstance'
import AdminLayout from '../../components/layout/AdminLayout'
import styles from './Admin.module.css'

const EMPTY_FORM = { name: '', description: '', imageUrl: '' }

export default function AdminCategories() {
    const [categories, setCategories] = useState([])
    const [loading,    setLoading]    = useState(true)
    const [search,     setSearch]     = useState('')
    const [showModal,  setShowModal]  = useState(false)
    const [editItem,   setEditItem]   = useState(null)
    const [form,       setForm]       = useState(EMPTY_FORM)
    const [saving,     setSaving]     = useState(false)

    useEffect(() => { fetchCategories() }, [])

    const fetchCategories = async () => {
        setLoading(true)
        try {
            const res = await axiosInstance.get('/api/categories')
            setCategories(res.data)
        } catch (err) { console.error(err) }
        finally { setLoading(false) }
    }

    const filtered = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleAdd = () => {
        setEditItem(null)
        setForm(EMPTY_FORM)
        setShowModal(true)
    }

    const handleEdit = (cat) => {
        setEditItem(cat)
        setForm({
            name:        cat.name,
            description: cat.description || '',
            imageUrl:    cat.imageUrl || '',
        })
        setShowModal(true)
    }

    const handleSave = async () => {
        if (!form.name.trim()) { alert('Numele este obligatoriu!'); return }
        setSaving(true)
        try {
            const payload = {
                name:        form.name,
                description: form.description || null,
                imageUrl:    form.imageUrl    || null,
            }
            if (editItem) {
                await axiosInstance.put(`/api/categories/${editItem.id}`, payload)
            } else {
                await axiosInstance.post('/api/categories', payload)
            }
            setShowModal(false)
            await fetchCategories()
        } catch (err) {
            console.error(err)
            alert('Eroare la salvare.')
        } finally { setSaving(false) }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Ștergi această categorie?')) return
        try {
            await axiosInstance.delete(`/api/categories/${id}`)
            setCategories(prev => prev.filter(c => c.id !== id))
        } catch (err) {
            console.error(err)
            alert('Nu se poate șterge — are produse asociate.')
        }
    }

    return (
        <AdminLayout>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Categorii</h1>
                    <p className={styles.pageSub}>{categories.length} categorii</p>
                </div>
                <button className={styles.btnPrimary} onClick={handleAdd}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                         stroke="white" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Adaugă categorie
                </button>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <span className={styles.tableTitle}>Toate categoriile</span>
                    <input
                        className={styles.searchInput}
                        placeholder="Caută categorie..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div style={{ padding: 20 }}>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className={styles.skeleton}
                                 style={{ height: 44, marginBottom: 8 }} />
                        ))}
                    </div>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Nume</th>
                            <th>Descriere</th>
                            <th>Data creării</th>
                            <th>Acțiuni</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map(cat => (
                            <tr key={cat.id}>
                                <td style={{ fontWeight: 600, color: '#111827' }}>{cat.name}</td>
                                <td style={{ color: '#6B7280', maxWidth: 300 }}>
                                    {cat.description || '—'}
                                </td>
                                <td>
                                    {cat.createdAt
                                        ? new Date(cat.createdAt).toLocaleDateString('ro-RO')
                                        : '—'
                                    }
                                </td>
                                <td>
                                    <div className={styles.actionBtns}>
                                        <button
                                            className={`${styles.btnSm} ${styles.btnEdit}`}
                                            onClick={() => handleEdit(cat)}
                                        >
                                            Editează
                                        </button>
                                        <button
                                            className={`${styles.btnSm} ${styles.btnDelete}`}
                                            onClick={() => handleDelete(cat.id)}
                                        >
                                            Șterge
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
                    >
                        <motion.div
                            className={styles.modal}
                            initial={{ scale: 0.96, y: -8 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.96, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className={styles.modalHeader}>
                                <h2 className={styles.modalTitle}>
                                    {editItem ? 'Editează categorie' : 'Adaugă categorie nouă'}
                                </h2>
                                <button className={styles.modalClose} onClick={() => setShowModal(false)}>×</button>
                            </div>
                            <div className={styles.modalBody}>
                                <div className={styles.formGrid}>
                                    <div className={styles.field}>
                                        <label className={styles.label}>Nume *</label>
                                        <input
                                            className={styles.input}
                                            placeholder="Ex: Telefoane"
                                            value={form.name}
                                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label className={styles.label}>Descriere</label>
                                        <textarea
                                            className={`${styles.input} ${styles.textarea}`}
                                            placeholder="Descriere categorie..."
                                            value={form.description}
                                            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label className={styles.label}>URL Imagine</label>
                                        <input
                                            className={styles.input}
                                            placeholder="https://..."
                                            value={form.imageUrl}
                                            onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button className={styles.btnOutline} onClick={() => setShowModal(false)}>
                                    Anulează
                                </button>
                                <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>
                                    {saving ? 'Se salvează...' : (editItem ? 'Salvează' : 'Adaugă')}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AdminLayout>
    )
}