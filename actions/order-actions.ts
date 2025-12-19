'use server'

import { z } from "zod"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-12-18.acacia'
})

const orderItemSchema = z.object({
    productId: z.string(),
    quantity: z.number().int().min(1),
})

const createOrderSchema = z.object({
    items: z.array(orderItemSchema),
})

export async function createOrder(cartItems: z.infer<typeof createOrderSchema>['items']) {
    const session = await auth()
    if (!session?.user?.email) {
        return { error: "You must be logged in to checkout" } // For now require login
    }

    try {
        // 1. Calculate and verify total
        let total = 0
        const dbItems = []

        for (const item of cartItems) {
            const product = await prisma.product.findUnique({ where: { id: item.productId } })
            if (!product) throw new Error(`Product ${item.productId} not found`)
            if (product.stock < item.quantity) throw new Error(`Not enough stock for ${product.name}`)

            const price = Number(product.price)
            total += price * item.quantity
            dbItems.push({
                productId: product.id,
                quantity: item.quantity,
                price: product.price // Snapshot price
            })
        }

        // 2. Create Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100), // Cents
            currency: 'usd',
            metadata: { userId: (session.user as any).id }
        })

        // 3. Create Order in DB (Pending)
        const order = await prisma.order.create({
            data: {
                userId: (session.user as any).id,
                total,
                status: 'PENDING',
                paymentIntentId: paymentIntent.id,
                items: {
                    create: dbItems
                }
            }
        })

        return {
            clientSecret: paymentIntent.client_secret,
            orderId: order.id
        }

    } catch (e: any) {
        console.error(e)
        return { error: e.message || "Failed to create order" }
    }
}

export async function getUserOrders() {
    const session = await auth()
    if (!session?.user) return []

    return await prisma.order.findMany({
        where: { userId: (session.user as any).id },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' }
    })
}

export async function updateOrderStatus(orderId: string, status: string) {
    const session = await auth()
    if ((session?.user as any)?.role !== 'ADMIN') {
        return { error: "Unauthorized" }
    }

    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status: status as any }
        })

        revalidatePath('/admin/orders')
        return { success: true }
    } catch (e) {
        console.error(e)
        return { error: "Failed to update order status" }
    }
}
