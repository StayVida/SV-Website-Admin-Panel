import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { ChartsGrid } from "@/components/dashboard/ChartsGrid";
import { ChargesGrid } from "@/components/dashboard/ChargesGrid";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <StatsGrid />
      <ChargesGrid />
      <ChartsGrid />
    </div>
  );
}
