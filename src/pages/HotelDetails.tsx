import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchHotelDetails } from "@/api/hotels";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Info, ArrowLeft, LayoutDashboard, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Refactored Components
import { HotelDetailsHeader } from "@/components/hotel-details/HotelDetailsHeader";
import { HotelPhotoGallery } from "@/components/hotel-details/HotelPhotoGallery";
import { HotelDescription } from "@/components/hotel-details/HotelDescription";
import { HotelAmenities } from "@/components/hotel-details/HotelAmenities";
import { HotelTags } from "@/components/hotel-details/HotelTags";
import { HotelSidebarActions } from "@/components/hotel-details/HotelSidebarActions";
import { HotelRoomsList } from "@/components/hotel-details/HotelRoomsList";
import { HotelRatings } from "@/components/hotel-details/HotelRatings";
import { HotelMap } from "@/components/hotel-details/HotelMap";
import { fetchHotelRatings } from "@/api/hotels";
import { HotelLedger } from "@/components/hotel-details/HotelLedger";

export default function HotelDetails() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { data: hotel, isLoading, error } = useQuery({
    queryKey: ["hotelDetails", hotelId],
    queryFn: () => fetchHotelDetails(hotelId!),
    enabled: !!hotelId,
  });

  const { data: ratingsData } = useQuery({
    queryKey: ["hotelRatings", hotelId],
    queryFn: () => fetchHotelRatings(hotelId!),
    enabled: !!hotelId,
  });

  useEffect(() => {
    if (error && (error as Error).message === "Unauthorized") {
      logout();
    }
  }, [error, logout]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Loading property details...</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] space-y-4 text-center">
        <div className="bg-destructive/10 p-4 rounded-full">
          <Info className="h-10 w-10 text-destructive" />
        </div>
        <CardTitle className="text-2xl font-bold text-destructive">Hotel Not Found</CardTitle>
        <p className="text-muted-foreground max-w-md">
          {error ? (error as Error).message : "We couldn't find the hotel you're looking for."}
        </p>
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hotels
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <HotelDetailsHeader
        name={hotel.name}
        type={hotel.type}
        destination={hotel.destination}
        rating={ratingsData?.averageRating}
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between border-b pb-1">
          <TabsList className="bg-transparent h-auto p-0 gap-8">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-4 flex items-center gap-2"
            >
              <LayoutDashboard className="h-4 w-4" /> Property Overview
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-4 flex items-center gap-2"
            >
              <History className="h-4 w-4" /> Transactions & Ledger
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="m-0 border-none p-0 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <HotelPhotoGallery
                images={hotel.images}
                hotelName={hotel.name}
              />

              <HotelDescription description={hotel.description} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <HotelAmenities amenities={hotel.amenities} />
                <HotelTags tags={hotel.tags} />
              </div>

              <HotelMap
                latitude={hotel.latitude}
                longitude={hotel.longitude}
                hotelName={hotel.name}
              />

              <HotelRoomsList hotelId={hotelId!} />
              <HotelRatings hotelId={hotelId!} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6 lg:sticky lg:top-8 self-start">
              <HotelSidebarActions hotel={hotel} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="m-0 border-none p-0 outline-none">
          <div className="gap-8">
            <div className="">
              <HotelLedger hotelId={hotelId!} />
            </div>
            {/* <div className="space-y-6 lg:sticky lg:top-8 self-start">
              <CardTitle className="text-sm font-bold uppercase tracking-tight text-primary">Summary Stats</CardTitle>
              <div className="grid gap-4">
                <div className="p-4 bg-muted/30 rounded-xl border space-y-1">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Credits</span>
                  <p className="text-2xl font-bold text-green-600">Calculating...</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl border space-y-1">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Withdrawals</span>
                  <p className="text-2xl font-bold text-orange-600">Calculating...</p>
                </div>
              </div>
            </div> */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
