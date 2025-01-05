'use client'

import React, { useState } from 'react'
import MessageList, {Message} from "@/components/Chats/MessageList";
import MessageInput from "@/components/Chats/MessageInput";



export default function GroupChat() {
  const [messages, setMessages] = useState<Message[]>([])

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      user: 'You',
      content,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage])
  }

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-indigo-700 text-white p-4">
        <h2 className="text-xl font-bold">Group Chat</h2>
      </div>
      <MessageList messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  )
}


