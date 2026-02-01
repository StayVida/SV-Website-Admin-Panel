import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface HotelMapProps {
  latitude: number;
  longitude: number;
  hotelName: string;
}

export function HotelMap({ latitude, longitude, hotelName }: HotelMapProps) {
  // Construct the Google Maps Embed URL
  // We use the latitude and longitude directly in the query
  const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=es;z=14&output=embed`;

  return (
    <Card className="overflow-hidden shadow-sm border-muted-foreground/10">
      <CardHeader className="bg-muted/30 pb-3 border-b">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-full">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl font-bold">Location</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-video w-full h-[350px]">
          <iframe
            title={`Map location for ${hotelName}`}
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={mapUrl}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </CardContent>
    </Card>
  );
}
