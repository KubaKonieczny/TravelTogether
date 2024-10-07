'use client'
import Image from "next/image";
import { useState } from 'react'
import {MessageCircle, UserPlus, Settings, LogOut, User} from 'lucide-react'


export default function PopupProfile() {
    const [isOpen, setIsOpen] = useState(false)

    const togglePopup = () => setIsOpen(!isOpen)

    return (
        <div className="relative z-50">
            <button
                onClick={togglePopup}
                className="w-10 h-10 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <div className="relative w-full h-full">
                    <Image
                        src="/avatar.jpg"
                        alt="Profile"
                        className="object-cover"
                        fill
                    />
                </div>

            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-4">
                        <div className="flex items-center space-x-4">
                            <div className="relative w-16 h-16 ">
                                <Image
                                    src="/avatar.jpg"
                                    alt="John Doe"
                                    fill
                                    className="rounded-full"

                                />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-black">John Doe</h2>
                                <p className="text-sm text-gray-600">Junior traveler</p>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                             <h2 className="text-sm text-gray-600">
                                 ply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets
                             </h2>

                        </div>

                    </div>
                    <hr className="border-gray-200" />
                    <div className="p-4 space-y-2">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            View Profile
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 flex items-center">
                            <LogOut className="w-4 h-4 mr-2" />
                            Log Out
                        </button>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="bg-gray-50 p-4 flex justify-between">
                        <button className="flex-1 mr-2 bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <MessageCircle className="w-4 h-4 mr-2 inline" />
                            Message
                        </button>
                        <button className="flex-1 bg-white text-gray-700 px-4 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <UserPlus className="w-4 h-4 mr-2 inline" />
                            Connect
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}