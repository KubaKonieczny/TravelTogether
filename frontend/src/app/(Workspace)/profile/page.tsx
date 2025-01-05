'use client'

import Image from 'next/image'
import EditProfileForm from "@/components/Forms/EditProfileForm";
import React, {useState} from "react";
import MainButton from "@/components/Buttons/MainButton";
import ChangePasswordForm from "@/components/Forms/ChangePasswordForm";
import {useSession} from "next-auth/react";
import MapWithSearch from "@/components/Map/MapWithSearch";
import getGroupsTripsData from "@/hooks/getGroupsTrips";
import CardsList from "@/components/Cards/CardsList";
import {APIProvider} from "@vis.gl/react-google-maps";


export default function ProfilePage() {
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);

    const { data: session,update } = useSession()


    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white shadow rounded-lg overflow-hidden mb-8">

                    <div className="h-48 bg-blue-600 relative">
                        <Image
                            src="/images/palms.jpg"
                            alt="Cover Image"
                            layout="fill"
                            objectFit="cover"
                            priority
                        />
                    </div>


                    <div className="relative px-4 py-5 sm:px-6">
                        <div className="absolute -top-16 left-4 w-32 h-32">
                            <Image
                                src={session?.user?.profile_picture || "/images/avatar.jpg"}
                                alt="Profile Picture"

                                fill
                                className="rounded-full border-4 border-white"
                            />
                        </div>
                        <div className="mt-16 sm:mt-0 sm:ml-40">
                            <h1 className="text-3xl font-bold text-gray-900">{session?.user?.first_name + " " + session?.user?.last_name }</h1>

                        </div>
                    </div>
                    <MainButton label={"Edit profile"} onclick={() => setShowEditProfile(true)}/>
                    <MainButton label={"Change Password"} onclick={() => setShowChangePassword(true)}/>

                    <div className="px-4 py-5 sm:px-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">About</h2>
                        <p className="text-gray-700">
                            {session?.user?.description}
                        </p>
                    </div>

                </div>


                <div className="px-4 py-5 sm:px-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">My Trips</h2>
                    <CardsList action={getGroupsTripsData('trips/past')} type={'trip'} label={"past trips"}/>
                </div>


                <div className="px-4 py-5 sm:px-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Travel Map</h2>
                    <div className="h-96 w-full">

                        <MapWithSearch />
                    </div>
                </div>
            </div>

            {showEditProfile && (
                <EditProfileForm onClose={() => setShowEditProfile(false)} buttonText={"Save profile"} />

            )}
            {showChangePassword && (
                <ChangePasswordForm onClose={() => setShowChangePassword(false)} buttonText={"Change password"} />


            )}
        </div>
        </APIProvider>

    )
}