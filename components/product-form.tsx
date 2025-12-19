'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct, updateProduct } from '@/actions/product-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

type Product = {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  images: string[]
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const isEdit = !!product

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const result = isEdit 
        ? await updateProduct(product.id, formData)
        : await createProduct(formData)

      if (result.success) {
        toast.success(isEdit ? 'Product updated!' : 'Product created!')
        router.push('/admin/products')
        router.refresh()
      } else {
        toast.error(result.error || 'Something went wrong')
      }
    } catch (error) {
      toast.error('Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={product?.name}
          placeholder="Premium Headphones"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description}
          placeholder="High quality noise cancelling headphones"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            required
            defaultValue={product?.price}
            placeholder="99.99"
          />
        </div>

        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            required
            defaultValue={product?.stock}
            placeholder="50"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          required
          defaultValue={product?.category}
          placeholder="Electronics"
        />
      </div>

      <div>
        <Label htmlFor="images">Image URLs (comma-separated)</Label>
        <Textarea
          id="images"
          name="images"
          defaultValue={product?.images.join(', ')}
          placeholder="https://images.unsplash.com/photo-1.jpg, https://images.unsplash.com/photo-2.jpg"
          rows={3}
        />
        <p className="text-sm text-muted-foreground mt-1">
          Separate multiple URLs with commas
        </p>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/products')}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}