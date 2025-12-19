import { getProducts, deleteProduct } from "@/actions/product-actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AdminProductsPage() {
    const products = await getProducts()

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
                <Link href="/admin/products/new">
                    <Button>Add Product</Button>
                </Link>
            </div>

            <div className="border rounded-lg">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="border-b">
                                <td className="p-4">{product.name}</td>
                                <td className="p-4">${Number(product.price).toFixed(2)}</td>
                                <td className="p-4">{product.stock}</td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <Link href={`/admin/products/${product.id}/edit`}>
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </Link>
                                        <form action={async () => {
                                            'use server'
                                            await deleteProduct(product.id)
                                        }}>
                                            <Button variant="destructive" size="sm">Delete</Button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}