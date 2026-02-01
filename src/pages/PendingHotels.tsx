import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPendingHotels } from "@/api/hotels";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Eye, Loader2, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { formatImageSource } from "@/components/hotel-details/utils";

export default function PendingHotels() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { data: hotelsList = [], isLoading, error } = useQuery({
    queryKey: ["pendingHotels"],
    queryFn: fetchPendingHotels,
  });

  useEffect(() => {
    if (error && (error as Error).message === "Unauthorized") {
      logout();
    }
  }, [error, logout]);

  const filteredHotels = hotelsList.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Fetching pending applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] space-y-4 text-center">
        <div className="bg-destructive/10 p-4 rounded-full">
          <Info className="h-10 w-10 text-destructive" />
        </div>
        <CardTitle className="text-2xl font-bold text-destructive">Error Loading Data</CardTitle>
        <p className="text-muted-foreground max-w-md">
          {(error as Error).message || "There was a problem retrieving the pending hotels list."}
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Pending Hotels</h2>
          <p className="text-muted-foreground">Review and verify newly submitted hotel properties</p>
        </div>
        <Badge variant="secondary" className="w-fit h-7 px-3">
          {hotelsList.length} Pending Applications
        </Badge>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by hotel name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 h-11"
        />
      </div>

      {filteredHotels.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 space-y-2">
            <div className="bg-muted p-4 rounded-full">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium">No pending hotels found</p>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHotels.map((hotel) => (
            <Card key={hotel.hotel_ID} className="overflow-hidden flex flex-col h-full group">
              <div className="aspect-video w-full overflow-hidden relative">
                <img
                  src={formatImageSource(hotel.images)}
                  alt={hotel.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Badge className="absolute top-3 right-3 shadow-lg">Pending</Badge>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-1">{hotel.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  <span className="line-clamp-1">{hotel.destination}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-muted/50 p-2 rounded-md">
                    <span className="text-xs text-muted-foreground block uppercase font-bold tracking-tighter">Rooms</span>
                    <span className="font-semibold">{hotel.totalRooms}</span>
                  </div>
                  <div className="bg-muted/50 p-2 rounded-md">
                    <span className="text-xs text-muted-foreground block uppercase font-bold tracking-tighter">ID</span>
                    <span className="font-mono text-[10px] truncate">{hotel.hotel_ID}</span>
                  </div>
                </div>
                <Button
                  className="w-full h-10 shadow-sm"
                  onClick={() => navigate(`/hotels/${hotel.hotel_ID}`)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Review Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
