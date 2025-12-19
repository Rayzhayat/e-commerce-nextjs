'use client'

import { useState, useEffect } from "react"
import { useCart } from "@/hooks/use-cart"
import { createOrder } from "@/actions/order-actions"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({ clientSecret, orderId }: { clientSecret: string, orderId: string }) {
    const stripe = useStripe()
    const elements = useElements()
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { clearCart } = useCart()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!stripe || !elements) return

        setIsLoading(true)

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/success?orderId=${orderId}`,
            },
        })

        if (error) {
            toast.error(error.message)
            setIsLoading(false)
        } else {
            // Success is handled by redirect
            clearCart()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            <Button className="w-full" disabled={isLoading || !stripe || !elements}>
                {isLoading ? "Processing..." : "Pay Now"}
            </Button>
        </form>
    )
}

export default function CheckoutPage() {
    const { items, total } = useCart()
    const [clientSecret, setClientSecret] = useState("")
    const [orderId, setOrderId] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        if (items.length > 0 && !clientSecret) {
            createOrder(items).then(res => {
                if (res.error) setError(res.error)
                else if (res.clientSecret && res.orderId) {
                    setClientSecret(res.clientSecret)
                    setOrderId(res.orderId)
                }
            })
        }
    }, [items, clientSecret])

    if (items.length === 0) return <div>Cart is empty</div>
    if (error) return <div className="text-red-500 container py-10">Error: {error}</div>

    return (
        <div className="container mx-auto px-4 py-8 max-w-lg">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            <div className="mb-6 p-4 bg-gray-50 rounded text-sm">
                <div className="flex justify-between font-bold">
                    <span>Total to pay:</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

            {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm clientSecret={clientSecret} orderId={orderId} />
                </Elements>
            )}
        </div>
    )
}
