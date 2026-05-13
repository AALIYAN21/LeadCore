import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useLeads, useSettings } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, LineChart } from "recharts";
import { format, subDays } from "date-fns";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — SalesAI" },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { leads } = useLeads();
  const { settings } = useSettings();

  const nativeCurrency = settings?.nativeCurrency || "USD";
  const rates = settings?.exchangeRates || {};

  const convertToNative = (value: number, currency: string) => {
    if (!currency || currency === nativeCurrency) return value;
    const rate = rates[currency];
    if (rate && rate > 0) {
      return value * rate;
    }
    return value;
  };

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    return format(d, "MMM dd");
  });

  const revenueData = last7Days.map(dayStr => {
    const dayLeads = leads.filter(l => {
      const dateToUse = l.updated_at || l.created_at;
      return format(new Date(dateToUse), "MMM dd") === dayStr && l.status === "Closed";
    });
    const revenue = dayLeads.reduce((sum, l) => sum + convertToNative(l.value || 0, l.currency), 0);
    return { name: dayStr, revenue };
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: nativeCurrency, maximumFractionDigits: 0 }).format(val);
  };

  const statusCounts = [
    { name: "Lead", count: leads.filter(l => l.status === "Lead").length },
    { name: "Contacted", count: leads.filter(l => l.status === "Contacted").length },
    { name: "Negotiation", count: leads.filter(l => l.status === "Negotiation").length },
    { name: "Closed", count: leads.filter(l => l.status === "Closed").length },
    { name: "Lost", count: leads.filter(l => l.status === "Lost").length },
  ];

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">Deep dive into your sales metrics and performance.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Revenue (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatCurrency} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }} formatter={(val: number) => formatCurrency(val)} />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Leads by Status</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusCounts}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }} cursor={{ fill: 'var(--color-muted)' }} />
                  <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
