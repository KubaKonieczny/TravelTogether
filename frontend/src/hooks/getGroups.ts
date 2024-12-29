"use client"
import { useState, useEffect } from "react";
import axios from "axios";

export default function getGroupsData(path: string) {
    const [groupsData, setGroupsData] = useState<{ name: string; description: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchGroupsData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_HOST}${path}/`,
                    {withCredentials: true}
                );
                setGroupsData(response.data);
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

        fetchGroupsData();
    }, []);

    return {groupsData, error, loading};
}


