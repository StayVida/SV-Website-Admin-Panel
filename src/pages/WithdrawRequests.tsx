import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWithdrawRequests, WithdrawRequest } from "@/api/withdraw";
import { Loader2, AlertCircle, RefreshCcw, Search, Wallet, Filter, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { WithdrawRequestDetailsDialog } from "@/components/withdraw/WithdrawRequestDetailsDialog";

export default function WithdrawRequests() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [selectedRequestSr, setSelectedRequestSr] = useState<number | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const { data: requests = [], isLoading, error, refetch } = useQuery({
        queryKey: ["withdraw-requests"],
        queryFn: fetchWithdrawRequests,
    });

    const filteredRequests = requests.filter((request) => {
        const searchLow = searchTerm.toLowerCase();
        const hotelIdMatch = request.hotel_id.toLowerCase().includes(searchLow);
        const statusMatch = statusFilter === "ALL" || request.status === statusFilter;
        return hotelIdMatch && statusMatch;
    });

    const getStatusBadge = (status: WithdrawRequest["status"]) => {
        switch (status) {
            case "PENDING":
                return <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">Pending</Badge>;
            case "APPROVED":
                return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Approved</Badge>;
            case "REJECTED":
                return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const handleViewDetails = (sr: number) => {
        setSelectedRequestSr(sr);
        setIsDetailsOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[600px] space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse font-medium">Loading withdraw requests...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[600px] space-y-6 text-center text-red-500">
                <div className="bg-red-50 p-4 rounded-full">
                    <AlertCircle className="h-10 w-10 text-red-600" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Failed to load requests</h2>
                    <p className="text-red-400 max-w-md">
                        We couldn't fetch the withdrawal data. Please check your connection and try again.
                    </p>
                </div>
                <Button onClick={() => refetch()} variant="outline" className="gap-2">
                    <RefreshCcw className="h-4 w-4" /> Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Wallet className="h-6 w-6 text-primary" />
                        <h1 className="text-3xl font-bold tracking-tight">Withdraw Requests</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Manage and monitor withdrawal requests from hotel owners.
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by Hotel ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-md px-3 border">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                        className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[100px] font-semibold text-primary">Sr.</TableHead>
                                <TableHead className="font-semibold text-primary">Hotel ID</TableHead>
                                <TableHead className="font-semibold text-primary">Transaction Date</TableHead>
                                <TableHead className="font-semibold text-primary">Amount</TableHead>
                                <TableHead className="font-semibold text-primary">Status</TableHead>
                                <TableHead className="font-semibold text-primary">Remark</TableHead>
                                <TableHead className="font-semibold text-primary text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((request) => (
                                    <TableRow key={request.sr} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-medium">#{request.sr}</TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-foreground/80">{request.hotel_id}</span>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {format(new Date(request.txn_date), "PPP p")}
                                        </TableCell>
                                        <TableCell className="font-bold text-primary">
                                            ₹{request.amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(request.status)}
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate italic text-muted-foreground">
                                            {request.remark || "N/A"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="hover:bg-primary/10 hover:text-primary gap-1"
                                                onClick={() => handleViewDetails(request.sr)}
                                            >
                                                <Eye className="h-4 w-4" />
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                                        No withdrawal requests found matching your filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <WithdrawRequestDetailsDialog
                requestId={selectedRequestSr}
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
            />
        </div>
    );
}
