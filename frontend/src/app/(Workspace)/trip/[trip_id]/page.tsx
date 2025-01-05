'use client'

import React, { useState } from 'react'
import TripPlanner from "@/components/Utils/TripPlanner";
import {MapIcon} from "lucide-react";
import useTripData from "@/hooks/useTripData";
import MapWithSearch from "@/components/Map/MapWithSearch";
import {APIProvider} from "@vis.gl/react-google-maps";


export default function Trip({params}) {

    const [isMapVisible, setIsMapVisible] = useState(false);

    const { trip_id } = React.use(params)
    const { tripData, error, loading } = useTripData(trip_id);

    if (loading) return <p>Loading...</p>


    const toggleMap = () => {
        setIsMapVisible(!isMapVisible);
    };



    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            <div className={`w-full lg:w-1/2 transition-all duration-300`}>
                <TripPlanner data={tripData} />
            </div>

            <div className={` lg:w-1/2  w-0  transition-all duration-300 overflow-hidden`}>
                <MapWithSearch itineraryData={tripData}/>
            </div>

            {!isMapVisible && (
            <button
                onClick={toggleMap}
                className="lg:hidden fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-10"
                aria-label="Toggle Map"
            >
                <MapIcon size={24} />
            </button>
            )}


            {isMapVisible && (
                <div className="lg:hidden fixed inset-0">

                    <MapWithSearch itineraryData={tripData} />
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
        </APIProvider>

    )

}





