"use client"
import Map from "@/components/Common/Map";
import UtilityPanel from "@/components/Common/UtilityPanel";
import React, {useState} from "react";
import TripList from "@/components/TripList";
import MainButton from "@/components/LandingPage/MainButton";
import CreateTripForm from "@/components/Forms/CreateTripForm";
export default function Trips() {

    const [showCreateTrip, setShowCreateTrip] = useState(false);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center space-x-4">

                    <h2 className="text-xl font-semibold text-gray-900 m-0">My Trips</h2>


                    <div className="relative bottom-3">
                        <MainButton label={"Create new trip"} onclick={() => setShowCreateTrip(true)}/>
                    </div>


                </div>
                <TripList/>
            </div>

            <div className="px-4 py-5 sm:px-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Group Trips</h2>
                <TripList/>
            </div>

            <div className="px-4 py-5 sm:px-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Trips</h2>
                <TripList/>
            </div>
            {showCreateTrip && (
                <CreateTripForm onClose={() =>setShowCreateTrip(false)} buttonText={"Create trip"}/>
                )
            }
        </div>

    )
};