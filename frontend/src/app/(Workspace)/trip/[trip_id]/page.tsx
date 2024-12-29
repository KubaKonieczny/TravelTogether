'use client'

import React, { useState } from 'react'
import Chats from "@/components/Common/Chats";
import NavbarApp from "@/components/Common/NavbarApp";
import Map from "@/components/Common/Map";
import UtilityPanel from "@/components/Common/UtilityPanel";
import Chat from "@/components/Common/Chat";
import AuthGuard from "@/components/AuthGuard";
import { useSession, SessionProvider } from 'next-auth/react';
import { auth } from "@/auth"
import ScrollableTripPlanner from "@/components/ScrollableTripPlanner";
import {MapIcon} from "lucide-react";
import useGroupData from "@/hooks/useGroupData";
import useTripData from "@/hooks/useTripData";
import MapWithSearch from "@/components/Common/MapWithSearch";
export default function Trip({params}) {
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    // const session = auth()
    const [isMapVisible, setIsMapVisible] = useState(false);

    const { trip_id } = React.use(params)

    console.log(trip_id)
    const { TripData, error, loading } = useTripData(trip_id);

    const toggleMap = () => {
        setIsMapVisible(!isMapVisible);
    };

    // console.log(session?.user?.email)

    return (
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            <div className={`w-full lg:w-1/2 transition-all duration-300`}>
                <ScrollableTripPlanner />
            </div>

            {/* Map for larger screens */}
            <div className={` lg:w-1/2  w-0  transition-all duration-300 overflow-hidden`}>
                {/*<Map />*/}
                <MapWithSearch />
            </div>

            {/* Map toggle button for all screen sizes */}
            {!isMapVisible && (
            <button
                onClick={toggleMap}
                className="lg:hidden fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-10"
                aria-label="Toggle Map"
            >
                <MapIcon size={24} />
            </button>
            )}

             {/*Conditional map for mobile */}
            {isMapVisible && (
                <div className="lg:hidden fixed inset-0">
                    {/*<Map />*/}
                    <MapWithSearch />
                    <button
                        onClick={toggleMap}
                        className="absolute top-4 right-4 bg-white text-gray-800 p-2 rounded-full shadow-lg"
                        aria-label="Close Map"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    )
    {/* Navbar */
    }

    // <NavbarApp onClick={() => setIsPopupOpen(!isPopupOpen)} />

    {/* Main content */
    }
    // <div className="flex flex-1 overflow-hidden">
    {/* Left side */
    }


    {/* Pop-up */
    }

    {/*<Chats*/
    }
    {/*    isOpen={isPopupOpen}*/
    }
    {/*    onClick={() => setIsPopupOpen(false)}*/
    }

    {/*/>*/
    }


    {/*    </div>*/
    }
    {/*</div>)}*/
    }
}





