import { Badge } from "@/components/ui/badge";

interface UserRoleBadgeProps {
  role: string;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  switch (role.toLowerCase()) {
    case "admin":
      return <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">Admin</Badge>;
    case "hotel_owner":
    case "manager":
      return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20">Owner</Badge>;
    default:
      return <Badge variant="outline" className="text-muted-foreground">User</Badge>;
  }
}
