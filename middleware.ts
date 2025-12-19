import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnAdminPanel = req.nextUrl.pathname.startsWith('/admin')
    const isOnLoginPage = req.nextUrl.pathname.startsWith('/login')

    if (isOnAdminPanel) {
        if (!isLoggedIn) return NextResponse.redirect(new URL('/login', req.nextUrl))
        if ((req.auth?.user as any)?.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', req.nextUrl))
        }
    }

    if (isOnLoginPage && isLoggedIn) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    return NextResponse.next();
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
