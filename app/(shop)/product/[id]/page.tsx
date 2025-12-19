import { getProduct } from "@/actions/product-actions"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AddToCartButton } from "./add-to-cart-button"

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }>  // ← Ubah tipe jadi Promise
}) {
    const { id } = await params
    const product = await getProduct(id)
    
    if (!product) return notFound()
    
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {product.images[0] ? (
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full">No Image</div>
                    )}
                </div>
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <div className="text-xl font-semibold">${Number(product.price).toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide">{product.category}</div>
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                    <div className="mt-8">
                        <AddToCartButton product={product} />
                    </div>
                </div>
            </div>
        </div>
    )
}