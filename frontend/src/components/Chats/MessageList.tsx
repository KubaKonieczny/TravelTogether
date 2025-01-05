import React from 'react'


export interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[]
}

export default function MessageList({ messages }:MessageListProps){
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div key={message.id} className={`flex ${message.user === 'You' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            message.user === 'You' ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-gray-800'
          }`}>
            <div className="font-bold">{message.user}</div>
            <div>{message.content}</div>
            <div className="text-xs mt-1 opacity-75">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


