'use client'

import Image from 'next/image'
import { useState } from 'react'
import MainButton from "@/components/LandingPage/MainButton";

interface Member {
    id: number;
    name: string;
    avatar: string;
}

interface GroupProfileProps {
    name: string;
    description: string;
    coverImage: string;
    members: Member[];
}

export default function GroupProfile({ name, description, coverImage, members }: GroupProfileProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                <div className="md:flex">
                    {/* Group Information */}
                    <div className="md:w-1/2 p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
                        <p className="text-gray-700 mb-4">{description}</p>

                        <MainButton label={"Show Members"} onclick={() => setIsOpen(true)} />

                    </div>

                    {/* Group Photo */}
                    <div className="md:w-1/2 h-64 md:h-auto relative">
                        <Image
                            src={coverImage}
                            alt="Group Cover Image"
                            layout="fill"
                            objectFit="cover"
                            priority
                        />
                    </div>
                </div>
            </div>

            {/* Members Popup */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Group Members</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {members.map((member) => (
                                <div key={member.id} className="flex items-center space-x-3">
                                    <Image
                                        src={member.avatar}
                                        alt={member.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                    <span>{member.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

