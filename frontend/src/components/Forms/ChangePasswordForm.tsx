'use client';

import React from "react";
import {changePassword} from "@/hooks/changePassword";
import EditForm from "@/components/Forms/EditForm";

interface ChangePasswordFormProps {
    onClose: () => void;
    buttonText: string;
}


export default function ChangePasswordForm({ onClose,  buttonText }: ChangePasswordFormProps) {
    const passwordConfig = [
        {
            labelText: "Old Password",
            labelId: "old_password",
            autoComplete: "current-password",
            type: "password",
            required: true,
        },
        {
            labelText: "New Password",
            labelId: "new_password1",
            autoComplete: "new-password",
            type: "password",
            required: true,
        },
        {
            labelText: "Confirm New Password",
            labelId: "new_password2",
            autoComplete: "new-password",
            type: "password",
            required: true,
        },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Change Password</h2>
                <EditForm
                    config={passwordConfig}
                    buttonText={buttonText}
                    action={changePassword} // () => setShowPasswordForm(false)
                    onClose={onClose}
                />
            </div>
        </div>
    );
}
