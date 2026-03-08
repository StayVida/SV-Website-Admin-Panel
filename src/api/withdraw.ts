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
    count: number;
    data: WithdrawRequest[];
}

export interface WithdrawRequestDetailResponse {
    count: number;
    data: WithdrawRequestDetail[];
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
    return data.data || [];
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
    return data.data?.[0] || null;
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
