import { API_BASE_URL, API_key } from "@/config";

export interface Booking {
    booking_ID: string;
    user_ID: number;
    hotel_ID: string;
    room_ID: string;
    RoomNumber: number;
    booking_Status: string;
    checkIn: string;
    checkOut: string;
    payment_Status: string;
    name: string;
    "payment left": number;
    "gross amount": number;
}

export interface BookingsResponse {
    status: number;
    message: string;
    data: Booking[];
}

export interface BookingDetails {
    name: string;
    phone_number: string;
    booking_ID: string;
    user_ID: number;
    hotel_ID: string;
    hotel_name: string;
    room_ID: string;
    RoomNumber: number;
    booking_Status: string;
    checkIn: string;
    checkOut: string;
    payment_Status: string;
    payment_type: string;
    is_refundable: boolean;
    tax_amount: number;
    platformFee: number;
    "Room Price": number;
    "amount paid by customer": number;
    "payment left to pay customer": number;
    "gross amount to be paid by customer": number;
}

export interface BookingDetailsResponse {
    status: number;
    message: string;
    data: BookingDetails;
}

export const fetchAllBookings = async (): Promise<Booking[]> => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/api/admin/all-bookings`, {
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
        throw new Error("Failed to fetch bookings");
    }

    const data: BookingsResponse = await response.json();
    return data.data;
};

export const fetchBookingDetails = async (bookingId: string): Promise<BookingDetails> => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/api/admin/${bookingId}/details`, {
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
        throw new Error("Failed to fetch booking details");
    }

    const data: BookingDetailsResponse = await response.json();
    return data.data;
};
