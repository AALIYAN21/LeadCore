import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useLeads, useReminders } from "@/lib/store";
import { Users, Handshake, Bell, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";

export const Route = createFileRoute("/")({
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

  const totalLeads = leads.length;
  const activeDeals = leads.filter(l => l.status === "Negotiation" || l.status === "Contacted").length;
  const followupsDue = reminders.filter(r => !r.completed && new Date(r.date) <= new Date()).length;
  const closedDeals = leads.filter(l => l.status === "Closed").length;

  const recentLeads = [...leads].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
  const upcomingReminders = reminders.filter(r => !r.completed).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5);

  // Build a lead name lookup from loaded leads
  const leadNameMap = new Map(leads.map(l => [l.id, l.name]));
  const getLeadName = (id: string) => leadNameMap.get(id) ?? "Unknown";

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Your sales pipeline at a glance.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Leads" value={totalLeads} icon={Users} />
          <StatCard title="Active Deals" value={activeDeals} icon={TrendingUp} />
          <StatCard title="Follow-ups Due" value={followupsDue} icon={Bell} />
          <StatCard title="Closed Deals" value={closedDeals} icon={Handshake} />
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
