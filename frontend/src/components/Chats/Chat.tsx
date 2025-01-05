'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Minus,  Send } from 'lucide-react'

interface Message {
    id: number
    text: string
    sender: 'user' | 'other'
}

export default function ChatPopup() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hi there! How can I help you today?", sender: 'other' },
    ])
    const [inputMessage, setInputMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (inputMessage.trim()) {
            const newMessage: Message = {
                id: messages.length + 1,
                text: inputMessage,
                sender: 'user'
            }
            setMessages([...messages, newMessage])
            setInputMessage('')


            setTimeout(() => {
                const responseMessage: Message = {
                    id: messages.length + 2,
                    text: "Thanks for your message. How else can I assist you?",
                    sender: 'other'
                }
                setMessages(prevMessages => [...prevMessages, responseMessage])
            }, 1000)
        }
    }



    return (
        <div className={`fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl ${isMinimized ? 'h-12' : 'h-96'} flex flex-col transition-all duration-300 ease-in-out`}>
            <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="font-semibold">John Doe</span>
                </div>
                <div className="flex space-x-2">
                    <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized) }} className="focus:outline-none" aria-label={isMinimized ? "Expand chat" : "Minimize chat"}>
                        <Minus className="h-5 w-5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setIsOpen(false) }} className="focus:outline-none" aria-label="Close chat">
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>
            {!isMinimized && (
                <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {messages.map((message) => (
                            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    {message.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-3 bg-gray-100 rounded-b-lg">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                aria-label="Send message"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    )
}