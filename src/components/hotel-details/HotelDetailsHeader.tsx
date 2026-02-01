import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HotelDetailsHeaderProps {
  name: string;
  type: string;
  destination: string;
  rating?: number;
}

export function HotelDetailsHeader({ name, type, destination, rating }: HotelDetailsHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => navigate(-1)}
        className="rounded-full h-10 w-10 shrink-0"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{name}</h2>
        <div className="flex items-center gap-2 text-muted-foreground mt-1 text-sm font-medium uppercase tracking-wider">
          <Badge variant="outline">{type}</Badge>
          {rating && (
            <>
              <span>•</span>
              <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 border-yellow-400/20 px-2 py-0 h-5">
                <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                {rating.toFixed(1)}
              </Badge>
            </>
          )}
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" /> {destination}
          </span>
        </div>
      </div>
    </div>
  );
}
