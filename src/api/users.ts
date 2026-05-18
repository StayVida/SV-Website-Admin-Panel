import { API_BASE_URL, API_key } from "@/config";

export interface User {
    userId: number;
    email: string;
    role: string;
    phoneNumber: string | null;
    createdAt: string;
}

export interface Executive {
    userId: number;
    email: string;
    role: string;
    phoneNumber: string | null;
    name: string | null;
    referralCode: string;
    isEnable: boolean;
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

export const createExecutive = async (userId: number): Promise<string> => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/api/admin/create-executive`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ userId }),
    });

    if (response.status === 401) {
        throw new Error("Unauthorized");
    }

    if (!response.ok) {
        throw new Error("Failed to create executive");
    }

    return response.text();
};

export const fetchExecutives = async (): Promise<Executive[]> => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/api/admin/executive-list`, {
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
        throw new Error("Failed to fetch executives");
    }

    return response.json();
};

