import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Hotel as HotelIcon, Search } from "lucide-react";
import { fetchAllHotels } from "@/api/hotels";
import { useAuth } from "@/hooks/use-auth";
import { HotelCard } from "@/components/hotels/HotelCard";
import { HotelFilters } from "@/components/hotels/HotelFilters";

export default function Hotels() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { logout } = useAuth();

  const { data: hotels = [], isLoading, error } = useQuery({
    queryKey: ["hotels"],
    queryFn: fetchAllHotels,
  });

  useEffect(() => {
    if (error && (error as Error).message === "Unauthorized") {
      logout();
    }
  }, [error, logout]);

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch = 
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || hotel.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (error && (error as Error).message !== "Unauthorized") {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] space-y-4">
        <div className="bg-destructive/10 p-4 rounded-full">
          <HotelIcon className="h-10 w-10 text-destructive" />
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-destructive">Error loading hotels</p>
          <p className="text-muted-foreground">{(error as Error).message}</p>
        </div>
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
          <h2 className="text-3xl font-bold tracking-tight text-primary">Hotels</h2>
          <p className="text-muted-foreground">Manage your hotel properties and listings</p>
        </div>
        {/* <Button className="h-11 px-6 shadow-md hover:shadow-lg transition-all active:scale-95">
          <Plus className="mr-2 h-4 w-4" />
          Add Hotel
        </Button> */}
      </div>

      <HotelFilters 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse font-medium">Gathering your properties...</p>
        </div>
      ) : filteredHotels.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredHotels.map((hotel) => (
            <HotelCard key={hotel.hotel_ID} hotel={hotel} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[300px] bg-muted/20 border-2 border-dashed rounded-xl border-muted-foreground/20 space-y-4">
          <div className="bg-muted p-4 rounded-full">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">No hotels found</p>
            <p className="text-muted-foreground">
              {searchTerm 
                ? `No results for "${searchTerm}"` 
                : "You haven't added any hotels yet."}
            </p>
          </div>
          {searchTerm && (
            <Button variant="ghost" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
