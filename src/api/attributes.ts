import { API_BASE_URL, API_key } from "@/config";

export interface Amenity {
    amenity_id: number;
    name: string;
    status: string;
}

export interface Feature {
    feature_id: number;
    name: string;
    status: string;
}

export interface Tag {
    tag_id: number;
    name: string;
    status: string;
}

const fetchWithAuth = async (endpoint: string) => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
        throw new Error(`Failed to fetch ${endpoint}`);
    }

    return response.json();
};

const postWithAuth = async (endpoint: string, body: any) => {
    const token = localStorage.getItem("access_token");

    const payload = typeof body === 'string' ? body : JSON.stringify(body);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: payload,
    });

    if (response.status === 401) {
        throw new Error("Unauthorized");
    }

    if (!response.ok) {
        throw new Error(`Failed to post to ${endpoint}`);
    }

    return response.json();
};

export const fetchAmenities = (): Promise<Amenity[]> => {
    return fetchWithAuth("/api/admin/amenities");
};

export const fetchFeatures = (): Promise<Feature[]> => {
    return fetchWithAuth("/api/admin/features");
};

export const fetchTags = (): Promise<Tag[]> => {
    return fetchWithAuth("/api/admin/tags");
};

export const createAmenity = (data: string[]) => {
    return postWithAuth("/api/admin/amenity", data);
};

export const createFeature = (data: string[]) => {
    return postWithAuth("/api/admin/features", data);
};

export const createTag = (data: string[]) => {
    return postWithAuth("/api/admin/tags", data);
};
