'use client'

import React, { useState } from 'react'
import Chats from "@/components/Dashboard/Chats";
import NavbarApp from "@/components/Dashboard/NavbarApp";
import Map from "@/components/Dashboard/Map";
import UtilityPanel from "@/components/Dashboard/UtilityPanel";
import Chat from "@/components/Dashboard/Chat";

export default function MapLayout() {
    const [isPopupOpen, setIsPopupOpen] = useState(false)

    return (
        <div className="flex flex-col h-screen">
            {/* Navbar */}

            <NavbarApp onClick={() => setIsPopupOpen(!isPopupOpen)} />

            {/* Main content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left side */}
                <div className="w-3/5 bg-gray-100">
                    <UtilityPanel />
                </div>

                {/* Map */}

                <div className="w-2/5 relative">
                    <Map/>
                </div>

                {/* Pop-up */}

                <Chats
                    isOpen={isPopupOpen}
                    onClick={() => setIsPopupOpen(false)}

                />


            </div>
        </div>
    )
}