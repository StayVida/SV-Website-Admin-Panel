import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AttributesTable, BaseAttribute } from "@/components/attributes/AttributesTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, RefreshCcw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface AttributeTabProps {
    title: string;
    description: string;
    queryKey: string;
    fetchFn: () => Promise<any[]>;
    createFn: (data: string[]) => Promise<any>;
    idKey: string;
    type: string;
}

export function AttributeTab({ title, description, queryKey, fetchFn, createFn, idKey, type }: AttributeTabProps) {
    const [newItemNames, setNewItemNames] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();

    const {
        data = [],
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: [queryKey],
        queryFn: fetchFn,
    });

    const createMutation = useMutation({
        mutationFn: createFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
            setNewItemNames("");
            setIsOpen(false);
            toast.success(`${title} created successfully`);
        },
        onError: (err) => {
            console.error(err);
            toast.error(`Failed to create ${title}`);
        }
    });

    const handleCreate = () => {
        if (!newItemNames.trim()) return;

        // Split by newlines or commas, trim whitespace, and filter out empty strings
        const itemsArray = newItemNames
            .split(/[\n,]+/)
            .map(item => item.trim())
            .filter(item => item.length > 0);

        if (itemsArray.length === 0) return;

        createMutation.mutate(itemsArray);
    };

    const normalizedData: BaseAttribute[] = data.map(item => ({
        id: item[idKey],
        name: item.name,
        status: item.status
    }));

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse text-sm">Loading {type}...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center border rounded-lg bg-destructive/5">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                    <p className="text-sm text-destructive font-medium">Failed to load {type}.</p>
                    <Button onClick={() => refetch()} variant="outline" size="sm" className="gap-2 mt-2">
                        <RefreshCcw className="h-4 w-4" /> Retry
                    </Button>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add {title}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New {title}</DialogTitle>
                                <DialogDescription>
                                    Enter {title.toLowerCase()} names. You can add multiple by separating them with commas or new lines.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <Textarea
                                    placeholder={`Air Conditioning\nFree WiFi\nSmart TV`}
                                    value={newItemNames}
                                    onChange={(e) => setNewItemNames(e.target.value)}
                                    className="min-h-[150px]"
                                    disabled={createMutation.isPending}
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    onClick={handleCreate}
                                    disabled={!newItemNames.trim() || createMutation.isPending}
                                >
                                    {createMutation.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <Plus className="h-4 w-4 mr-2" />
                                    )}
                                    Save {title}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <AttributesTable data={normalizedData} />
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title} ({normalizedData.length})</CardTitle>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {renderContent()}
            </CardContent>
        </Card>
    );
}
