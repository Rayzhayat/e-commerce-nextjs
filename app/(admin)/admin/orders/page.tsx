import prisma from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { updateOrderStatus } from "@/actions/order-actions"

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Items</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  No orders yet
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} className="border-b">
                  <td className="p-4 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                  <td className="p-4">{order.user.name || order.user.email}</td>
                  <td className="p-4">{order.items.length} item(s)</td>
                  <td className="p-4 font-semibold">${Number(order.total).toFixed(2)}</td>
                  <td className="p-4">
                    <Badge variant={
                      order.status === 'PAID' ? 'default' :
                      order.status === 'SHIPPED' ? 'secondary' :
                      order.status === 'DELIVERED' ? 'outline' :
                      order.status === 'CANCELLED' ? 'destructive' :
                      'secondary'
                    }>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <OrderStatusForm orderId={order.id} currentStatus={order.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function OrderStatusForm({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const statuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']
  const nextStatus = 
    currentStatus === 'PENDING' ? 'PAID' :
    currentStatus === 'PAID' ? 'SHIPPED' :
    currentStatus === 'SHIPPED' ? 'DELIVERED' :
    null

  if (!nextStatus) return <span className="text-muted-foreground text-xs">No actions</span>

  return (
    <form action={async () => {
      'use server'
      await updateOrderStatus(orderId, nextStatus)
    }}>
      <Button size="sm" variant="outline">
        Mark as {nextStatus}
      </Button>
    </form>
  )
}