import { API_BASE_URL, API_key } from "@/config";

export interface User {
    userId: number;
    email: string;
    role: string;
    phoneNumber: string | null;
    createdAt: string;
}

export const fetchUsers = async (): Promise<User[]> => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (response.status === 401) {
        throw new Error("Unauthorized");
    }

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    return response.json();
};
