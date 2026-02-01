import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { fetchAllBookings } from "@/api/bookings";
import { useAuth } from "@/hooks/use-auth";
import { BookingsFilters } from "@/components/bookings/BookingsFilters";
import { BookingsTable } from "@/components/bookings/BookingsTable";
import { BookingDetailsDialog } from "@/components/bookings/BookingDetailsDialog";

export default function Bookings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { logout } = useAuth();

  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchAllBookings,
  });

  useEffect(() => {
    if (error && (error as Error).message === "Unauthorized") {
      logout();
    }
  }, [error, logout]);

  const handleViewDetails = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsDetailsOpen(true);
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = 
      booking.booking_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.hotel_ID.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.booking_Status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (error && (error as Error).message !== "Unauthorized") {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <p className="text-destructive font-medium">Error loading bookings</p>
        <p className="text-muted-foreground">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
        <p className="text-muted-foreground">Manage all hotel bookings and reservations</p>
      </div>

      <BookingsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <Card className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <BookingsTable
            bookings={filteredBookings}
            onViewDetails={handleViewDetails}
          />
        )}
      </Card>

      <BookingDetailsDialog
        bookingId={selectedBookingId}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onUnauthorized={logout}
      />
    </div>
  );
}
