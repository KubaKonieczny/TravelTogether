"use client"

import MainButton from "@/components/Buttons/MainButton";
import React from "react";
import GroupProfile from "@/components/Utils/GroupProfile";
import useGroupData from "@/hooks/useGroupData";
import GroupChat from "@/components/Chats/GroupChat";
import CardsList from "@/components/Cards/CardsList";
import getGroupsTrips from "@/hooks/GroupTrips";


const members = [
    { id: 1, name: 'Test User1', avatar: '/images/avatar.jpg' },
    { id: 2, name: 'Test User2', avatar: '/images/avatar.jpg' },
    { id: 3, name: 'Test User3', avatar: '/images/avatar.jpg' },
    { id: 4, name: 'Test User4', avatar: '/images/avatar.jpg' },
]


export default function Group({ params }) {

    const { group_id } = React.use(params)

    const { groupData, error, loading } = useGroupData(group_id);

    const { data, error2, loading2 } = getGroupsTrips('trips');

    if (loading) return <p>Loading...</p>
    if (loading2) return <p>Loading...</p>

    console.log(data)
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
            <GroupProfile
                name={groupData.name}
                description={groupData.description}
                coverImage={groupData.group_picture || "/images/group_profile.png"}
                members={members}
            />

                <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Trips</h2>
                    <div className="relative bottom-3">
                        <MainButton label={"Create new trip"}/>
                    </div>
                    </div>
                    <CardsList data = {data} type={'trip'} label={"group trips planned"} />
                </div>


                <div className="px-4 py-5 sm:px-6">
                    <div className="h-96 w-full flex flex-row ">
                        <div className="flex-1">
                            <GroupChat />
                        </div>
                        <div className="flex-1">

                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}