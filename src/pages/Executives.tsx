import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchExecutives } from "@/api/users";
import { Loader2, AlertCircle, RefreshCcw, Mail, Phone, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Executives() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: executives = [], isLoading, error, refetch } = useQuery({
    queryKey: ["executives"],
    queryFn: fetchExecutives,
  });

  const filteredExecutives = executives.filter((exec) => {
    const searchLow = searchTerm.toLowerCase();
    return (
      exec.email.toLowerCase().includes(searchLow) ||
      (exec.name && exec.name.toLowerCase().includes(searchLow)) ||
      (exec.phoneNumber && exec.phoneNumber.toLowerCase().includes(searchLow))
    );
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Fetching executives...</p>
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
            We couldn't load the executive list.
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executives</h1>
          <p className="text-muted-foreground">Manage platform executives and their referrals.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
             <input
                type="text"
                placeholder="Search executives..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-muted-foreground/10">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Referral Code</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExecutives.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No executives found.
                </TableCell>
              </TableRow>
            ) : (
              filteredExecutives.map((exec) => (
                <TableRow key={exec.userId} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    #{exec.userId}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm flex items-center gap-1.5">
                        <UserIcon className="h-3 w-3 text-muted-foreground" />
                        {exec.name || "N/A"}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Mail className="h-3 w-3" />
                        {exec.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      {exec.phoneNumber || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {exec.referralCode}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={exec.isEnable ? "default" : "secondary"}>
                      {exec.isEnable ? "Active" : "Disabled"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
