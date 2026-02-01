import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateHotelStatus, HotelDetails } from "@/api/hotels";
import { useAuth } from "@/hooks/use-auth";
import { 
  Loader2, 
  Phone, 
  MapPin, 
  Check, 
  X, 
  Layers,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface HotelSidebarActionsProps {
  hotel: HotelDetails;
}

export function HotelSidebarActions({ hotel }: HotelSidebarActionsProps) {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionRemark, setRejectionRemark] = useState("");

  const statusMutation = useMutation({
    mutationFn: ({ status, remark }: { status: string; remark: string }) => 
      updateHotelStatus(hotel.hotel_ID, status, remark),
    onSuccess: (_, variables) => {
      toast.success(`Hotel ${variables.status.toLowerCase()} successfully!`);
      queryClient.invalidateQueries({ queryKey: ["hotelDetails", hotel.hotel_ID] });
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      setVerifyDialogOpen(false);
      setRejectDialogOpen(false);
      setRejectionRemark("");
    },
    onError: (err: Error) => {
      if (err.message === "Unauthorized") {
        logout();
      } else {
        toast.error(`Failed to update status: ${err.message}`);
      }
    },
  });

  const handleVerify = () => {
    statusMutation.mutate({ 
      status: "Verified", 
      remark: "Property verified by admin" 
    });
  };

  const handleReject = () => {
    if (!rejectionRemark.trim()) {
      toast.error("Rejection remark is required");
      return;
    }
    statusMutation.mutate({ 
      status: "Rejected", 
      remark: rejectionRemark 
    });
  };

  return (
    <div className="space-y-6">
      <Card className="sticky top-6 border-primary/20 bg-primary/[0.02]">
        <CardHeader>
          <CardTitle className="text-lg">Summary & Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-3 py-2 bg-muted/20 rounded-lg">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={
                hotel.status === "Verified" ? "default" : 
                hotel.status === "Pending" ? "secondary" : "destructive"
              }>
                {hotel.status}
              </Badge>
            </div>
            
            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-muted rounded-md shrink-0">
                  <Layers className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Hotel ID</p>
                  <p className="font-mono text-xs">{hotel.hotel_ID}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-muted rounded-md shrink-0">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Contact Number</p>
                  <p className="font-medium">{hotel.phone_no}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-muted rounded-md shrink-0">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Coordinates</p>
                  <p className="font-medium text-xs">{hotel.latitude}, {hotel.longitude}</p>
                </div>
              </div>
            </div>
          </div>

          {hotel.remark && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-xs space-y-1">
              <p className="font-bold text-yellow-600 uppercase">Admin Remarks</p>
              <p className="text-muted-foreground leading-relaxed italic">"{hotel.remark}"</p>
            </div>
          )}

          <Separator />

          {hotel.status !== "Verified" ? (
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => setRejectDialogOpen(true)}
              >
                <X className="mr-2 h-4 w-4" /> Reject
              </Button>
              <Button 
                variant="default" 
                className="w-full bg-green-600 hover:bg-green-700 shadow-md shadow-green-600/20"
                onClick={() => setVerifyDialogOpen(true)}
              >
                <Check className="mr-2 h-4 w-4" /> Verify
              </Button>
            </div>
          ) : (
            <div className="grid gap-3">
              <Button className="w-full h-11 shadow-md shadow-primary/20">
                Update Listing
              </Button>
              <Button variant="outline" className="w-full">
                Contact Property
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verification Dialog */}
      <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Hotel</DialogTitle>
            <DialogDescription>
              Are you sure you want to verify <strong>{hotel.name}</strong>? This property will be marked as verified and will be live for bookings.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 p-4 bg-green-50 rounded-lg text-green-700 text-sm">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <p>Verification will allow the property to list their rooms and start taking bookings.</p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setVerifyDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleVerify}
              disabled={statusMutation.isPending}
            >
              {statusMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Verification"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Hotel Submission</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting <strong>{hotel.name}</strong>. The owner will be notified of this reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                Rejection Remark <span className="text-destructive">*</span>
              </label>
              <Textarea 
                placeholder="Briefly explain why this property doesn't meet requirements..."
                value={rejectionRemark}
                onChange={(e) => setRejectionRemark(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive"
              disabled={!rejectionRemark.trim() || statusMutation.isPending}
              onClick={handleReject}
            >
              {statusMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
