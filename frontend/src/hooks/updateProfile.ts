'use client'
import {auth} from '@/auth'

import { z } from 'zod'
import axios from 'axios'

async function uploadToGoogleCloud(file: File) {
    try {
        // First, get the signed URL from your backend
        const getUrlResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_HOST}storage/upload-url/`,
            {
                params: { filename: file.name },
                withCredentials: true
            }
        );

        const { uploadUrl, publicUrl } = getUrlResponse.data;

        // Upload the file directly to Google Cloud Storage
        await axios.put(uploadUrl, file, {
            headers: {
                'Content-Type': file.type,
            },
        });

        return publicUrl;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('Failed to upload profile picture');
    }
}



const ProfileSchema = z.object({
    profile_picture: z.any().optional(),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    description: z.string().optional(),
});

export async function updateProfile(prevState: any, formData: FormData) {
    const obj = Object.fromEntries(formData)
    console.log(obj)

    const validatedFields = ProfileSchema.safeParse({
        profile_picture: formData.get('profile_picture'),
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        description: formData.get('description'),
    });
    console.log(validatedFields.data)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    try {

        const requestFormData = new FormData();

        // Add all fields to FormData
        if (validatedFields.data.profile_picture instanceof File) {
            requestFormData.append('profile_picture', validatedFields.data.profile_picture);
        }
        requestFormData.append('first_name', validatedFields.data.first_name);
        requestFormData.append('last_name', validatedFields.data.last_name);
        if (validatedFields.data.description) {
            requestFormData.append('description', validatedFields.data.description);
        }
        const response = await axios.patch(process.env.NEXT_PUBLIC_HOST+ 'user/update_profile/',
            requestFormData,
            {
                withCredentials:true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
        });

        return { success: true, message: "Profile updated successfully", user: response.data };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { success: false, message: error.response.data.detail || "Failed to update profile" };
        }
        return { success: false, message: "Failed to update profile" };
    }
}
