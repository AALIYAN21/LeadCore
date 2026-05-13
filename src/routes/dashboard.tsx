import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useLeads, useReminders, useSettings } from "@/lib/store";
import { Users, Handshake, Bell, TrendingUp, DollarSign, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SalesAI" },
      { name: "description", content: "AI-powered sales assistant for freelancers and agencies" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { leads } = useLeads();
  const { reminders } = useReminders();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

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

  const calcTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const currentLeads = leads.filter(l => new Date(l.created_at) > thirtyDaysAgo);
  const currentRevenue = currentLeads.filter(l => l.status === "Closed").reduce((sum, l) => sum + convertToNative(l.value || 0, l.currency), 0);
  const currentActive = currentLeads.filter(l => l.status === "Negotiation" || l.status === "Contacted").length;
  const currentConversion = currentLeads.length > 0 
    ? Math.round((currentLeads.filter(l => l.status === "Closed").length / currentLeads.length) * 100) 
    : 0;
  const currentPipeline = currentLeads.filter(l => l.status === "Negotiation" || l.status === "Contacted").reduce((sum, l) => sum + convertToNative(l.value || 0, l.currency), 0);

  const previousLeads = leads.filter(l => {
    const d = new Date(l.created_at);
    return d > sixtyDaysAgo && d <= thirtyDaysAgo;
  });
  const previousRevenue = previousLeads.filter(l => l.status === "Closed").reduce((sum, l) => sum + convertToNative(l.value || 0, l.currency), 0);
  const previousActive = previousLeads.filter(l => l.status === "Negotiation" || l.status === "Contacted").length;
  const previousConversion = previousLeads.length > 0 
    ? Math.round((previousLeads.filter(l => l.status === "Closed").length / previousLeads.length) * 100) 
    : 0;
  const previousPipeline = previousLeads.filter(l => l.status === "Negotiation" || l.status === "Contacted").reduce((sum, l) => sum + convertToNative(l.value || 0, l.currency), 0);

  const revenueTrend = calcTrend(currentRevenue, previousRevenue);
  const activeTrend = calcTrend(currentActive, previousActive);
  const conversionTrend = currentConversion - previousConversion;
  const pipelineTrend = calcTrend(currentPipeline, previousPipeline);

  const recentLeads = [...leads].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
  const upcomingReminders = reminders.filter(r => !r.completed).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5);

  // Build a lead name lookup from loaded leads
  const leadNameMap = new Map(leads.map(l => [l.id, l.name]));
  const getLeadName = (id: string) => leadNameMap.get(id) ?? "Unknown";

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: nativeCurrency }).format(val);
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Your sales pipeline at a glance.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Revenue (30d)" value={formatCurrency(currentRevenue)} icon={DollarSign} trend={revenueTrend} trendText="vs last 30 days" />
          <StatCard title="Active Leads (30d)" value={currentActive} icon={Users} trend={activeTrend} trendText="vs last 30 days" />
          <StatCard title="Conversion (30d)" value={`${currentConversion}%`} icon={Target} trend={conversionTrend} trendText="vs last 30 days" />
          <StatCard title="Pipeline Val (30d)" value={formatCurrency(currentPipeline)} icon={TrendingUp} trend={pipelineTrend} trendText="vs last 30 days" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Recent Leads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentLeads.length === 0 ? (
                <p className="text-sm text-muted-foreground">No leads yet.</p>
              ) : (
                recentLeads.map(lead => (
                  <Link key={lead.id} to="/leads/$leadId" params={{ leadId: lead.id }} className="flex items-center justify-between rounded-lg p-2.5 transition-colors hover:bg-accent">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-card-foreground">{lead.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{lead.company}</p>
                    </div>
                    <StatusBadge status={lead.status} />
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Reminders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingReminders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming reminders.</p>
              ) : (
                upcomingReminders.map(r => (
                  <div key={r.id} className="flex items-center justify-between rounded-lg p-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-card-foreground">{r.note}</p>
                      <p className="text-xs text-muted-foreground">{getLeadName(r.lead_id)}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{format(new Date(r.date), "MMM d")}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
