'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send } from "lucide-react"
import Pusher from 'pusher-js'
import { createChatRoom, sendMessage, getMessages } from "@/actions/chat-actions"
import { useSession } from "next-auth/react"

export function ChatWidget() {
    const { data: session } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const [roomId, setRoomId] = useState<string | null>(null)
    const [messages, setMessages] = useState<any[]>([])
    const [input, setInput] = useState("")

    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isOpen && session && !roomId) {
            createChatRoom().then(res => {
                if (res.roomId) {
                    setRoomId(res.roomId)
                    getMessages(res.roomId).then(setMessages)
                }
            })
        }
    }, [isOpen, session, roomId])

    useEffect(() => {
        if (!roomId) return

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });

        const channel = pusher.subscribe(`chat-${roomId}`);
        channel.bind('new-message', (data: any) => {
            setMessages((prev) => [...prev, data]);
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
        });

        return () => {
            pusher.unsubscribe(`chat-${roomId}`);
        };
    }, [roomId]);

    const handleSend = async () => {
        if (!input.trim() || !roomId) return
        await sendMessage(roomId, input)
        setInput("")
    }

    if (!session) return null

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen && (
                <Button size="icon" className="h-12 w-12 rounded-full shadow-lg" onClick={() => setIsOpen(true)}>
                    <MessageCircle className="h-6 w-6" />
                </Button>
            )}

            {isOpen && (
                <div className="bg-background border rounded-lg shadow-xl w-80 h-96 flex flex-col">
                    <div className="p-3 border-b flex justify-between items-center bg-primary text-primary-foreground rounded-t-lg">
                        <h3 className="font-semibold">Support Chat</h3>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground hover:bg-primary/80" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex-grow overflow-y-auto p-4 space-y-3">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.senderId === (session.user as any).id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-lg p-2 text-sm ${msg.senderId === (session.user as any).id ? 'bg-primary text-primary-foreground' : 'bg-gray-100'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    <div className="p-3 border-t flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <Button size="icon" onClick={handleSend}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}