import { createContext, useState, useContext } from 'react'
import axiosInstance from '../api/axiosInstance'
import { AuthContext } from './AuthContext'

export const CartContext = createContext(null)

export function CartProvider({ children }) {
    const { isLoggedIn } = useContext(AuthContext)
    const [cart, setCart] = useState(null)
    const [cartLoading, setCartLoading] = useState(false)

    const cartCount = cart?.totalItems ?? 0

    const fetchCart = async () => {
        if (!isLoggedIn) return
        try {
            setCartLoading(true)
            const response = await axiosInstance.get('/api/cart')
            setCart(response.data)
        } catch (error) {
            console.error('Failed to fetch cart:', error)
        } finally {
            setCartLoading(false)
        }
    }

    const addToCart = async (productId, quantity = 1) => {
        try {
            const response = await axiosInstance.post('/api/cart/items', {
                productId,
                quantity,
            })
            setCart(response.data)
            return { success: true }
        } catch (error) {
            console.error('Failed to add to cart:', error)
            return { success: false, message: error.response?.data?.message }
        }
    }

    const updateCartItem = async (productId, quantity) => {
        try {
            const response = await axiosInstance.put('/api/cart/items', {
                productId,
                quantity,
            })
            setCart(response.data)
        } catch (error) {
            console.error('Failed to update cart item:', error)
        }
    }

    const removeFromCart = async (productId) => {
        try {
            const response = await axiosInstance.delete(`/api/cart/items/${productId}`)
            setCart(response.data)
        } catch (error) {
            console.error('Failed to remove from cart:', error)
        }
    }

    const clearCartLocal = () => setCart(null)

    const value = {
        cart,
        cartCount,
        cartLoading,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCartLocal,
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}