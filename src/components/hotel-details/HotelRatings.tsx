import { useQuery } from "@tanstack/react-query";
import { fetchHotelRatings } from "@/api/hotels";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Star, User, MessageSquare, Calendar } from "lucide-react";
import { format } from "date-fns";

interface HotelRatingsProps {
  hotelId: string;
}

export function HotelRatings({ hotelId }: HotelRatingsProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["hotelRatings", hotelId],
    queryFn: () => fetchHotelRatings(hotelId),
    enabled: !!hotelId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  const { ratings, averageRating } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Guest Reviews</h2>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-lg py-1 px-3 flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {averageRating ? averageRating.toFixed(1) : "N/A"}
          </Badge>
          <span className="text-muted-foreground text-sm">
            ({ratings.length} {ratings.length === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      </div>

      {ratings.length === 0 ? (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">No reviews yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {ratings.map((rating) => (
            <Card key={rating.rating_ID} className="overflow-hidden bg-card/50 hover:bg-card transition-colors duration-200">
              <CardHeader className="pb-3 border-b bg-muted/20">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">User #{rating.user_ID}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {rating.rated_at ? format(new Date(rating.rated_at), "MMM d, yyyy") : "Unknown Date"}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1 bg-white/50">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {rating.rating_Value}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-muted-foreground italic">"{rating.comment}"</p>
                <p className="text-[10px] text-muted-foreground mt-4 font-mono">
                  Booking Ref: {rating.booking_ID}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
