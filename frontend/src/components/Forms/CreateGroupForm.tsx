'use client';

import React from "react";
import Form from "./Form";
import EditForm from "@/components/Forms/EditForm";
import {updateProfile} from "@/hooks/updateProfile";
import {getSession, useSession} from "next-auth/react";
import {createGroup} from "@/hooks/createGroup";
import CreateForm from "@/components/Forms/CreateForm";
;

interface GroupFormProps {
    onClose: () => void;
    buttonText: string;
}

export default function CreateGroupForm({ onClose,  buttonText }: GroupFormProps) {

    const group_data = null


    const groupConfig = [
        {
            labelText: "Group Picture",
            labelId: "group_picture",
            autoComplete: "off",
            type: "file",
            required: false,
        },

        {
            labelText: "Name",
            labelId: "name",
            autoComplete: "off",
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
                <h2 className="text-xl font-bold mb-4">{buttonText}</h2>
                <CreateForm
                    config={groupConfig}
                    buttonText={buttonText}
                    action={createGroup}
                    onClose={onClose}
                    redirectTo={"group"}
                />

            </div>
        </div>
    );
}
