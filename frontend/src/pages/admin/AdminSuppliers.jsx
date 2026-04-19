import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axiosInstance from '../../api/axiosInstance'
import AdminLayout from '../../components/layout/AdminLayout'
import styles from './Admin.module.css'

const EMPTY_FORM = {
    name: '', contactEmail: '', contactPhone: '', website: '', address: ''
}

export default function AdminSuppliers() {
    const [suppliers, setSuppliers] = useState([])
    const [loading,   setLoading]   = useState(true)
    const [search,    setSearch]    = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editItem,  setEditItem]  = useState(null)
    const [form,      setForm]      = useState(EMPTY_FORM)
    const [saving,    setSaving]    = useState(false)

    useEffect(() => { fetchSuppliers() }, [])

    const fetchSuppliers = async () => {
        setLoading(true)
        try {
            const res = await axiosInstance.get('/api/suppliers')
            setSuppliers(res.data)
        } catch (err) { console.error(err) }
        finally { setLoading(false) }
    }

    const filtered = suppliers.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleAdd = () => { setEditItem(null); setForm(EMPTY_FORM); setShowModal(true) }

    const handleEdit = (s) => {
        setEditItem(s)
        setForm({
            name:         s.name,
            contactEmail: s.contactEmail,
            contactPhone: s.contactPhone || '',
            website:      s.website || '',
            address:      s.address || '',
        })
        setShowModal(true)
    }

    const handleSave = async () => {
        if (!form.name.trim() || !form.contactEmail.trim()) {
            alert('Numele și emailul sunt obligatorii!')
            return
        }
        setSaving(true)
        try {
            const payload = {
                name:         form.name,
                contactEmail: form.contactEmail,
                contactPhone: form.contactPhone || null,
                website:      form.website || null,
                address:      form.address || null,
            }
            if (editItem) {
                await axiosInstance.put(`/api/suppliers/${editItem.id}`, payload)
            } else {
                await axiosInstance.post('/api/suppliers', payload)
            }
            setShowModal(false)
            await fetchSuppliers()
        } catch (err) {
            console.error(err)
            alert('Eroare la salvare.')
        } finally { setSaving(false) }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Ștergi acest furnizor?')) return
        try {
            await axiosInstance.delete(`/api/suppliers/${id}`)
            setSuppliers(prev => prev.filter(s => s.id !== id))
        } catch (err) {
            console.error(err)
            alert('Nu se poate șterge — are produse asociate.')
        }
    }

    return (
        <AdminLayout>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Furnizori</h1>
                    <p className={styles.pageSub}>{suppliers.length} furnizori</p>
                </div>
                <button className={styles.btnPrimary} onClick={handleAdd}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                         stroke="white" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Adaugă furnizor
                </button>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <span className={styles.tableTitle}>Toți furnizorii</span>
                    <input
                        className={styles.searchInput}
                        placeholder="Caută furnizor..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                {loading ? (
                    <div style={{ padding: 20 }}>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className={styles.skeleton} style={{ height: 44, marginBottom: 8 }} />
                        ))}
                    </div>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Nume</th>
                            <th>Email contact</th>
                            <th>Telefon</th>
                            <th>Website</th>
                            <th>Acțiuni</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map(s => (
                            <tr key={s.id}>
                                <td style={{ fontWeight: 600, color: '#111827' }}>{s.name}</td>
                                <td>{s.contactEmail}</td>
                                <td>{s.contactPhone || '—'}</td>
                                <td>
                                    {s.website
                                        ? <a href={s.website} target="_blank" rel="noreferrer"
                                             style={{ color: '#6366F1', fontSize: '0.8rem' }}>
                                            {s.website}
                                        </a>
                                        : '—'
                                    }
                                </td>
                                <td>
                                    <div className={styles.actionBtns}>
                                        <button className={`${styles.btnSm} ${styles.btnEdit}`}
                                                onClick={() => handleEdit(s)}>Editează</button>
                                        <button className={`${styles.btnSm} ${styles.btnDelete}`}
                                                onClick={() => handleDelete(s.id)}>Șterge</button>
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
                                    {editItem ? 'Editează furnizor' : 'Adaugă furnizor nou'}
                                </h2>
                                <button className={styles.modalClose} onClick={() => setShowModal(false)}>×</button>
                            </div>
                            <div className={styles.modalBody}>
                                <div className={styles.formGrid}>
                                    <div className={styles.formRow}>
                                        <div className={styles.field}>
                                            <label className={styles.label}>Nume *</label>
                                            <input className={styles.input} placeholder="Ex: Apple Inc"
                                                   value={form.name}
                                                   onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                                        </div>
                                        <div className={styles.field}>
                                            <label className={styles.label}>Email contact *</label>
                                            <input className={styles.input} type="email"
                                                   placeholder="contact@furnizor.com"
                                                   value={form.contactEmail}
                                                   onChange={e => setForm(p => ({ ...p, contactEmail: e.target.value }))} />
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.field}>
                                            <label className={styles.label}>Telefon</label>
                                            <input className={styles.input} placeholder="07XX XXX XXX"
                                                   value={form.contactPhone}
                                                   onChange={e => setForm(p => ({ ...p, contactPhone: e.target.value }))} />
                                        </div>
                                        <div className={styles.field}>
                                            <label className={styles.label}>Website</label>
                                            <input className={styles.input} placeholder="https://..."
                                                   value={form.website}
                                                   onChange={e => setForm(p => ({ ...p, website: e.target.value }))} />
                                        </div>
                                    </div>
                                    <div className={styles.field}>
                                        <label className={styles.label}>Adresă</label>
                                        <input className={styles.input} placeholder="Str. Exemplu nr. 1, București"
                                               value={form.address}
                                               onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button className={styles.btnOutline} onClick={() => setShowModal(false)}>Anulează</button>
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