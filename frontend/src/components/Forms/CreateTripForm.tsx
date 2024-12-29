'use client';

import React from "react";
import Form from "./Form";
import EditForm from "@/components/Forms/EditForm";
import {updateProfile} from "@/hooks/updateProfile";
import {getSession, useSession} from "next-auth/react";
import {createGroup} from "@/hooks/createGroup";
import CreateForm from "@/components/Forms/CreateForm";
import {createTrip} from "@/hooks/createTrip";
;

interface GroupFormProps {
    onClose: () => void;
    buttonText: string;
}

export default function CreateTripForm({ onClose,  buttonText }: GroupFormProps) {

    const trip_data = null


    const groupConfig = [
        {
            labelText: "Trip Picture",
            labelId: "trip_picture",
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
        {
            labelText: "Start Date",
            labelId: "start_date",
            autoComplete: "off",
            type: "date",
            required: true,
        },
        {
            labelText: "End Date",
            labelId: "end_date",
            autoComplete: "off",
            type: "date",
            required: true,
        },

    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">{buttonText}</h2>
                <CreateForm
                    config={groupConfig}
                    buttonText={buttonText}
                    action={createTrip}
                    onClose={onClose}
                    redirectTo={"trip"}
                />

            </div>
        </div>
    );
}
