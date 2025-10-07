import { DollarSign, Calendar, Hotel, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";

const statsData = [
  {
    title: "Total Revenue",
    value: "$67,000",
    icon: DollarSign,
    description: "June revenue"
  },
  {
    title: "Total Bookings",
    value: "189",
    icon: Calendar,
    description: "This month"
  },
  {
    title: "Active Hotels",
    value: "24",
    icon: Hotel,
    description: "Listed properties"
  },
  {
    title: "Occupancy Rate",
    value: "78%",
    icon: TrendingUp,
    description: "Average occupancy"
  }
];

export function StatsGrid() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          description={stat.description}
        />
      ))}
    </div>
  );
}
