import { RevenueChart } from "./RevenueChart";
import { BookingsChart } from "./BookingsChart";

export function ChartsGrid() {
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <RevenueChart />
      <BookingsChart />
    </div>
  );
}
