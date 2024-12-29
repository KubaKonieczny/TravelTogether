"use client"
import Image from "next/image";
import TripList from "@/components/TripList";
import Map from "@/components/Common/Map";
import MainButton from "@/components/LandingPage/MainButton";
import React, {useEffect, useState} from "react";
import GroupProfile from "@/components/GroupProfile";
import axios from "axios";
import {useRouter} from "next/navigation";
import useGroupData from "@/hooks/useGroupData";
const members = [
    { id: 1, name: 'John Doe', avatar: '/placeholder.svg?height=40&width=40' },
    { id: 2, name: 'Jane Smith', avatar: '/placeholder.svg?height=40&width=40' },
    { id: 3, name: 'Bob Johnson', avatar: '/placeholder.svg?height=40&width=40' },
    { id: 4, name: 'Alice Brown', avatar: '/placeholder.svg?height=40&width=40' },
]

// async function getGroup(group_id: string) {
//
//     try {
//         const response = await axios.get(process.env.NEXT_PUBLIC_HOST + 'groups/' + group_id+'/',
//             {
//                 withCredentials: true
//             });
//
//         console.log(response);
//         return response.data;
//         // return { success: true, message: "Group created successfully", data: response.data };
//     } catch (error) {
//         if (axios.isAxiosError(error) && error.response) {
//             return {success: false, message: error.response.data.detail || "Failed to create group"};
//         }
//         return {success: false, message: "Failed to create group"};
//     }
// }

export default function Group({ params }) {

    const { group_id } = React.use(params)

    console.log(group_id)
    const { groupData, error, loading } = useGroupData(group_id);

    if (loading) return <p>Loading...</p>

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
            <GroupProfile
                name={groupData.name}
                description={groupData.description}
                coverImage={groupData.group_picture || "/images/group_profile.png"}
                members={members}
            />


                {/* Trips Section */}
                <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Trips</h2>
                    <div className="relative bottom-3">
                        <MainButton label={"Create new trip"}/>
                    </div>
                    </div>
                    <TripList/>
                </div>


                {/* Map Section */}
                <div className="px-4 py-5 sm:px-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Travel Map</h2>
                    <div className="h-96 w-full">
                        <h1>Chat</h1>
                    </div>
                </div>
            </div>
        </div>

    )
}