import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface UsersHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function UsersHeader({ searchTerm, onSearchChange }: UsersHeaderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">Manage user accounts, permissions, and activity</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by email, phone, or role..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-11 bg-card border-muted-foreground/20 focus-visible:ring-primary/20"
        />
      </div>
    </div>
  );
}
