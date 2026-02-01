import { API_BASE_URL, API_key } from "@/config";

export interface StatItem {
    title: string;
    value: string;
}

export interface DashboardStatsResponse {
    statsData: StatItem[];
}

export interface RevenueDataItem {
    month: string;
    revenue: number;
}

export interface MonthlyRevenueResponse {
    revenueData: RevenueDataItem[];
}

export interface BookingDataItem {
    month: string;
    bookings: number;
}

export interface BookingDataResponse {
    bookingsData: BookingDataItem[];
}

export const fetchDashboardStats = async (): Promise<StatItem[]> => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/api/admin/static-data`, {
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
        throw new Error("Failed to fetch dashboard statistics");
    }

    const data: DashboardStatsResponse = await response.json();
    return data.statsData;
};

export const fetchMonthlyRevenue = async (): Promise<RevenueDataItem[]> => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/api/admin/monthly-revenue`, {
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
        throw new Error("Failed to fetch monthly revenue");
    }

    const data: MonthlyRevenueResponse = await response.json();
    return data.revenueData;
};

export const fetchBookingData = async (): Promise<BookingDataItem[]> => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/api/admin/booking-data`, {
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
        throw new Error("Failed to fetch booking trend data");
    }

    const data: BookingDataResponse = await response.json();
    return data.bookingsData;
};
