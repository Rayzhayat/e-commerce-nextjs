'use server'

import { z } from "zod"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

const productSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.coerce.number().min(0),
    stock: z.coerce.number().int().min(0),
    category: z.string().min(1),
    images: z.array(z.string()).default([]),
})

export async function createProduct(formData: FormData) {
    const session = await auth()
    if ((session?.user as any)?.role !== 'ADMIN') {
        return { error: "Unauthorized" }
    }

    const rawData = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        stock: formData.get('stock'),
        category: formData.get('category'),
        images: (formData.get('images') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
    }

    const result = productSchema.safeParse(rawData)

    if (!result.success) {
        return { error: "Invalid data", details: result.error.flatten() }
    }

    try {
        await prisma.product.create({
            data: result.data,
        })
        revalidatePath('/')
        revalidatePath('/admin/products')
        return { success: true }
    } catch (e) {
        return { error: "Failed to create product" }
    }
}

export async function updateProduct(id: string, formData: FormData) {
    const session = await auth()
    if ((session?.user as any)?.role !== 'ADMIN') {
        return { error: "Unauthorized" }
    }

    const rawData = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        stock: formData.get('stock'),
        category: formData.get('category'),
        images: (formData.get('images') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
    }

    const result = productSchema.safeParse(rawData)

    if (!result.success) {
        return { error: "Invalid data", details: result.error.flatten() }
    }

    try {
        await prisma.product.update({
            where: { id },
            data: result.data,
        })
        revalidatePath('/')
        revalidatePath('/admin/products')
        return { success: true }
    } catch (e) {
        return { error: "Failed to update product" }
    }
}

export async function deleteProduct(id: string) {
    const session = await auth()
    if ((session?.user as any)?.role !== 'ADMIN') {
        return { error: "Unauthorized" }
    }

    try {
        await prisma.product.delete({ where: { id } })
        revalidatePath('/')
        revalidatePath('/admin/products')
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete product" }
    }
}

export async function getProducts(query?: string, category?: string) {
    const where: any = {}
    if (query) {
        where.name = { contains: query, mode: 'insensitive' }
    }
    if (category) {
        where.category = category
    }

    return await prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' }
    })
}

export async function getProduct(id: string) {
    return await prisma.product.findUnique({
        where: { id }
    })
}