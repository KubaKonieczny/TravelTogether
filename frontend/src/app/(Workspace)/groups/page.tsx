"use client"



import MainButton from "@/components/LandingPage/MainButton";
import TripList from "@/components/TripList";
import React, {useState} from "react";
import CreateGroupForm from "@/components/Forms/CreateGroupForm";
import GroupList from "@/components/GroupList";
import getGroupsData from "@/hooks/getGroups";
import getRecommendedGroups from "@/hooks/getGroups";

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
                <GroupList action={getGroupsData('groups')} type={'group'}/>

            </div>

            <div className="px-4 py-5 sm:px-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Group Trips</h2>
                {/*<TripList/>*/}
                <GroupList action={getGroupsData('trips')} type={'trip'} />
            </div>

            <div className="px-4 py-5 sm:px-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Groups</h2>
                <GroupList action={getGroupsData('groups/recommended')} type={'group'} />
            </div>

            {showCreateGroup && (

                    <CreateGroupForm onClose={() =>setShowCreateGroup(false)} buttonText={"Create group"}/>

                )
            }
        </div>


    )
};