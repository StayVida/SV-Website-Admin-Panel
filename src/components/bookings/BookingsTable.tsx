import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Booking } from "@/api/bookings";
import { MoreHorizontal, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BookingsTableProps {
  bookings: Booking[];
  onViewDetails: (bookingId: string) => void;
}

const getStatusBadge = (status: string) => {
  const variants = {
    CheckIn: "default",
    Pending: "secondary",
    CheckedOut: "outline",
    Cancelled: "destructive",
  } as const;

  return (
    <Badge variant={variants[status as keyof typeof variants] || "default"}>
      {status}
    </Badge>
  );
};

export function BookingsTable({ bookings, onViewDetails }: BookingsTableProps) {
  return (
    <Table className="min-w-[640px]">
      <TableHeader>
        <TableRow>
          <TableHead>Booking ID</TableHead>
          <TableHead>Guest Name</TableHead>
          <TableHead>Hotel ID</TableHead>
          <TableHead>Check-in</TableHead>
          <TableHead>Check-out</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Total Amount</TableHead>
          <TableHead className="w-[100px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <TableRow key={booking.booking_ID}>
              <TableCell className="font-medium text-xs">{booking.booking_ID}</TableCell>
              <TableCell>{booking.name}</TableCell>
              <TableCell className="text-xs uppercase">{booking.hotel_ID}</TableCell>
              <TableCell>{booking.checkIn}</TableCell>
              <TableCell>{booking.checkOut}</TableCell>
              <TableCell>{getStatusBadge(booking.booking_Status)}</TableCell>
              <TableCell className="text-right font-medium">
                ₹{booking["gross amount"].toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(booking.booking_ID)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="h-24 text-center">
              No bookings found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
