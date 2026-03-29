import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axiosInstance from '../api/axiosInstance'
import { useAuth } from '../hooks/useAuth'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
    const { isLoggedIn } = useAuth()
    const [wishlistItems, setWishlistItems] = useState([])
    // wishlistItems = array de WishlistItemDTO de la backend
    // fiecare item are: { id, product: { id, name, price, ... }, addedAt }

    // ── Fetch wishlist ──
    const fetchWishlist = useCallback(async () => {
        if (!isLoggedIn) {
            setWishlistItems([])
            return
        }
        try {
            const res = await axiosInstance.get('/api/wishlist')
            setWishlistItems(res.data)
        } catch (err) {
            console.error('Failed to fetch wishlist:', err)
        }
    }, [isLoggedIn])

    // Fetch la login/logout
    useEffect(() => {
        fetchWishlist()
    }, [fetchWishlist])

    // ── Verifică dacă un produs e în wishlist ──
    const isInWishlist = useCallback((productId) => {
        return wishlistItems.some(item => item.product.id === productId)
    }, [wishlistItems])

    // ── Toggle — adaugă sau elimină ──
    const toggleWishlist = useCallback(async (productId) => {
        if (!isLoggedIn) return { success: false, requiresLogin: true }

        const alreadyIn = isInWishlist(productId)

        try {
            if (alreadyIn) {
                // Elimină din wishlist
                await axiosInstance.delete(`/api/wishlist/${productId}`)
                setWishlistItems(prev =>
                    prev.filter(item => item.product.id !== productId)
                )
            } else {
                // Adaugă în wishlist
                const res = await axiosInstance.post(`/api/wishlist/${productId}`)
                setWishlistItems(prev => [...prev, res.data])
            }
            return { success: true, added: !alreadyIn }
        } catch (err) {
            console.error('Wishlist toggle failed:', err)
            return { success: false }
        }
    }, [isLoggedIn, isInWishlist])

    const wishlistCount = wishlistItems.length

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            wishlistCount,
            isInWishlist,
            toggleWishlist,
            fetchWishlist,
        }}>
            {children}
        </WishlistContext.Provider>
    )
}

export function useWishlist() {
    const ctx = useContext(WishlistContext)
    if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
    return ctx
}