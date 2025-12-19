'use client'

import { Product } from "@prisma/client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"

export function ProductCard({ product }: { product: Product }) {
    const { addItem } = useCart()

    return (
        <Card className="flex flex-col h-full overflow-hidden">
            <Link href={`/product/${product.id}`} className="cursor-pointer group">
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    {product.images[0] ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                    )}
                </div>
                <CardHeader className="p-4">
                    <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                    <div className="text-sm text-muted-foreground">{product.category}</div>
                </CardHeader>
            </Link>
            <CardContent className="flex-grow p-4 pt-0">
                <div className="font-bold text-xl">${Number(product.price).toFixed(2)}</div>
                <p className="text-sm text-gray-500 line-clamp-2 mt-2">{product.description}</p>
            </CardContent>
            <CardFooter className="p-4">
                <Button className="w-full" onClick={() => addItem({
                    productId: product.id,
                    name: product.name,
                    price: Number(product.price),
                    quantity: 1,
                    image: product.images[0]
                })}>
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    )
}
