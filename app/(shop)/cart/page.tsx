'use client'

import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Trash2 } from "lucide-react"

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCart()
    const router = useRouter()

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <Button onClick={() => router.push('/')}>Continue Shopping</Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {items.map(item => (
                        <div key={item.productId} className="flex gap-4 border p-4 rounded-lg items-center">
                            <div className="relative h-20 w-20 bg-gray-100 flex-shrink-0">
                                {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-muted-foreground">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</Button>
                                <span>{item.quantity}</span>
                                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</Button>
                            </div>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeItem(item.productId)}>
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="lg:col-span-1">
                    <div className="border p-6 rounded-lg sticky top-20">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="flex justify-between mb-2">
                            <span>Subtotal</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg mb-6 pt-4 border-t">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <Button className="w-full" size="lg" onClick={() => router.push('/checkout')}>
                            Proceed to Checkout
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
