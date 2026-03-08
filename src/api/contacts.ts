import { API_BASE_URL, API_key } from "@/config";

export interface ContactMessage {
    ID: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    subject: string;
    message: string;
    createdAt: string;
}

export interface ContactGroup {
    date: string;
    data: ContactMessage[];
    count: number;
}

export const fetchContacts = async (): Promise<ContactGroup[]> => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/api/admin/all`, {
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
        throw new Error("Failed to fetch contacts");
    }

    return response.json();
};
