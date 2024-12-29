"use client"
import axios from "axios";

import {useRouter} from "next/navigation";

export async function createTrip(prevState: any, formData: FormData) {

    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_HOST+ 'trips/create_trip/',
            formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

        console.log(response);

        return { success: true, message: "Trip created successfully", data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { success: false, message: error.response.data.detail || "Failed to create new trip" };
        }
        return { success: false, message: "Failed to create new trip" };
    }
}