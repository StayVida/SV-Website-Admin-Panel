import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { fetchBookingDetails } from "@/api/bookings";
import { Loader2, User, Phone, Calendar, Building2, CreditCard, Receipt, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface BookingDetailsDialogProps {
  bookingId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnauthorized: () => void;
}

const DetailItem = ({ icon: Icon, label, value, className = "" }: { icon: any, label: string, value: string | number | boolean, className?: string }) => (
  <div className={`flex items-start gap-3 ${className}`}>
    <div className="mt-0.5 bg-primary/10 p-1.5 rounded-md">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className="text-sm font-semibold">{typeof value === 'boolean' ? (value ? "Yes" : "No") : value}</span>
    </div>
  </div>
);

export function BookingDetailsDialog({ bookingId, open, onOpenChange, onUnauthorized }: BookingDetailsDialogProps) {
  const { data: details, isLoading, error } = useQuery({
    queryKey: ["bookingDetails", bookingId],
    queryFn: () => fetchBookingDetails(bookingId!),
    enabled: !!bookingId && open,
  });

  if (error && (error as Error).message === "Unauthorized") {
    onUnauthorized();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between pr-8">
            <span>Booking Details</span>
            {details && (
              <Badge variant={
                details.booking_Status === "CheckIn" ? "default" :
                details.booking_Status === "CheckedOut" ? "outline" :
                details.booking_Status === "Cancelled" ? "destructive" : "secondary"
              }>
                {details.booking_Status}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Comprehensive information for booking {bookingId}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : details ? (
          <div className="space-y-6 py-4">
            {/* Guest & Hotel Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2 text-primary uppercase tracking-tight">
                  <User className="h-4 w-4" /> Guest Information
                </h3>
                <div className="grid gap-3 p-4 bg-muted/30 rounded-lg">
                  <DetailItem icon={User} label="Name" value={details.name} />
                  <DetailItem icon={Phone} label="Phone Number" value={details.phone_number} />
                  <DetailItem icon={Calendar} label="User ID" value={details.user_ID} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2 text-primary uppercase tracking-tight">
                  <Building2 className="h-4 w-4" /> Hotel & Room
                </h3>
                <div className="grid gap-3 p-4 bg-muted/30 rounded-lg">
                  <DetailItem icon={Building2} label="Hotel Name" value={details.hotel_name} />
                  <DetailItem icon={Building2} label="Hotel ID" value={details.hotel_ID} />
                  <DetailItem icon={Building2} label="Room" value={`${details.RoomNumber} (ID: ${details.room_ID})`} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Stay Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2 text-primary uppercase tracking-tight">
                <Calendar className="h-4 w-4" /> Stay Schedule
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-4 bg-muted/30 rounded-lg">
                <DetailItem icon={Calendar} label="Check-In" value={details.checkIn} />
                <DetailItem icon={Calendar} label="Check-Out" value={details.checkOut} />
                <DetailItem icon={ShieldCheck} label="Is Refundable" value={details.is_refundable} />
              </div>
            </div>

            <Separator />

            {/* Payment Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2 text-primary uppercase tracking-tight">
                <CreditCard className="h-4 w-4" /> Payment Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4 p-4 bg-muted/30 rounded-lg">
                <DetailItem icon={CreditCard} label="Payment Status" value={details.payment_Status} />
                <DetailItem icon={CreditCard} label="Payment Type" value={details.payment_type} />
                <DetailItem icon={Receipt} label="Tax Rate" value={`${details.tax_amount*100}%`} />
                <DetailItem icon={Receipt} label="Platform Fee" value={`₹${details.platformFee}`} />
                <DetailItem icon={Receipt} label="Room Price" value={`₹${details["Room Price"].toLocaleString()}`} />
                <DetailItem icon={Receipt} label="Customer Paid" value={`₹${details["amount paid by customer"].toLocaleString()}`} />
                <DetailItem icon={Receipt} label="Left to Pay" value={`₹${details["payment left to pay customer"].toLocaleString()}`} className="text-destructive" />
                <DetailItem icon={Receipt} label="Gross Amount" value={`₹${details["gross amount to be paid by customer"].toLocaleString()}`} className="text-primary" />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {error ? "Failed to load booking details." : "No data available."}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
