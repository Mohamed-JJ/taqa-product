import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { BarChart3 } from "lucide-react";
import { useDashboardTranslations } from "@/i18n/hooks/useTranslations";

interface AnomalyChartProps {
  anomalyByMonth: Array<{
    month: string;
    count: number;
  }>;
}

export const AnomalyChart = ({ anomalyByMonth }: AnomalyChartProps) => {
  const dashboardT = useDashboardTranslations();

  // Process data to ensure month labels are properly formatted
  const chartData = anomalyByMonth.map(({ month, count }) => {
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    
    let monthLabel = month;
    if (typeof month === "number" && month >= 1 && month <= 12) {
      monthLabel = monthNames[month - 1];
    } else if (
      typeof month === "string" &&
      !isNaN(Number(month)) &&
      Number(month) >= 1 &&
      Number(month) <= 12
    ) {
      monthLabel = monthNames[Number(month) - 1];
    }
    
    return { month: monthLabel, count };
  });

  return (
    <Card className="lg:col-span-1 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-heading flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-taqa-primary" />
          {dashboardT.currentDistribution}
        </CardTitle>
        <CardDescription className="text-sm">
          Anomaly severity breakdown across all reports
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "hsl(var(--muted-foreground))",
                }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "hsl(var(--muted-foreground))",
                }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-2 rounded shadow text-xs">
                        <div>
                          <span className="font-semibold">
                            {payload[0].payload.month}
                          </span>
                        </div>
                        <div>
                          Anomalies:{" "}
                          <span className="font-bold">
                            {payload[0].payload.count}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="count"
                fill="#003D55"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}; 