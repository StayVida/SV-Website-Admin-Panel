import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/api/users";
import { UserRoleBadge } from "./UserRoleBadge";
import { format } from "date-fns";
import { Calendar, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createExecutive, fetchExecutives } from "@/api/users";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  const navigate = useNavigate();

  const { data: executives = [] } = useQuery({
    queryKey: ["executives"],
    queryFn: fetchExecutives,
  });

  const executiveIds = new Set(executives.map((exec) => exec.userId));

  const handleConvertToExecutive = async (userId: number) => {
    try {
      const message = await createExecutive(userId);
      toast.success(message || "Executive created successfully");
      navigate("/executives");
    } catch (error) {
      toast.error("Failed to create executive");
      console.error(error);
    }
  };

  return (
    <Card className="overflow-hidden border-muted-foreground/10">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>User Details</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Joined Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                No users found matching your criteria.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.userId} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono text-xs text-muted-foreground">
                  #{user.userId}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-primary/10">
                      <AvatarFallback className="bg-primary/5 text-primary text-xs">
                        {user.email.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <UserRoleBadge role={user.role} />
                </TableCell>
                <TableCell>
                  <div className="text-sm flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    {user.phoneNumber || "Not provided"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {!executiveIds.has(user.userId) ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          Make Executive
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will convert <strong>{user.email}</strong> to an executive. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleConvertToExecutive(user.userId)}>
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <span className="text-xs text-muted-foreground font-medium">Already Executive</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
