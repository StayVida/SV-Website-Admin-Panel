import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HotelTagsProps {
  tags: string[];
}

export function HotelTags({ tags }: HotelTagsProps) {
  return (
    <Card className="border-none shadow-none bg-muted/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Tag className="h-5 w-5 text-primary" /> Property Tags
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="px-3 py-1">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
