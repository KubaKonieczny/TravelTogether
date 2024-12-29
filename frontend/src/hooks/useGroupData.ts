"use client"
import { useState, useEffect } from "react";
import axios from "axios";

export default function useGroupData(group_id: string) {
    const [groupData, setGroupData] = useState<{ name: string; description: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchGroupData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_HOST}groups/${group_id}/`,
                    { withCredentials: true }
                );
                setGroupData(response.data);
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

        fetchGroupData();
    }, [group_id]);

    return { groupData, error, loading };
}