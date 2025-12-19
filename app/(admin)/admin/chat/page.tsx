import prisma from "@/lib/prisma"
import { ChatInterface } from "@/components/chat/chat-interface"

export default async function AdminChatPage() {
  const chatRooms = await prisma.chatRoom.findMany({
    where: { isActive: true },
    include: {
      user: true,
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: { updatedAt: 'desc' }
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Customer Support Chat</h1>
      
      {chatRooms.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          No active chat rooms yet. Customers can start a chat from the shop.
        </div>
      ) : (
        <ChatInterface chatRooms={chatRooms} isAdmin={true} />
      )}
    </div>
  )
}