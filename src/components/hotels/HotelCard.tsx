import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Building2, Eye } from "lucide-react";
import { Hotel } from "@/api/hotels";
import { Badge } from "@/components/ui/badge";

interface HotelCardProps {
  hotel: Hotel;
}

const getStatusBadge = (status: string) => {
  const variants = {
    Verified: "default",
    Pending: "secondary",
    Rejected: "destructive",
    Deactivated: "outline",
  } as const;

  return (
    <Badge variant={variants[status as keyof typeof variants] || "outline"}>
      {status}
    </Badge>
  );
};

const formatImageSource = (src: string) => {
  if (!src) return "";
  if (src.startsWith("data:") || src.startsWith("http")) return src;
  
  // Detect image type from base64 start characters
  if (src.startsWith("UklGR")) return `data:image/webp;base64,${src}`;
  if (src.startsWith("/9j/")) return `data:image/jpeg;base64,${src}`;
  if (src.startsWith("iVBORw0KGgo")) return `data:image/png;base64,${src}`;
  
  // Fallback to jpeg for other base64 strings
  return `data:image/jpeg;base64,${src}`;
};

export function HotelCard({ hotel }: HotelCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden flex flex-col group">
      <div className="aspect-video w-full overflow-hidden bg-muted relative">
        {hotel.images ? (
          <img
            src={formatImageSource(hotel.images)}
            alt={hotel.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground italic">
            No image available
          </div>
        )}
        <div className="absolute top-2 right-2">
          {getStatusBadge(hotel.status)}
        </div>
      </div>
      <CardHeader className="flex-1">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xl line-clamp-1">{hotel.name}</CardTitle>
          <div className="flex items-center gap-1 shrink-0 bg-primary/10 px-2 py-0.5 rounded text-primary">
            <Star className="h-3.5 w-3.5 fill-primary" />
            <span className="text-sm font-bold">{hotel.rating.toFixed(1)}</span>
          </div>
        </div>
        <CardDescription className="flex items-center gap-1.5 text-sm">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{hotel.destination}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Building2 className="h-4 w-4" />
            <span>{hotel.totalRooms} Rooms</span>
          </div>
          <span className="text-xs font-mono text-muted-foreground/70 uppercase">ID: {hotel.hotel_ID}</span>
        </div>
        <Button 
          onClick={() => navigate(`/hotels/${hotel.hotel_ID}`)}
          variant="outline" 
          className="w-full h-10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
