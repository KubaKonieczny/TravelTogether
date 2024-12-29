"use client"
import Image from "next/image";


import TripList from "@/components/TripList";
import Map from "@/components/Common/Map";
import MainButton from "@/components/LandingPage/MainButton";
import React, {useState} from "react";
import {useSession} from "next-auth/react";
import CreateTripForm from "@/components/Forms/CreateTripForm";
import GoogleMapsAutocomplete from "@/components/utils/GoogleAutoComplite";
import MapWithSearch from "@/components/Common/MapWithSearch";


export default function Dashboard() {
    const [showCreateTrip, setShowCreateTrip] = useState(false);

    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const { data: session } = useSession()
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
                {/*<GoogleMapsAutocomplete apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''} />*/}
                {/* Trips Section */}
                <div className="px-4 py-5 sm:px-6">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-10">{"Welcome, " + session?.user?.first_name + " " + session?.user?.last_name}</h1>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming trips</h2>
                    <TripList/>
                    <div className="relative bottom-3">
                        <MainButton label={"Create new trip"} onclick={() => setShowCreateTrip(true)}/>
                    </div>

                </div>


                {/* Map Section */}
                <div className="px-4 py-5 sm:px-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Travel Map</h2>
                    <div className="h-96 w-full">
                        {/*<Map/>*/}
                        <MapWithSearch />
                    </div>
                </div>
            </div>
            {showCreateTrip && (
                <CreateTripForm onClose={() =>setShowCreateTrip(false)} buttonText={"Create trip"}/>
            )
            }
        </div>

    )
}