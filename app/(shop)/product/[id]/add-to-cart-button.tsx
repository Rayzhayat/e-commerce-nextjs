'use client'
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { Product } from "@prisma/client"

export function AddToCartButton({ product }: { product: Product }) {
    const { addItem } = useCart()
    return (
        <Button size="lg" className="w-full md:w-auto" onClick={() => addItem({
            productId: product.id,
            name: product.name,
            price: Number(product.price),
            quantity: 1,
            image: product.images[0]
        })}>
            Add to Cart
        </Button>
    )
}
