import { useQuery } from "@tanstack/react-query";
import { fetchHotelLedger, LedgerEntry } from "@/api/hotels";
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
import { Loader2, ArrowUpRight, ArrowDownLeft, Receipt, Calendar, CreditCard, Wallet } from "lucide-react";

interface HotelLedgerProps {
    hotelId: string;
}

export function HotelLedger({ hotelId }: HotelLedgerProps) {
    const { data: ledger = [], isLoading, error } = useQuery({
        queryKey: ["hotelLedger", hotelId],
        queryFn: () => fetchHotelLedger(hotelId),
        enabled: !!hotelId,
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse font-medium">Fetching transaction history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-red-500">
                <p>Failed to load ledger data.</p>
            </div>
        );
    }

    const getTypeBadge = (type: LedgerEntry["type"]) => {
        switch (type) {
            case "CR":
                return (
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 gap-1">
                        <ArrowDownLeft className="h-3 w-3" /> Booking Credit
                    </Badge>
                );
            case "WITHDRAW":
                return (
                    <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200 gap-1">
                        <ArrowUpRight className="h-3 w-3" /> Withdrawal
                    </Badge>
                );
            default:
                return <Badge variant="outline">{type}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold">Transaction Ledger</h3>
                    <p className="text-sm text-muted-foreground">Check all credits and withdrawals for this property.</p>
                </div>
                <div className="bg-primary/5 p-3 rounded-xl border border-primary/10 flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-primary" />
                    <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider leading-none">Current Balance</p>
                        <p className="text-lg font-bold text-primary">₹{ledger[ledger.length - 1]?.balance_after.toLocaleString() || "0"}</p>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="font-semibold text-primary">Date</TableHead>
                                <TableHead className="font-semibold text-primary">Type</TableHead>
                                <TableHead className="font-semibold text-primary">Reference</TableHead>
                                <TableHead className="font-semibold text-primary">Amount</TableHead>
                                <TableHead className="font-semibold text-primary text-right">Balance After</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ledger.length > 0 ? (
                                [...ledger].reverse().map((entry) => (
                                    <TableRow key={entry.sr} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{format(new Date(entry.txn_date), "MMM d, yyyy")}</span>
                                                <span className="text-[10px] text-muted-foreground">{format(new Date(entry.txn_date), "h:mm a")}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getTypeBadge(entry.type)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-0.5">
                                                {entry.booking_id && (
                                                    <div className="flex items-center gap-1.5 text-xs">
                                                        <Receipt className="h-3 w-3 text-muted-foreground" />
                                                        <span className="font-bold">Booking:</span> {entry.booking_id}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                                    <CreditCard className="h-3 w-3" />
                                                    <span>{entry.via}:</span> {entry.transaction_id}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className={`font-bold ${entry.type === "CR" ? "text-green-600" : "text-orange-600"}`}>
                                            {entry.type === "CR" ? "+" : "-"}₹{entry.amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="font-bold text-right">
                                            ₹{entry.balance_after.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-40 text-center text-muted-foreground italic">
                                        No transactions found for this hotel.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
