"use client"

import MainButton from "@/components/Buttons/MainButton";

import React, {useState} from "react";
import CreateGroupForm from "@/components/Forms/CreateGroupForm";
import CardsList from "@/components/Cards/CardsList";
import getGroupsTripsData from "@/hooks/getGroupsTrips";


export default function Groups() {
    const [showCreateGroup, setShowCreateGroup] = useState(false);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center space-x-4">

                    <h2 className="text-xl font-semibold text-gray-900 m-0">My Groups</h2>

                    <div className="relative bottom-3">
                        <MainButton label={"Create new group"} onclick={() => setShowCreateGroup(true)}/>
                    </div>
                </div>
                <CardsList action={getGroupsTripsData('groups')} type={'group'} label={"groups"}/>

            </div>

            <div className="px-4 py-5 sm:px-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Group Trips</h2>

                <CardsList action={getGroupsTripsData('trips')} type={'trip'} label={"group trips planned"} />
            </div>

            <div className="px-4 py-5 sm:px-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Groups</h2>
                <CardsList action={getGroupsTripsData('groups/recommended')} type={'group'} label={"recommended groups"} />
            </div>

            {showCreateGroup && (

                    <CreateGroupForm onClose={() =>setShowCreateGroup(false)} buttonText={"Create group"}/>

                )
            }
        </div>


    )
};