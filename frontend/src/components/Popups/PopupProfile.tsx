'use client'

import Image from "next/image";
import React, {useState} from 'react'
import { LogOut, User} from 'lucide-react'
import {signOut, useSession} from "next-auth/react";
import Link from "next/link";



export default function PopupProfile() {
    const [isOpen, setIsOpen] = useState(false)

    const togglePopup = () => setIsOpen(!isOpen)
    const { data: session } = useSession()


    return (
        <div className="">
            <button
                onClick={togglePopup}
                className="w-10 h-10 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <div className="relative w-full h-full">
                    <Image
                        src={session?.user?.profile_picture || "/images/avatar.jpg"}
                        alt="Profile"
                        className="object-cover"
                        fill
                    />
                </div>

            </button>
            {isOpen && (
                <div className="z-50 absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-4">
                        <div className="flex items-center space-x-4">
                            <div className="relative w-16 h-16 ">
                                <Image
                                    src={session?.user?.profile_picture || "/images/avatar.jpg"}
                                    alt="John Doe"
                                    fill
                                    className="rounded-full"

                                />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-black">{session?.user?.first_name + " " + session?.user?.last_name } </h2>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                             <h2 className="text-sm text-gray-600">
                                 {session?.user?.description}
                             </h2>

                        </div>

                    </div>
                    <hr className="border-gray-200" />
                    <div className="p-4 space-y-2">
                        <button onClick={togglePopup} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            <Link href={"/profile"}>View Profile</Link>

                        </button>

                        <button onClick={() => signOut()}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 flex items-center">
                            <LogOut className="w-4 h-4 mr-2"/>
                            Log Out
                        </button>


                    </div>
                    <hr className="border-gray-200"/>

                </div>
            )}
        </div>
    )
}