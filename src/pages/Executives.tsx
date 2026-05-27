import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchExecutives, fetchExecutivePayments, Executive, updatePaymentStatus, updateRegisterPaymentStatus } from "@/api/users";
import { Loader2, AlertCircle, RefreshCcw, Mail, Phone, User as UserIcon, Eye, IndianRupee, Copy, Check, Calendar, ArrowUpRight, Hotel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  return (
    <button
      type="button"
      className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
      onClick={handleCopy}
    >
      {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

export default function Executives() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExecutive, setSelectedExecutive] = useState<Executive | null>(null);
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);

  const { data: executives = [], isLoading, error, refetch } = useQuery({
    queryKey: ["executives"],
    queryFn: fetchExecutives,
  });

  const { data: paymentsData, isLoading: isLoadingPayments, error: paymentsError, refetch: refetchPayments } = useQuery({
    queryKey: ["executivePayments", selectedExecutive?.userId],
    queryFn: () => fetchExecutivePayments(selectedExecutive!.userId),
    enabled: !!selectedExecutive,
  });

  const referralPayments = paymentsData?.referral || [];
  const registerPayments = paymentsData?.register || [];

  const handleMarkPaid = async (bookingId: string) => {
    try {
      setUpdatingBookingId(bookingId);
      await updatePaymentStatus(bookingId);
      toast.success("Payment status successfully updated to PAID");
      refetchPayments();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update payment status");
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const handleMarkRegisterPaid = async (hotelId: string) => {
    try {
      setUpdatingBookingId(hotelId);
      await updateRegisterPaymentStatus(hotelId);
      toast.success("Registration payment successfully updated to PAID");
      refetchPayments();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update registration payment");
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const totalBookings = referralPayments.length;
  const totalEarnings = referralPayments.reduce((acc, pay) => acc + pay.paymentAmount, 0) + 
                        registerPayments.reduce((acc, pay) => acc + pay.paymentAmount, 0);

  const filteredExecutives = executives.filter((exec) => {
    const searchLow = searchTerm.toLowerCase();
    return (
      exec.email.toLowerCase().includes(searchLow) ||
      (exec.name && exec.name.toLowerCase().includes(searchLow)) ||
      (exec.phoneNumber && exec.phoneNumber.toLowerCase().includes(searchLow))
    );
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Fetching executives...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] space-y-6 text-center">
        <div className="bg-destructive/10 p-4 rounded-full">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-destructive">Connection Error</h2>
          <p className="text-muted-foreground max-w-md">
            We couldn't load the executive list.
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCcw className="h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executives</h1>
          <p className="text-muted-foreground">Manage platform executives and their referrals.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
             <input
                type="text"
                placeholder="Search executives..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-muted-foreground/10">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Referral Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExecutives.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No executives found.
                </TableCell>
              </TableRow>
            ) : (
              filteredExecutives.map((exec) => (
                <TableRow key={exec.userId} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    #{exec.userId}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm flex items-center gap-1.5">
                        <UserIcon className="h-3 w-3 text-muted-foreground" />
                        {exec.name || "N/A"}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Mail className="h-3 w-3" />
                        {exec.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      {exec.phoneNumber || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {exec.referralCode}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={exec.isEnable ? "default" : "secondary"}>
                      {exec.isEnable ? "Active" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      onClick={() => setSelectedExecutive(exec)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!selectedExecutive} onOpenChange={(open) => !open && setSelectedExecutive(null)}>
        <DialogContent className="max-w-2xl overflow-hidden sm:rounded-xl border border-muted-foreground/10 shadow-2xl p-0">
          <DialogHeader className="p-6 pb-0 flex flex-col gap-1">
            <DialogTitle className="text-2xl font-bold flex items-center justify-between">
              <span>Executive Details</span>
              {selectedExecutive && (
                <Badge variant={selectedExecutive.isEnable ? "default" : "secondary"}>
                  {selectedExecutive.isEnable ? "Active" : "Disabled"}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Detailed breakdown of bookings and referrals created by the executive.
            </DialogDescription>
          </DialogHeader>

          {selectedExecutive && (
            <div className="p-6 pt-4 space-y-6">
              {/* Executive Profile Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg border border-muted-foreground/10">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Executive Name</span>
                  <p className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                    <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    {selectedExecutive.name || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Email Address</span>
                  <p className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground truncate">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    {selectedExecutive.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Referral Code</span>
                  <div>
                    <Badge variant="outline" className="font-mono bg-background border-primary/20 text-primary py-0.5 px-2">
                      {selectedExecutive.referralCode}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-primary/5 via-transparent to-transparent p-4 rounded-lg border border-primary/10 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-medium">Total Bookings</span>
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold tracking-tight">{isLoadingPayments ? "..." : totalBookings}</span>
                    <span className="text-xs text-muted-foreground">referred</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent p-4 rounded-lg border border-emerald-500/10 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-medium">Total Earnings</span>
                    <IndianRupee className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                      {isLoadingPayments ? "..." : `₹${totalEarnings.toLocaleString()}`}
                    </span>
                    <span className="text-xs text-muted-foreground">INR</span>
                  </div>
                </div>
              </div>

              {/* Bookings & Registrations Section */}
              <div className="space-y-3">
                {isLoadingPayments ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-3 bg-muted/10 rounded-lg border border-dashed border-muted-foreground/10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-xs text-muted-foreground animate-pulse font-medium">Fetching executive data...</p>
                  </div>
                ) : paymentsError ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-3 text-center bg-destructive/5 rounded-lg border border-dashed border-destructive/10">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-destructive">Failed to load data</p>
                      <p className="text-xs text-muted-foreground max-w-sm">We ran into an issue loading data for this executive.</p>
                    </div>
                    <Button onClick={() => refetchPayments()} variant="outline" size="sm" className="gap-1.5">
                      <RefreshCcw className="h-3 w-3" /> Retry
                    </Button>
                  </div>
                ) : (
                  <Tabs defaultValue="referrals" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 mb-4">
                      <TabsTrigger value="referrals" className="gap-2 data-[state=active]:bg-background transition-all duration-300">
                        <Calendar className="h-4 w-4" />
                        Booking Referrals ({referralPayments.length})
                      </TabsTrigger>
                      <TabsTrigger value="registers" className="gap-2 data-[state=active]:bg-background transition-all duration-300">
                        <Hotel className="h-4 w-4" />
                        Hotel Registrations ({registerPayments.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="referrals" className="space-y-3">
                      {referralPayments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/10 rounded-lg border border-dashed border-muted-foreground/10">
                          <div className="bg-muted p-3 rounded-full mb-3 text-muted-foreground">
                            <Calendar className="h-6 w-6" />
                          </div>
                          <h4 className="text-sm font-semibold">No Booking Referrals Yet</h4>
                          <p className="text-xs text-muted-foreground max-w-xs mt-1">
                            This executive hasn't referred any booking referrals yet.
                          </p>
                        </div>
                      ) : (
                        <div className="border border-muted-foreground/10 rounded-lg overflow-hidden">
                          <div className="max-h-[260px] overflow-y-auto scrollbar-thin">
                            <Table>
                              <TableHeader className="bg-muted/30 sticky top-0 backdrop-blur-sm z-10">
                                <TableRow>
                                  <TableHead className="w-[50px] py-2 text-xs">SR</TableHead>
                                  <TableHead className="py-2 text-xs">Customer</TableHead>
                                  <TableHead className="py-2 text-xs">Booking ID</TableHead>
                                  <TableHead className="py-2 text-xs">Hotel</TableHead>
                                  <TableHead className="py-2 text-xs text-right">Amount</TableHead>
                                  <TableHead className="py-2 text-xs text-center">Status</TableHead>
                                  <TableHead className="py-2 text-xs text-right">Date</TableHead>
                                  <TableHead className="py-2 text-xs text-right">Action</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {referralPayments.map((payment) => (
                                  <TableRow key={payment.bookingId} className="hover:bg-muted/10 transition-colors">
                                    <TableCell className="py-2 text-xs font-mono text-muted-foreground">
                                      {payment.srNo}
                                    </TableCell>
                                    <TableCell className="py-2 text-xs font-medium text-foreground">
                                      {payment.customerName || "N/A"}
                                    </TableCell>
                                    <TableCell className="py-2 text-xs">
                                      <div className="flex items-center gap-1">
                                        <span className="font-mono font-medium text-foreground">{payment.bookingId}</span>
                                        <CopyButton text={payment.bookingId} />
                                      </div>
                                    </TableCell>
                                    <TableCell className="py-2 text-xs text-muted-foreground truncate max-w-[120px]" title={payment.hotelName}>
                                      {payment.hotelName || "N/A"}
                                    </TableCell>
                                    <TableCell className="py-2 text-xs text-right font-medium">
                                      ₹{payment.paymentAmount.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="py-2 text-xs text-center">
                                      <Badge
                                        variant="outline"
                                        className={cn(
                                          "text-[10px] py-0 px-2 font-semibold tracking-wider uppercase",
                                          payment.paymentStatus === "PAID"
                                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                            : "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
                                        )}
                                      >
                                        {payment.paymentStatus}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="py-2 text-xs text-right text-muted-foreground">
                                      <div className="flex flex-col">
                                        <span>
                                          {new Date(payment.createdAt).toLocaleDateString(undefined, {
                                            month: "short",
                                            day: "numeric",
                                            year: "2-digit",
                                          })}
                                        </span>
                                        <span className="text-[10px] opacity-75">
                                          {new Date(payment.createdAt).toLocaleTimeString(undefined, {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="py-2 text-xs text-right">
                                      {payment.paymentStatus === "PAID" ? (
                                        <span className="text-[10px] text-muted-foreground font-medium flex items-center justify-end gap-1">
                                          <Check className="h-3 w-3 text-emerald-500" /> Settled
                                        </span>
                                      ) : (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-7 text-[10px] px-2 py-0 border-emerald-500/20 text-emerald-600 hover:bg-emerald-600 hover:text-white dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white transition-all duration-300"
                                          onClick={() => handleMarkPaid(payment.bookingId)}
                                          disabled={updatingBookingId === payment.bookingId}
                                        >
                                          {updatingBookingId === payment.bookingId ? (
                                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                          ) : (
                                            <Check className="h-3 w-3 mr-1" />
                                          )}
                                          Mark Paid
                                        </Button>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="registers" className="space-y-3">
                      {registerPayments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/10 rounded-lg border border-dashed border-muted-foreground/10">
                          <div className="bg-muted p-3 rounded-full mb-3 text-muted-foreground">
                            <Hotel className="h-6 w-6" />
                          </div>
                          <h4 className="text-sm font-semibold">No Hotel Registrations Yet</h4>
                          <p className="text-xs text-muted-foreground max-w-xs mt-1">
                            This executive hasn't referred any hotel registrations yet.
                          </p>
                        </div>
                      ) : (
                        <div className="border border-muted-foreground/10 rounded-lg overflow-hidden">
                          <div className="max-h-[260px] overflow-y-auto scrollbar-thin">
                            <Table>
                              <TableHeader className="bg-muted/30 sticky top-0 backdrop-blur-sm z-10">
                                <TableRow>
                                  <TableHead className="w-[60px] py-2 text-xs">SR</TableHead>
                                  <TableHead className="py-2 text-xs">Hotel Name</TableHead>
                                  <TableHead className="py-2 text-xs">Hotel ID</TableHead>
                                  <TableHead className="py-2 text-xs text-right">Amount</TableHead>
                                  <TableHead className="py-2 text-xs text-center">Status</TableHead>
                                  <TableHead className="py-2 text-xs text-right">Date</TableHead>
                                  <TableHead className="py-2 text-xs text-right">Action</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {registerPayments.map((payment) => (
                                  <TableRow key={`${payment.hotelId}-${payment.srNo}`} className="hover:bg-muted/10 transition-colors">
                                    <TableCell className="py-2 text-xs font-mono text-muted-foreground">
                                      {payment.srNo}
                                    </TableCell>
                                    <TableCell className="py-2 text-xs font-medium text-foreground">
                                      {payment.hotelName || "N/A"}
                                    </TableCell>
                                    <TableCell className="py-2 text-xs font-mono text-muted-foreground">
                                      {payment.hotelId}
                                    </TableCell>
                                    <TableCell className="py-2 text-xs text-right font-medium">
                                      ₹{payment.paymentAmount.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="py-2 text-xs text-center">
                                      <Badge
                                        variant="outline"
                                        className={cn(
                                          "text-[10px] py-0 px-2 font-semibold tracking-wider uppercase",
                                          payment.paymentStatus === "PAID"
                                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                            : "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
                                        )}
                                      >
                                        {payment.paymentStatus}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="py-2 text-xs text-right text-muted-foreground">
                                      <div className="flex flex-col">
                                        <span>
                                          {new Date(payment.createdAt).toLocaleDateString(undefined, {
                                            month: "short",
                                            day: "numeric",
                                            year: "2-digit",
                                          })}
                                        </span>
                                        <span className="text-[10px] opacity-75">
                                          {new Date(payment.createdAt).toLocaleTimeString(undefined, {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="py-2 text-xs text-right">
                                      {payment.paymentStatus === "PAID" ? (
                                        <span className="text-[10px] text-muted-foreground font-medium flex items-center justify-end gap-1">
                                          <Check className="h-3 w-3 text-emerald-500" /> Settled
                                        </span>
                                      ) : (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-7 text-[10px] px-2 py-0 border-emerald-500/20 text-emerald-600 hover:bg-emerald-600 hover:text-white dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white transition-all duration-300"
                                          onClick={() => handleMarkRegisterPaid(payment.hotelId)}
                                          disabled={updatingBookingId === payment.hotelId}
                                        >
                                          {updatingBookingId === payment.hotelId ? (
                                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                          ) : (
                                            <Check className="h-3 w-3 mr-1" />
                                          )}
                                          Mark Paid
                                        </Button>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
