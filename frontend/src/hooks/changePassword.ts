'use client'

import { z } from 'zod'
import axios from 'axios'

const PasswordChangeSchema = z.object({
    old_password: z.string().min(1, "Old password is required"),
    new_password1: z.string()
        .min(8, "Password must be at least 8 characters long.")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character."),
    new_password2: z.string(),
}).refine((data) => data.new_password1 === data.new_password2, {
    message: "Passwords don't match",
    path: ["new_password2"],
});

export async function changePassword(prevState: any, formData: FormData) {
    const validatedFields = PasswordChangeSchema.safeParse({
        old_password: formData.get('old_password'),
        new_password1: formData.get('new_password1'),
        new_password2: formData.get('new_password2'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_HOST+ 'auth/password-change/',
            validatedFields.data, {
                withCredentials: true

            });


        return { success: true, message: "Password changed successfully" };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { success: false, message: error.response.data.detail || "Failed to change password" };
        }
        return { success: false, message: "Failed to change password" };
    }
}