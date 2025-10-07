import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Star, Search, Check, X, Eye } from "lucide-react";
import { toast } from "sonner";

const pendingHotels = [
  {
    id: 1,
    name: "Sunset Beach Resort",
    location: "California, USA",
    rooms: 180,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=300&fit=crop",
    submittedDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Alpine Mountain Lodge",
    location: "Colorado, USA",
    rooms: 95,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop",
    submittedDate: "2024-01-14",
  },
];

export default function PendingHotels() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hotelsList, setHotelsList] = useState(pendingHotels);
  const [selectedHotel, setSelectedHotel] = useState<typeof pendingHotels[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredHotels = hotelsList.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (hotel: typeof pendingHotels[0]) => {
    setSelectedHotel(hotel);
    setDialogOpen(true);
  };

  const handleVerify = () => {
    if (selectedHotel) {
      setHotelsList(hotelsList.filter(hotel => hotel.id !== selectedHotel.id));
      toast.success("Hotel verified successfully!");
      setDialogOpen(false);
      setSelectedHotel(null);
    }
  };

  const handleReject = () => {
    if (selectedHotel) {
      setHotelsList(hotelsList.filter(hotel => hotel.id !== selectedHotel.id));
      toast.error("Hotel rejected");
      setDialogOpen(false);
      setSelectedHotel(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pending Hotels</h2>
          <p className="text-muted-foreground">Review and verify newly submitted hotel properties</p>
        </div>
        <Badge variant="secondary" className="w-fit">
          {hotelsList.length} Pending
        </Badge>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search pending hotels..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {filteredHotels.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No pending hotels to review</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden flex flex-col h-full">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="line-clamp-1">{hotel.name}</CardTitle>
                  <Badge variant="outline" className="text-xs shrink-0">
                    Pending
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-1">{hotel.location}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rooms:</span>
                    <span className="font-semibold">{hotel.rooms}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Submitted:</span>
                    <span className="font-semibold">{hotel.submittedDate}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-auto"
                  onClick={() => handleViewDetails(hotel)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Hotel Details</DialogTitle>
            <DialogDescription>
              Review the hotel information before verification
            </DialogDescription>
          </DialogHeader>

          {selectedHotel && (
            <div className="space-y-6">
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={selectedHotel.image}
                  alt={selectedHotel.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{selectedHotel.name}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedHotel.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Number of Rooms</p>
                    <p className="text-lg font-semibold">{selectedHotel.rooms}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Submitted Date</p>
                    <p className="text-lg font-semibold">{selectedHotel.submittedDate}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline">Pending Verification</Badge>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleReject}
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button onClick={handleVerify}>
              <Check className="mr-2 h-4 w-4" />
              Verify Hotel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
