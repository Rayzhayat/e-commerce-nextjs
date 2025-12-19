import { getProducts } from "@/actions/product-actions"
import { ProductCard } from "@/components/shop/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default async function Home({ searchParams }: { searchParams: { q?: string } }) {
  const params = await searchParams; // In Next.js 15, searchParams is a promise
  const query = params.q
  const products = await getProducts(query)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Featured Products</h1>
        <form action="/" className="flex w-full md:w-auto gap-2">
          <Input name="q" placeholder="Search products..." defaultValue={query} className="max-w-xs" />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
