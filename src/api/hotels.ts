import { API_BASE_URL, API_key } from "@/config";

export interface Hotel {
    images: string;
    owner_ID: number;
    hotel_ID: string;
    name: string;
    destination: string;
    rating: number;
    totalRooms: number;
    status: string;
}

export interface HotelsResponse {
    status: number;
    message: string;
    data: Hotel[];
}

export interface HotelDetails {
    hotel_ID: string;
    name: string;
    type: string;
    destination: string;
    description: string;
    phone_no: string;
    amenities: string[];
    tags: string[];
    images: string[];
    latitude: number;
    longitude: number;
    owner_ID: number;
    status: string;
    remark?: string;
}

export interface Room {
    room_ID: string;
    room_NO: number;
    room_Type: string;
    hotel_ID: string;
    features: string[];
    price: number;
    Status: string;
    isEnable: boolean;
    createdAt: string;
    images: string[];
}

export interface RoomsResponse {
    status: number;
    message: string;
    data: Room[];
}

export interface HotelDetailsResponse {
    status: number;
    message: string;
    data: HotelDetails[];
}

export interface Rating {
    rating_ID: number;
    user_ID: number;
    hotel_ID: string;
    booking_ID: string;
    rating_Value: number;
    comment: string;
    rated_at: string;
}

export interface RatingsResponse {
    ratings: Rating[];
    averageRating: number;
}

export const fetchAllHotels = async (): Promise<Hotel[]> => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/api/admin/allhotels`, {
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
        throw new Error("Failed to fetch hotels");
    }

    const data: HotelsResponse = await response.json();
    return data.data;
};

export const fetchHotelDetails = async (hotelId: string): Promise<HotelDetails> => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/api/admin/hotels-profile/${hotelId}`, {
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
        throw new Error("Failed to fetch hotel details");
    }

    const data: HotelDetailsResponse = await response.json();
    // The API returns an array, we need the first element
    return data.data[0];
};
export const updateHotelStatus = async (hotelId: string, status: string, remark: string): Promise<any> => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/api/admin/update-verification`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ hotelId, status, remark }),
    });

    if (response.status === 401) {
        throw new Error("Unauthorized");
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update hotel status");
    }

    return response.json();
};

export const fetchPendingHotels = async (): Promise<Hotel[]> => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/api/admin/pendinghotels`, {
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
        throw new Error("Failed to fetch pending hotels");
    }

    const data: HotelsResponse = await response.json();
    return data.data;
};

export const fetchHotelRooms = async (hotelId: string): Promise<Room[]> => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/api/admin/allrooms/${hotelId}`, {
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
        throw new Error("Failed to fetch hotel rooms");
    }

    const data: RoomsResponse = await response.json();
    return data.data;
};

export const fetchHotelRatings = async (hotelId: string): Promise<RatingsResponse> => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/api/rating/hotel/${hotelId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch hotel ratings");
    }

    return response.json();
};
