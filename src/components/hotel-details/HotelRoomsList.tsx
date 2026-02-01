import { useQuery } from "@tanstack/react-query";
import { fetchHotelRooms, Room } from "@/api/hotels";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, BedDouble, Info, CheckCircle2, XCircle } from "lucide-react";
import { formatImageSource } from "./utils";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";

interface HotelRoomsListProps {
  hotelId: string;
}

function AutoSlidingCarousel({ images, roomNo }: { images: string[], roomNo: number }) {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api || images.length <= 1) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => clearInterval(intervalId);
  }, [api, images.length]);

  return (
    <Carousel setApi={setApi} className="w-full h-full">
      <CarouselContent className="h-full ml-0">
        {images.map((image, index) => (
          <CarouselItem key={index} className="pl-0 h-full">
            <img
              src={formatImageSource(image)}
              alt={`Room ${roomNo} - ${index + 1}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <CarouselPrevious className="static translate-y-0 h-8 w-8 bg-white/20 hover:bg-white/40 border-none text-white backdrop-blur-sm" />
          <CarouselNext className="static translate-y-0 h-8 w-8 bg-white/20 hover:bg-white/40 border-none text-white backdrop-blur-sm" />
        </div>
      )}
    </Carousel>
  );
}

export function HotelRoomsList({ hotelId }: HotelRoomsListProps) {
  const { data: rooms = [], isLoading, error } = useQuery({
    queryKey: ["hotelRooms", hotelId],
    queryFn: () => fetchHotelRooms(hotelId),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="flex items-center gap-3 py-6 text-destructive">
          <Info className="h-5 w-5" />
          <p>Failed to load rooms. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Available Rooms</h2>
        <Badge variant="outline">{rooms.length} Rooms</Badge>
      </div>

      {rooms.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <BedDouble className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">No rooms found for this hotel.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {rooms.map((room) => (
            <Card key={room.room_ID} className="overflow-hidden flex flex-col h-full group hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-video w-full overflow-hidden relative">
                {room.images && room.images.length > 0 ? (
                  <AutoSlidingCarousel images={room.images} roomNo={room.room_NO} />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <BedDouble className="h-10 w-10 text-muted-foreground opacity-20" />
                  </div>
                )}
                <Badge 
                  className="absolute top-3 right-3 shadow-lg z-10"
                  variant={room.Status === "Available" ? "default" : "secondary"}
                >
                  {room.Status}
                </Badge>
              </div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">Room {room.room_NO}</CardTitle>
                    <CardDescription>{room.room_Type}</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">₹{room.price}</p>
                    <p className="text-xs text-muted-foreground">per night</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    <Info className="h-4 w-4" /> Features
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {room.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="font-normal">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm pt-2 border-t">
                  {room.isEnable ? (
                    <span className="flex items-center gap-1.5 text-green-600 font-medium">
                      <CheckCircle2 className="h-4 w-4" /> Enabled
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                      <XCircle className="h-4 w-4" /> Disabled
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
