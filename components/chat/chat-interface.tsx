'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { sendMessage } from '@/actions/chat-actions'
import { toast } from 'sonner'
import Pusher from 'pusher-js'

type Message = {
  id: string
  content: string
  senderId: string
  createdAt: Date
}

type ChatRoom = {
  id: string
  user: {
    id: string
    name: string | null
    email: string
  }
  messages: Message[]
}

export function ChatInterface({ chatRooms, isAdmin }: { chatRooms: ChatRoom[], isAdmin: boolean }) {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(chatRooms[0] || null)
  const [messages, setMessages] = useState<Message[]>(selectedRoom?.messages || [])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Pusher real-time
  useEffect(() => {
    if (!selectedRoom) return

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
    })

    const channel = pusher.subscribe(`chat-${selectedRoom.id}`)
    
    channel.bind('new-message', (data: Message) => {
      setMessages(prev => [data, ...prev])
    })

    return () => {
      pusher.unsubscribe(`chat-${selectedRoom.id}`)
    }
  }, [selectedRoom])

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load messages when room changes
  useEffect(() => {
    if (selectedRoom) {
      // Fetch full messages
      fetch(`/api/chat/${selectedRoom.id}/messages`)
        .then(res => res.json())
        .then(data => setMessages(data))
    }
  }, [selectedRoom])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || !selectedRoom) return

    setLoading(true)
    const result = await sendMessage(selectedRoom.id, newMessage, isAdmin ? 'ADMIN' : selectedRoom.user.id)
    
    if (result.success) {
      setNewMessage('')
    } else {
      toast.error('Failed to send message')
    }
    setLoading(false)
  }

  if (!selectedRoom) {
    return <div className="text-center p-8">No chat rooms available</div>
  }

  return (
    <div className="grid grid-cols-4 gap-4 h-[600px]">
      {/* Chat rooms list */}
      <div className="col-span-1 border rounded-lg p-4 overflow-y-auto">
        <h3 className="font-semibold mb-4">Conversations</h3>
        {chatRooms.map(room => (
          <div
            key={room.id}
            onClick={() => setSelectedRoom(room)}
            className={`p-3 rounded cursor-pointer mb-2 ${
              selectedRoom?.id === room.id ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'
            }`}
          >
            <p className="font-medium">{room.user.name || room.user.email}</p>
            {room.messages[0] && (
              <p className="text-xs truncate opacity-70">{room.messages[0].content}</p>
            )}
          </div>
        ))}
      </div>

      {/* Chat messages */}
      <div className="col-span-3 border rounded-lg flex flex-col">
        {/* Header */}
        <div className="border-b p-4">
          <h3 className="font-semibold">{selectedRoom.user.name || selectedRoom.user.email}</h3>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col-reverse">
          <div ref={messagesEndRef} />
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === 'ADMIN' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.senderId === 'ADMIN'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-100'
                }`}
              >
                <p>{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="border-t p-4 flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </div>
    </div>
  )
}