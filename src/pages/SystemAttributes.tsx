import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tag, List, Star } from "lucide-react";
import { AttributeTab } from "@/components/attributes/AttributeTab";
import { fetchAmenities, fetchFeatures, fetchTags, createAmenity, createFeature, createTag } from "@/api/attributes";

export default function SystemAttributes() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Attributes</h1>
                <p className="text-muted-foreground mt-2">
                    Manage system-wide amenities, features, and tags used across the platform.
                </p>
            </div>

            <Tabs defaultValue="amenities" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-md h-12">
                    <TabsTrigger value="amenities" className="flex items-center gap-2">
                        <List className="h-4 w-4" />
                        <span className="hidden sm:inline">Amenities</span>
                    </TabsTrigger>
                    <TabsTrigger value="features" className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        <span className="hidden sm:inline">Features</span>
                    </TabsTrigger>
                    <TabsTrigger value="tags" className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        <span className="hidden sm:inline">Tags</span>
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="amenities" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                        <AttributeTab
                            title="Amenities"
                            description="List of all property amenities available for selection."
                            queryKey="amenities"
                            fetchFn={fetchAmenities}
                            createFn={createAmenity}
                            idKey="amenity_id"
                            type="amenities"
                        />
                    </TabsContent>

                    <TabsContent value="features" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                        <AttributeTab
                            title="Features"
                            description="Property features and special offerings."
                            queryKey="features"
                            fetchFn={fetchFeatures}
                            createFn={createFeature}
                            idKey="feature_id"
                            type="features"
                        />
                    </TabsContent>

                    <TabsContent value="tags" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                        <AttributeTab
                            title="Tags"
                            description="Categorization tags for filtering and grouping."
                            queryKey="tags"
                            fetchFn={fetchTags}
                            createFn={createTag}
                            idKey="tag_id"
                            type="tags"
                        />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
