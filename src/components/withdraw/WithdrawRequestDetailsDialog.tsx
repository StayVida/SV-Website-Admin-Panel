import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { fetchWithdrawRequestById, updateWithdrawRequestStatus, WithdrawRequestUpdateBody } from "@/api/withdraw";
import { Loader2, Building2, CreditCard, Receipt, Wallet, Banknote, Landmark, User, Clock, CheckCircle2, XCircle, AlertCircle, ShieldCheck, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface WithdrawRequestDetailsDialogProps {
    requestId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DetailItem = ({ icon: Icon, label, value, className = "" }: { icon: any, label: string, value: string | number | null | undefined, className?: string }) => (
    <div className={`flex items-start gap-3 ${className}`}>
        <div className="mt-0.5 bg-primary/10 p-1.5 rounded-md">
            <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
            <span className="text-sm font-semibold">{value || "N/A"}</span>
        </div>
    </div>
);

export function WithdrawRequestDetailsDialog({ requestId, open, onOpenChange }: WithdrawRequestDetailsDialogProps) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [actionType, setActionType] = useState<"APPROVE" | "REJECT" | null>(null);
    const [remark, setRemark] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);

    const { data: details, isLoading, error, refetch } = useQuery({
        queryKey: ["withdrawRequestDetails", requestId],
        queryFn: () => fetchWithdrawRequestById(requestId!),
        enabled: requestId !== null && open,
    });

    const updateMutation = useMutation({
        mutationFn: (body: WithdrawRequestUpdateBody) => updateWithdrawRequestStatus(requestId!, body),
        onSuccess: () => {
            toast({
                title: actionType === "APPROVE" ? "Request Approved" : "Request Rejected",
                description: `The withdrawal request has been successfully ${actionType === "APPROVE" ? "approved" : "rejected"}.`,
            });
            queryClient.invalidateQueries({ queryKey: ["withdraw-requests"] });
            refetch();
            setIsActionDialogOpen(false);
            resetActionForm();
        },
        onError: (error: Error) => {
            toast({
                title: "Action Failed",
                description: error.message || "Failed to update request status. Please try again.",
                variant: "destructive",
            });
        },
    });

    const resetActionForm = () => {
        setActionType(null);
        setRemark("");
        setTransactionId("");
    };

    const handleActionSubmit = () => {
        if (actionType === "REJECT" && !remark) {
            toast({ title: "Reason Required", description: "Please provide a reason for rejection.", variant: "destructive" });
            return;
        }
        if (actionType === "APPROVE" && !transactionId) {
            toast({ title: "Transaction ID Required", description: "Please provide a transaction ID for approval.", variant: "destructive" });
            return;
        }

        updateMutation.mutate({
            decision: actionType!,
            transactionId: actionType === "APPROVE" ? transactionId : "NA",
            remark: remark || (actionType === "APPROVE" ? "Verified and Approved" : ""),
        });
    };

    const getStatusBadge = (status: string | undefined) => {
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

    const getStatusIcon = (status: string | undefined) => {
        switch (status) {
            case "PENDING":
                return <Clock className="h-5 w-5 text-orange-500" />;
            case "APPROVED":
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case "REJECTED":
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center justify-between pr-8">
                            <DialogTitle className="text-2xl flex items-center gap-2">
                                <Wallet className="h-6 w-6 text-primary" />
                                Withdrawal Details
                            </DialogTitle>
                            {details && getStatusBadge(details.status)}
                        </div>
                        <DialogDescription>
                            Detailed information for withdrawal request #{requestId}
                        </DialogDescription>
                    </DialogHeader>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Fetching transaction details...</p>
                        </div>
                    ) : details ? (
                        <div className="space-y-6 py-4">
                            {/* Overview Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/20 p-4 rounded-xl border">
                                <DetailItem icon={Building2} label="Hotel Name" value={details.name} />
                                <DetailItem icon={Receipt} label="Hotel ID" value={details.hotel_id} />
                                <DetailItem icon={Banknote} label="Withdrawal Amount" value={`₹${details.amount.toLocaleString()}`} className="text-primary" />
                                <DetailItem icon={Clock} label="Request Date" value={format(new Date(details.created_at), "PPP p")} />
                            </div>

                            <Separator />

                            {/* Payment Method Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold flex items-center gap-2 text-primary uppercase tracking-tight">
                                    <CreditCard className="h-4 w-4" /> Settlement Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/30 rounded-lg">
                                    {details.upi_id ? (
                                        <DetailItem icon={Wallet} label="UPI ID" value={details.upi_id} />
                                    ) : (
                                        <>
                                            <DetailItem icon={Landmark} label="Bank Name" value={details.bank_name} />
                                            <DetailItem icon={User} label="Account Holder" value={details.name} />
                                            <DetailItem icon={CreditCard} label="Account Number" value={details.bank_account_no} />
                                            <DetailItem icon={Landmark} label="IFSC Code" value={details.ifsc_code} />
                                        </>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Status & Remarks */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold flex items-center gap-2 text-primary uppercase tracking-tight">
                                    {getStatusIcon(details.status)} Status Updates
                                </h3>
                                <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Remark / Reason</span>
                                        <p className="text-sm italic text-foreground/80">
                                            {details.remark || "No remarks provided for this transaction."}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                        <DetailItem icon={Clock} label="Last Updated" value={format(new Date(details.updated_at), "PPP p")} />
                                        <DetailItem icon={Receipt} label="Transaction SR" value={details.sr} />
                                    </div>
                                </div>
                            </div>

                            {/* Actions Footer */}
                            {(details.status === "PENDING") && (
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 gap-2"
                                        onClick={() => {
                                            setActionType("REJECT");
                                            setIsActionDialogOpen(true);
                                        }}
                                    >
                                        <XCircle className="h-4 w-4" />
                                        Reject Request
                                    </Button>
                                    <Button
                                        className="flex-1 gap-2"
                                        onClick={() => {
                                            setActionType("APPROVE");
                                            setIsActionDialogOpen(true);
                                        }}
                                    >
                                        <ShieldCheck className="h-4 w-4" />
                                        Verify & Approve
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                            <div className="bg-red-50 p-3 rounded-full">
                                <AlertCircle className="h-8 w-8 text-red-500" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold">No Data Found</h3>
                                <p className="text-sm text-muted-foreground max-w-xs">
                                    We couldn't find any details for this withdrawal request. It might have been deleted or archived.
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Action Confirmation Dialog */}
            <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {actionType === "APPROVE" ? (
                                <>
                                    <ShieldCheck className="h-5 w-5 text-green-600" />
                                    Approve Withdrawal
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-5 w-5 text-red-600" />
                                    Reject Withdrawal
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {actionType === "APPROVE"
                                ? "Enter the transaction ID and optional remark to complete the approval."
                                : "Please provide a reason for rejecting this withdrawal request."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {actionType === "APPROVE" && (
                            <div className="grid gap-2">
                                <Label htmlFor="transactionId">Transaction ID <span className="text-red-500">*</span></Label>
                                <Input
                                    id="transactionId"
                                    placeholder="e.g. TXN123456789"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                />
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="remark">
                                {actionType === "REJECT" ? "Reason for Rejection" : "Remark (Optional)"}
                                {actionType === "REJECT" && <span className="text-red-500">*</span>}
                            </Label>
                            <Textarea
                                id="remark"
                                placeholder={actionType === "REJECT" ? "Enter the reason for rejection..." : "Add any notes about this settlement..."}
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsActionDialogOpen(false)}>Cancel</Button>
                        <Button
                            variant={actionType === "REJECT" ? "destructive" : "default"}
                            onClick={handleActionSubmit}
                            disabled={updateMutation.isPending}
                            className="gap-2"
                        >
                            {updateMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                            {actionType === "APPROVE" ? "Confirm Approval" : "Confirm Rejection"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
