'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

export type CartItem = {
    productId: string
    name: string
    price: number
    image?: string
    quantity: number
}

type CartContextType = {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    total: number
    count: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])

    useEffect(() => {
        const saved = localStorage.getItem('cart')
        if (saved) setItems(JSON.parse(saved))
    }, [])

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items))
    }, [items])

    const addItem = (item: CartItem) => {
        setItems(prev => {
            const existing = prev.find(i => i.productId === item.productId)
            if (existing) {
                toast.success("Quantity updated")
                return prev.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i)
            }
            toast.success("Added to cart")
            return [...prev, item]
        })
    }

    const removeItem = (productId: string) => {
        setItems(prev => prev.filter(i => i.productId !== productId))
    }

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) return removeItem(productId)
        setItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i))
    }

    const clearCart = () => setItems([])

    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const count = items.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) throw new Error('useCart must be used within CartProvider')
    return context
}
