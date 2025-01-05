"use client"
import { useState, useEffect } from "react";
import axios from "axios";

export default function getGroupsTrips(path: string) {
    const [Data, setData] = useState<{ name: string; description: string } | null>(null);
    const [error2, setError] = useState<string | null>(null);
    const [loading2, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_HOST}${path}/`,
                    {withCredentials: true}
                );
                setData(response.data);
                setError(null); // Clear any previous errors
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setError(error.response.data.detail || "Failed to fetch group data");
                } else {
                    setError("An unexpected error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return {data: Data, error2, loading2};
}
