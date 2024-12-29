"use client"
import { useState, useEffect } from "react";
import axios from "axios";

export default function useTripData(trip_id: string) {
    const [tripData, setTripData] = useState<{ name: string; description: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTripData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_HOST}trips/${trip_id}/`,
                    { withCredentials: true }
                );
                setTripData(response.data);
                setError(null); // Clear any previous errors
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setError(error.response.data.detail || "Failed to fetch trip data");
                } else {
                    setError("An unexpected error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTripData();
    }, [trip_id]);

    return { tripData, error, loading };
}