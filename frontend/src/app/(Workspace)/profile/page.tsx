'use client'

import Image from 'next/image'
import TripList from "@/components/TripList";
import Map from "@/components/Common/Map"
import EditProfileForm from "@/components/Forms/EditProfileForm";
import React, {useState} from "react";
import MainButton from "@/components/LandingPage/MainButton";
import ChangePasswordForm from "@/components/Forms/ChangePasswordForm";
import {useSession} from "next-auth/react";
import MapWithSearch from "@/components/Common/MapWithSearch";

// export default function ProfilePage() {
//     return (
//         <div className="min-h-screen bg-gray-100">
//             <div className="container mx-auto px-4 py-8">
//                 <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
//                     {/* Cover Image */}
//                     <div className="h-48 bg-blue-600 relative">
//                         <Image
//                             src="/palms.jpg"
//                             alt="Cover Image"
//                             layout="fill"
//                             objectFit="cover"
//                             priority
//                         />
//                     </div>
//
//                     {/* Profile Information */}
//                     <div className="relative px-4 py-5 sm:px-6">
//                         <div className="absolute -top-16 left-4">
//                             <Image
//                                 src="/avatar.jpg"
//                                 alt="Profile Picture"
//                                 width={128}
//                                 height={128}
//                                 className="rounded-full border-4 border-white"
//                             />
//                         </div>
//                         <div className="mt-16 sm:mt-0 sm:ml-40">
//                             <h1 className="text-3xl font-bold text-gray-900">John Doe</h1>
//                             <p className="text-xl text-gray-600">Travel Enthusiast</p>
//                             <p className="mt-1 text-sm text-gray-500">New York, USA</p>
//                         </div>
//                     </div>
//
//                     {/* About Section */}
//                     <div className="px-4 py-5 sm:px-6">
//                         <h2 className="text-xl font-semibold text-gray-900 mb-2">About</h2>
//                         <p className="text-gray-700">
//                             Passionate traveler with a love for exploring new cultures and cuisines.
//                             Always seeking the next adventure and sharing experiences with fellow travelers.
//                         </p>
//                     </div>
//                 </div>
//
//                 {/* Trips Section */}
//                 <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
//                     <div className="px-4 py-5 sm:px-6">
//                         <h2 className="text-xl font-semibold text-gray-900 mb-4">My Trips</h2>
//                         <TripList />
//                     </div>
//                 </div>
//
//                 {/* Map Section */}
//                 <div className="bg-white shadow rounded-lg overflow-hidden">
//                     <div className="px-4 py-5 sm:px-6">
//                         <h2 className="text-xl font-semibold text-gray-900 mb-4">Travel Map</h2>
//                         <div className="h-96 w-full">
//                             <Map />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
export default function ProfilePage() {
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);

    const { data: session,update } = useSession()

    const handleEditProfile = async (formData: FormData) => {
        // Handle profile edit submission
        console.log('Profile edited:', Object.fromEntries(formData));
        setShowEditProfile(false);
    };

    // const handlePasswordChange = async (formData: FormData) => {
    //     // Handle profile edit submission
    //     console.log('Password changed:', Object.fromEntries(formData));
    //     setShowEditProfile(false);
    // };



    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                    {/* Cover Image */}
                    <div className="h-48 bg-blue-600 relative">
                        <Image
                            src="/images/palms.jpg"
                            alt="Cover Image"
                            layout="fill"
                            objectFit="cover"
                            priority
                        />
                    </div>

                    {/* Profile Information */}
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
                            {/*<p className="text-xl text-gray-600">Travel Enthusiast</p>*/}
                            {/*<p className="mt-1 text-sm text-gray-500">New York, USA</p>*/}
                        </div>
                    </div>
                    <MainButton label={"Edit profile"} onclick={() => setShowEditProfile(true)}/>
                    <MainButton label={"Change Password"} onclick={() => setShowChangePassword(true)}/>
                    {/* About Section */}
                    <div className="px-4 py-5 sm:px-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">About</h2>
                        <p className="text-gray-700">
                            {session?.user?.description}
                        </p>
                    </div>


                </div>


                {/* Trips Section */}
                <div className="px-4 py-5 sm:px-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">My Trips</h2>
                    <TripList/>
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

            {showEditProfile && (

                <EditProfileForm onClose={() => setShowEditProfile(false)} buttonText={"Save profile"} />
                // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                //     <div className="bg-white rounded-lg p-6 max-w-md w-full">
                //         <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                //         <EditProfileForm onSubmit={handleEditProfile} />
                //         <button
                //             onClick={() => setShowEditProfile(false)}
                //             className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                //         >
                //             Cancel
                //         </button>
                //     </div>
                // </div>
            )}
            {showChangePassword && (
                <ChangePasswordForm onClose={() => setShowChangePassword(false)} buttonText={"Change password"} />


                // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                //     <div className="bg-white rounded-lg p-6 max-w-md w-full">
                //         <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                //
                //         <button
                //             onClick={() => setShowChangePassword(false)}
                //             className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                //         >
                //             Cancel
                //         </button>
                //     </div>
                // </div>
            )}
        </div>

    )
}