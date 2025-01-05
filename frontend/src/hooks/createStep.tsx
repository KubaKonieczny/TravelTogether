"use client"
import axios from "axios";


export async function createStep(prevState: any, formData: FormData) {

    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_HOST+ 'trips/1/create_step/',
            formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

        return { success: true, message: "Group created successfully", data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { success: false, message: error.response.data.detail || "Failed to create group" };
        }
        return { success: false, message: "Failed to create group" };
    }
}