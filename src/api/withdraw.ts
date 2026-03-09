import { API_BASE_URL, API_key } from "@/config";

export interface WithdrawRequest {
    sr: number;
    hotel_id: string;
    txn_date: string;
    amount: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
    remark: string | null;
}

export interface WithdrawRequestDetail extends WithdrawRequest {
    bank_account_no: string | null;
    ifsc_code: string | null;
    upi_id: string | null;
    bank_name: string | null;
    created_at: string;
    updated_at: string;
    name: string;
}

export interface WithdrawRequestsResponse {
    status?: number;
    message?: string;
    count?: number;
    data: WithdrawRequest[] | { data: WithdrawRequest[] };
}

export interface WithdrawRequestDetailResponse {
    status?: number;
    message?: string;
    count?: number;
    data: WithdrawRequestDetail[] | { data: WithdrawRequestDetail[] };
}

export const fetchWithdrawRequests = async (): Promise<WithdrawRequest[]> => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/api/admin/fetch_requests`, {
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
        throw new Error("Failed to fetch withdrawal requests");
    }

    const data: WithdrawRequestsResponse = await response.json();
    
    // Handle different response structures
    if (Array.isArray(data.data)) {
        return data.data;
    } else if (data.data && typeof data.data === 'object' && 'data' in data.data && Array.isArray(data.data.data)) {
        return data.data.data;
    }
    
    // If data is directly an array (not wrapped in WithdrawRequestsResponse object)
    if (Array.isArray(data)) {
        return data;
    }

    return [];
};

export const fetchWithdrawRequestById = async (srId: number): Promise<WithdrawRequestDetail | null> => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/api/admin/fetch_requests/${srId}`, {
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
        throw new Error("Failed to fetch withdrawal request details");
    }

    const data: WithdrawRequestDetailResponse = await response.json();
    
    // Handle different response structures
    let detailsArray: WithdrawRequestDetail[] = [];
    if (Array.isArray(data.data)) {
        detailsArray = data.data;
    } else if (data.data && typeof data.data === 'object' && 'data' in data.data && Array.isArray(data.data.data)) {
        detailsArray = data.data.data;
    } else if (Array.isArray(data)) {
        detailsArray = data;
    }

    return detailsArray[0] || null;
};

export interface WithdrawRequestUpdateBody {
    decision: "APPROVE" | "REJECT";
    transactionId: string;
    remark: string;
}

export const updateWithdrawRequestStatus = async (srId: number, body: WithdrawRequestUpdateBody): Promise<void> => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/api/admin/${srId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
    });

    if (response.status === 401) {
        throw new Error("Unauthorized");
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update withdrawal request status");
    }
};
