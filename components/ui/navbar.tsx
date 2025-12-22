'use client'

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "./button"
import { ShoppingCart, LogOut, User } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

export function Navbar() {
    const { data: session } = useSession()
    const { count } = useCart()

    return (
        <nav className="border-b bg-background sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between h-16 px-4">
                <Link href="/" className="text-xl font-bold">Raynor Store</Link>

                <div className="flex items-center gap-4">
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingCart className="h-5 w-5" />
                            {count > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground rounded-full text-[10px] flex items-center justify-center">
                                    {count}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {session ? (
                        <div className="flex items-center gap-4">
                            {(session.user as any).role === 'ADMIN' && (
                                <Link href="/admin/dashboard">
                                    <Button variant="outline">Admin</Button>
                                </Link>
                            )}
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span className="text-sm hidden md:inline">{session.user?.name}</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => signOut()}>
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button>Login</Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
