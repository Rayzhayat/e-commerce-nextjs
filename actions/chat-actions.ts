'use server'

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import Pusher from "pusher"

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
});

export async function createChatRoom() {
    const session = await auth()
    if (!session?.user) return { error: "Unauthorized" }

    const userId = (session.user as any).id

    // Check if active room exists
    const existing = await prisma.chatRoom.findFirst({
        where: { userId, isActive: true }
    })

    if (existing) return { roomId: existing.id }

    const newRoom = await prisma.chatRoom.create({
        data: { userId }
    })

    // Notify Admins
    await pusher.trigger('admin-channel', 'new-room', {
        roomId: newRoom.id,
        userId
    })

    return { roomId: newRoom.id }
}

export async function sendMessage(roomId: string, content: string, senderId?: string) {
    const session = await auth()
    if (!session?.user) return { error: "Unauthorized" }

    // If senderId provided (admin sending), use it. Otherwise use session user id
    const actualSenderId = senderId || (session.user as any).id

    const message = await prisma.message.create({
        data: {
            content,
            chatRoomId: roomId,
            senderId: actualSenderId
        }
    })

    // Update chatRoom updatedAt
    await prisma.chatRoom.update({
        where: { id: roomId },
        data: { updatedAt: new Date() }
    })

    // Trigger pusher with correct channel name
    await pusher.trigger(`chat-${roomId}`, 'new-message', message)

    return { success: true, message }
}

export async function getMessages(roomId: string) {
    const session = await auth()
    // Add auth check here

    return await prisma.message.findMany({
        where: { chatRoomId: roomId },
        orderBy: { createdAt: 'asc' }
    })
}

export async function getChatRooms() {
    const session = await auth()
    if ((session?.user as any)?.role !== 'ADMIN') return []

    return await prisma.chatRoom.findMany({
        where: { isActive: true },
        include: { user: true },
        orderBy: { updatedAt: 'desc' }
    })
}
