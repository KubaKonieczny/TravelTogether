'use client';

import React from "react";
import EditForm from "@/components/Forms/EditForm";
import {updateProfile} from "@/hooks/updateProfile";
import {getSession, useSession} from "next-auth/react";


interface EditProfileFormProps {
    onClose: () => void;
    buttonText: string;
}

export default function EditProfileForm({ onClose,  buttonText }: EditProfileFormProps) {

    const { data: session, update } = useSession()


    const handleSubmit = async (prevState: any, formData: FormData) => {

        const result = await updateProfile(prevState, formData);
        console.log(result)

        if (result.success) {

            await update({
                ...session,
                user: {
                    ...session?.user,
                    first_name: result.user.first_name,
                    last_name: result.user.last_name,
                    description: result.user.description,
                    profile_picture: result.user.profile_picture

                }
            });
            console.log('Session after update:', await getSession());
            onClose();

        }

        return result;
    };


    const profileConfig = [
        {
            labelText: "Profile Picture",
            labelId: "profile_picture",
            autoComplete: "off",
            type: "file",
            required: false,
        },
        {
            labelText: "First Name",
            labelId: "first_name",
            autoComplete: "given-name",
            type: "text",
            required: true,
        },
        {
            labelText: "Last Name",
            labelId: "last_name",
            autoComplete: "family-name",
            type: "text",
            required: true,
        },
        {
            labelText: "Description",
            labelId: "description",
            autoComplete: "off",
            type: "textarea",
            required: false,
        },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Update Profile</h2>
                <EditForm
                    config={profileConfig}
                    buttonText={buttonText}
                    action={handleSubmit}
                    onClose={onClose}
                    initialValues={session?.user}
                />
            </div>
        </div>
    );
}
