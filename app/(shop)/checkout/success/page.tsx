import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default async function SuccessPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ orderId: string, payment_intent_client_secret: string }> 
}) {
  const params = await searchParams  // ← Await searchParams dulu

  return (
    <div className="container mx-auto px-4 py-20 text-center flex flex-col items-center">
      <CheckCircle className="h-20 w-20 text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
      <p className="text-muted-foreground mb-8">
        Thank you for your purchase. Your order ID is {params.orderId}
      </p>
      <Link href="/">
        <Button>Continue Shopping</Button>
      </Link>
    </div>
  )
}