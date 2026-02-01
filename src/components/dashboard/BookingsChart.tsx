import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { fetchBookingData } from "@/api/dashboard";
import { Loader2 } from "lucide-react";

export function BookingsChart() {
  const { data: bookingsData = [], isLoading, error } = useQuery({
    queryKey: ["bookingTrend"],
    queryFn: fetchBookingData,
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Bookings Trend</CardTitle>
        <CardDescription>Monthly bookings for the past 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-destructive space-y-2 text-center p-4">
            <p className="font-medium">Failed to load booking trends</p>
            <p className="text-sm opacity-80">Please try again later</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingsData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--accent))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
