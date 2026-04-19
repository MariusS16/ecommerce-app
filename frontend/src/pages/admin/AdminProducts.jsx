import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axiosInstance from '../../api/axiosInstance'
import AdminLayout from '../../components/layout/AdminLayout'
import styles from './Admin.module.css'

const EMPTY_FORM = {
    name: '', description: '', price: '',
    stock: '', imageUrl: '', categoryId: '', supplierId: '',
}

export default function AdminProducts() {
    const [products,   setProducts]   = useState([])
    const [categories, setCategories] = useState([])
    const [suppliers,  setSuppliers]  = useState([])
    const [loading,    setLoading]    = useState(true)
    const [search,     setSearch]     = useState('')
    const [showModal,  setShowModal]  = useState(false)
    const [editProduct, setEditProduct] = useState(null)
    // editProduct = null → add mode, obiect → edit mode
    const [form, setForm] = useState(EMPTY_FORM)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchAll()
    }, [])

    const fetchAll = async () => {
        setLoading(true)
        try {
            const [pRes, cRes, sRes] = await Promise.all([
                axiosInstance.get('/api/products'),
                axiosInstance.get('/api/categories'),
                axiosInstance.get('/api/suppliers'),
            ])
            setProducts(pRes.data)
            setCategories(cRes.data)
            setSuppliers(sRes.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // ── Filtrare locală ──
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    // ── Deschide modal add ──
    const handleAdd = () => {
        setEditProduct(null)
        setForm(EMPTY_FORM)
        setShowModal(true)
    }

    // ── Deschide modal edit ──
    const handleEdit = (product) => {
        setEditProduct(product)
        setForm({
            name:        product.name,
            description: product.description || '',
            price:       product.price.toString(),
            stock:       product.stock.toString(),
            imageUrl:    product.imageUrl || '',
            categoryId:  product.category.id.toString(),
            supplierId:  product.supplier.id.toString(),
        })
        setShowModal(true)
    }

    // ── Salvare (add sau edit) ──
    const handleSave = async () => {
        if (!form.name || !form.price || !form.stock ||
            !form.categoryId || !form.supplierId) {
            alert('Completează câmpurile obligatorii!')
            return
        }

        setSaving(true)
        try {
            const payload = {
                name:        form.name,
                description: form.description || null,
                price:       parseFloat(form.price),
                stock:       parseInt(form.stock),
                imageUrl:    form.imageUrl || null,
                categoryId:  parseInt(form.categoryId),
                supplierId:  parseInt(form.supplierId),
            }

            if (editProduct) {
                // Edit — PUT
                await axiosInstance.put(`/api/products/${editProduct.id}`, payload)
            } else {
                // Add — POST
                await axiosInstance.post('/api/products', payload)
            }

            setShowModal(false)
            await fetchAll()
        } catch (err) {
            console.error(err)
            alert('Eroare la salvare.')
        } finally {
            setSaving(false)
        }
    }

    // ── Ștergere ──
    const handleDelete = async (id) => {
        if (!window.confirm('Ești sigur că vrei să ștergi acest produs?')) return
        try {
            await axiosInstance.delete(`/api/products/${id}`)
            setProducts(prev => prev.filter(p => p.id !== id))
        } catch (err) {
            console.error(err)
            alert('Eroare la ștergere.')
        }
    }

    // ── Toggle isActive ──
    const handleToggleActive = async (product) => {
        try {
            await axiosInstance.put(`/api/products/${product.id}`, {
                isActive: !product.isActive
            })
            // Actualizăm local
            setProducts(prev => prev.map(p =>
                p.id === product.id ? { ...p, isActive: !p.isActive } : p
            ))
        } catch (err) {
            console.error(err)
        }
    }

    const formatPrice = (p) =>
        new Intl.NumberFormat('ro-RO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(p)

    return (
        <AdminLayout>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Produse</h1>
                    <p className={styles.pageSub}>{products.length} produse în catalog</p>
                </div>
                <button className={styles.btnPrimary} onClick={handleAdd}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                         stroke="white" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Adaugă produs
                </button>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <span className={styles.tableTitle}>Toate produsele</span>
                    <div className={styles.tableActions}>
                        <input
                            className={styles.searchInput}
                            placeholder="Caută produs..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: 20 }}>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className={styles.skeleton}
                                 style={{ height: 44, marginBottom: 8 }} />
                        ))}
                    </div>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Produs</th>
                            <th>Categorie</th>
                            <th>Furnizor</th>
                            <th>Preț</th>
                            <th>Stoc</th>
                            <th>Activ</th>
                            <th>Acțiuni</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <div style={{ fontWeight: 600, color: '#111827' }}>
                                        {product.name}
                                    </div>
                                </td>
                                <td>{product.category?.name}</td>
                                <td>{product.supplier?.name}</td>
                                <td>{formatPrice(product.price)} RON</td>
                                <td>
                    <span style={{
                        fontWeight: 600,
                        color: product.stock === 0 ? '#EF4444' : '#111827'
                    }}>
                      {product.stock}
                    </span>
                                </td>
                                <td>
                                    {/* Toggle simplu activ/inactiv */}
                                    <button
                                        className={`${styles.toggle} ${product.isActive ? styles.toggleOn : styles.toggleOff}`}
                                        onClick={() => handleToggleActive(product)}
                                        title={product.isActive ? 'Dezactivează' : 'Activează'}
                                    >
                                        <div className={`${styles.toggleDot} ${product.isActive ? styles.toggleDotOn : styles.toggleDotOff}`} />
                                    </button>
                                </td>
                                <td>
                                    <div className={styles.actionBtns}>
                                        <button
                                            className={`${styles.btnSm} ${styles.btnEdit}`}
                                            onClick={() => handleEdit(product)}
                                        >
                                            Editează
                                        </button>
                                        <button
                                            className={`${styles.btnSm} ${styles.btnDelete}`}
                                            onClick={() => handleDelete(product.id)}
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

            {/* ══ MODAL Add/Edit ══ */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setShowModal(false)
                        }}
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
                                    {editProduct ? 'Editează produs' : 'Adaugă produs nou'}
                                </h2>
                                <button
                                    className={styles.modalClose}
                                    onClick={() => setShowModal(false)}
                                >
                                    ×
                                </button>
                            </div>

                            <div className={styles.modalBody}>
                                <div className={styles.formGrid}>

                                    {/* Nume */}
                                    <div className={styles.field}>
                                        <label className={styles.label}>Nume *</label>
                                        <input
                                            className={styles.input}
                                            placeholder="Ex: iPhone 16 Pro"
                                            value={form.name}
                                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                        />
                                    </div>

                                    {/* Descriere */}
                                    <div className={styles.field}>
                                        <label className={styles.label}>Descriere</label>
                                        <textarea
                                            className={`${styles.input} ${styles.textarea}`}
                                            placeholder="Descriere produs..."
                                            value={form.description}
                                            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                        />
                                    </div>

                                    {/* Preț + Stoc */}
                                    <div className={styles.formRow}>
                                        <div className={styles.field}>
                                            <label className={styles.label}>Preț (RON) *</label>
                                            <input
                                                className={styles.input}
                                                type="number"
                                                placeholder="0.00"
                                                value={form.price}
                                                onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                                            />
                                        </div>
                                        <div className={styles.field}>
                                            <label className={styles.label}>Stoc *</label>
                                            <input
                                                className={styles.input}
                                                type="number"
                                                placeholder="0"
                                                value={form.stock}
                                                onChange={e => setForm(p => ({ ...p, stock: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    {/* Categorie + Furnizor */}
                                    <div className={styles.formRow}>
                                        <div className={styles.field}>
                                            <label className={styles.label}>Categorie *</label>
                                            <select
                                                className={styles.select}
                                                value={form.categoryId}
                                                onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}
                                            >
                                                <option value="">Selectează...</option>
                                                {categories.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={styles.field}>
                                            <label className={styles.label}>Furnizor *</label>
                                            <select
                                                className={styles.select}
                                                value={form.supplierId}
                                                onChange={e => setForm(p => ({ ...p, supplierId: e.target.value }))}
                                            >
                                                <option value="">Selectează...</option>
                                                {suppliers.map(s => (
                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Image URL */}
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
                                <button
                                    className={styles.btnOutline}
                                    onClick={() => setShowModal(false)}
                                >
                                    Anulează
                                </button>
                                <button
                                    className={styles.btnPrimary}
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? 'Se salvează...' : (editProduct ? 'Salvează' : 'Adaugă')}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AdminLayout>
    )
}