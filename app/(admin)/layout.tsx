import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()
    if ((session?.user as any)?.role !== 'ADMIN') redirect('/')

    return (
        <div className="min-h-screen flex">
            <aside className="w-64 border-r bg-gray-50 p-6 hidden md:block">
                <h2 className="text-xl font-bold mb-8">Admin Dashboard</h2>
                <nav className="space-y-2">
                    <Link href="/admin/dashboard" className="block p-2 hover:bg-gray-200 rounded">Overview</Link>
                    <Link href="/admin/products" className="block p-2 hover:bg-gray-200 rounded">Products</Link>
                    <Link href="/admin/orders" className="block p-2 hover:bg-gray-200 rounded">Orders</Link>
                    <Link href="/admin/chat" className="block p-2 hover:bg-gray-200 rounded">Support Chat</Link>
                </nav>
            </aside>
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    )
}
