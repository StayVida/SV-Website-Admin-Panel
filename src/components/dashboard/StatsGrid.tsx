import { DollarSign, Calendar, Hotel, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats } from "@/api/dashboard";

const iconMap: Record<string, any> = {
  "Total Revenue": DollarSign,
  "Total Bookings": Calendar,
  "Active Hotels": Hotel,
  "Occupancy Rate": TrendingUp,
};

const descriptionMap: Record<string, string> = {
  "Total Revenue": "Total generated revenue",
  "Total Bookings": "Completed bookings",
  "Active Hotels": "Verified properties",
  "Occupancy Rate": "Average occupancy",
};

export function StatsGrid() {
  const { data: stats = [], isLoading, error } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
  });

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
          <p className="font-medium">Failed to load statistics. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={iconMap[stat.title] || TrendingUp}
          description={descriptionMap[stat.title] || ""}
        />
      ))}
    </div>
  );
}
