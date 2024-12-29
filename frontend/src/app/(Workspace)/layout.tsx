"use client";
import React, {useState} from "react";
import {SessionProvider} from "next-auth/react";
import AuthGuard from "@/components/AuthGuard";
import NavbarApp from "@/components/Common/NavbarApp";
import Chats from "@/components/Common/Chats";
import {LoadScript} from "@react-google-maps/api";



export default function RootLayout({children}: { children: React.ReactNode }) {
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    console.log('isPopupOpen', isPopupOpen)

    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    return (
        <SessionProvider>
            <NavbarApp onClick={() => setIsPopupOpen(!isPopupOpen)}/>
            <div className="flex flex-col h-screen">
            {/*    <div className="flex flex-1 overflow-hidden">*/}
                <LoadScript googleMapsApiKey={googleMapsApiKey}>
                {children}

                <Chats
                    isOpen={isPopupOpen}
                    onClick={() => setIsPopupOpen(false)}/>
                </LoadScript>
            </div>

            {/*    </div>*/}
            {/*</div>*/}

        </SessionProvider>
);
}
