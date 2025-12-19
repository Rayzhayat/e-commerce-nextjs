import prisma from "@/lib/prisma"  // ← Ubah jadi default import (tanpa { })
import { notFound } from "next/navigation"
import { ProductForm } from "@/components/product-form"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id }
  })

  if (!product) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  )
}