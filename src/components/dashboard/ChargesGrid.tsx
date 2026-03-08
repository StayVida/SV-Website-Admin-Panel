import { Percent, Coins, Receipt, HandCoins, Loader2, AlertCircle, Settings2 } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCharges, updateCharges, Charge } from "@/api/attributes";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

const iconMap: Record<string, any> = {
    "platform_charges": Coins,
    "Advance": Percent,
    "tax": Receipt,
    "commission": HandCoins,
};

const labelMap: Record<string, string> = {
    "platform_charges": "Platform Charges",
    "Advance": "Advance Payment",
    "tax": "Tax (GST)",
    "commission": "Commission Rate",
};

export function ChargesGrid() {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [editValues, setEditValues] = useState<Record<string, number>>({});

    const { data: charges = [], isLoading, error } = useQuery({
        queryKey: ["dashboardCharges"],
        queryFn: fetchCharges,
    });

    const mutation = useMutation({
        mutationFn: updateCharges,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["dashboardCharges"] });
            toast.success(typeof data === 'string' ? data : "Charges updated successfully");
            setIsOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update charges");
        },
    });

    const handleOpenChange = (open: boolean) => {
        if (open) {
            const initialValues: Record<string, number> = {};
            charges.forEach(c => {
                initialValues[c.type] = c.value;
            });
            setEditValues(initialValues);
        }
        setIsOpen(open);
    };

    const handleUpdate = () => {
        const payload = Object.entries(editValues).map(([type, value]) => ({
            type,
            value: Number(value),
        }));
        mutation.mutate(payload);
    };

    if (isLoading) {
        return (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 rounded-xl border bg-card text-card-foreground shadow-sm animate-pulse flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/50" />
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="grid gap-4 grid-cols-1">
                <div className="flex items-center gap-3 p-6 rounded-xl border border-destructive/50 bg-destructive/5 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <p className="font-medium">Failed to load system charges. Please refresh the page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">System Charges</h2>
                <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Settings2 className="h-4 w-4" />
                            Manage Charges
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Update System Charges</DialogTitle>
                            <DialogDescription>
                                Modify the system-wide charges. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {charges.map((charge) => (
                                <div key={charge.charges_ID} className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor={charge.type} className="col-span-2">
                                        {labelMap[charge.type] || charge.type}
                                    </Label>
                                    <Input
                                        id={charge.type}
                                        type="number"
                                        step="0.01"
                                        value={editValues[charge.type] ?? charge.value}
                                        onChange={(e) => setEditValues({ ...editValues, [charge.type]: parseFloat(e.target.value) })}
                                        className="col-span-2"
                                    />
                                </div>
                            ))}
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleUpdate} disabled={mutation.isPending}>
                                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {charges.map((charge) => (
                    <StatCard
                        key={charge.charges_ID}
                        title={labelMap[charge.type] || charge.type}
                        value={typeof charge.value === 'number' && charge.value < 1 ? `${(charge.value * 100).toFixed(0)}%` : `₹${charge.value}`}
                        icon={iconMap[charge.type] || Coins}
                        description={`Current ${charge.type.replace('_', ' ')} value`}
                    />
                ))}
            </div>
        </div>
    );
}
