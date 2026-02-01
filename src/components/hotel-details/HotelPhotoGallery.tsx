import { Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatImageSource } from "./utils";

interface HotelPhotoGalleryProps {
  images: string[];
  hotelName: string;
}

export function HotelPhotoGallery({ images, hotelName }: HotelPhotoGalleryProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" /> Property Gallery
        </h3>
        <Badge variant="secondary">{images?.length || 0} Photos</Badge>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {images?.map((img, idx) => (
          <div 
            key={idx} 
            className={`relative overflow-hidden rounded-xl border-4 border-background shadow-lg transition-transform hover:scale-[1.02] cursor-pointer ${
              idx === 0 ? "col-span-2 aspect-video" : "aspect-square"
            }`}
          >
            <img 
              src={formatImageSource(img)} 
              alt={`${hotelName} - ${idx + 1}`} 
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
