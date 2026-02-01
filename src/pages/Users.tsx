import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers, User } from "@/api/users";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersTable } from "@/components/users/UsersTable";
import { Loader2, AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const filteredUsers = users.filter((user) => {
    const searchLow = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLow) ||
      (user.phoneNumber && user.phoneNumber.toLowerCase().includes(searchLow)) ||
      user.role.toLowerCase().includes(searchLow)
    );
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Fetching user directory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] space-y-6 text-center">
        <div className="bg-destructive/10 p-4 rounded-full">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-destructive">Connection Error</h2>
          <p className="text-muted-foreground max-w-md">
            We couldn't load the user list. This might be due to a network issue or session expiration.
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCcw className="h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <UsersHeader 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />
      <UsersTable users={filteredUsers} />
    </div>
  );
}
