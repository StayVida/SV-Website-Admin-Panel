import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const bookings = [
  {
    id: "BK-001",
    guest: "John Doe",
    hotel: "Grand Plaza Hotel",
    checkIn: "2024-11-15",
    checkOut: "2024-11-18",
    status: "confirmed",
    total: "$750",
  },
  {
    id: "BK-002",
    guest: "Sarah Smith",
    hotel: "Ocean View Resort",
    checkIn: "2024-11-20",
    checkOut: "2024-11-25",
    status: "pending",
    total: "$1,200",
  },
  {
    id: "BK-003",
    guest: "Mike Johnson",
    hotel: "Mountain Lodge",
    checkIn: "2024-11-12",
    checkOut: "2024-11-15",
    status: "completed",
    total: "$650",
  },
  {
    id: "BK-004",
    guest: "Emily Davis",
    hotel: "City Center Inn",
    checkIn: "2024-11-18",
    checkOut: "2024-11-22",
    status: "confirmed",
    total: "$890",
  },
  {
    id: "BK-005",
    guest: "Robert Wilson",
    hotel: "Lakeside Retreat",
    checkIn: "2024-11-25",
    checkOut: "2024-11-30",
    status: "confirmed",
    total: "$1,450",
  },
];

const getStatusBadge = (status: string) => {
  const variants = {
    confirmed: "default",
    pending: "secondary",
    completed: "outline",
    cancelled: "destructive",
  } as const;

  return (
    <Badge variant={variants[status as keyof typeof variants] || "default"}>
      {status}
    </Badge>
  );
};

export default function Bookings() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.hotel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
        <p className="text-muted-foreground">Manage all hotel bookings and reservations</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card className="overflow-x-auto">
        <Table className="min-w-[640px]">
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Guest Name</TableHead>
              <TableHead>Hotel</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.id}</TableCell>
                <TableCell>{booking.guest}</TableCell>
                <TableCell>{booking.hotel}</TableCell>
                <TableCell>{booking.checkIn}</TableCell>
                <TableCell>{booking.checkOut}</TableCell>
                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                <TableCell className="text-right">{booking.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
