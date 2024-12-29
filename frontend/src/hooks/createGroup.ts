"use client"
import axios from "axios";

import {useRouter} from "next/navigation";

export async function createGroup(prevState: any, formData: FormData) {

    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_HOST+ 'groups/create_group/',
            formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

        console.log(response);

        return { success: true, message: "Group created successfully", data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { success: false, message: error.response.data.detail || "Failed to create group" };
        }
        return { success: false, message: "Failed to create group" };
    }
}