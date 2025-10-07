import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { ChartsGrid } from "@/components/dashboard/ChartsGrid";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <StatsGrid />
      <ChartsGrid />
    </div>
  );
}
