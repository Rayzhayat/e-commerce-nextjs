import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Sign In</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form
                        action={async (formData) => {
                            "use server"
                            await signIn("credentials", formData)
                        }}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <label>Email</label>
                            <Input name="email" type="email" placeholder="user@example.com" />
                        </div>
                        <div className="space-y-2">
                            <label>Password</label>
                            <Input name="password" type="password" />
                        </div>
                        <Button type="submit" className="w-full">Sign in with Email</Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
                    </div>

                    <form
                        action={async () => {
                            "use server"
                            await signIn("google")
                        }}
                    >
                        <Button variant="outline" type="submit" className="w-full">Sign in with Google</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
