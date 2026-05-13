import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useLeads, type Lead, type LeadStatus } from "@/lib/store";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit2 } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { LeadFormSheet } from "@/components/LeadFormSheet";

export const Route = createFileRoute("/leads/")({
  head: () => ({
    meta: [
      { title: "Leads — SalesAI" },
      { name: "description", content: "Manage your sales leads" },
    ],
  }),
  component: LeadsPage,
});

const STATUSES: LeadStatus[] = ["Lead", "Contacted", "Negotiation", "Closed", "Lost"];

function LeadsPage() {
  const { leads, addLead, updateLead } = useLeads();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const filtered = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || l.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSaveLead = (leadData: Partial<Lead>) => {
    if (editingLead) {
      updateLead(editingLead.id, leadData);
    } else {
      addLead(leadData as any);
    }
  };

  const openNewLead = () => {
    setEditingLead(null);
    setSheetOpen(true);
  };

  const openEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setSheetOpen(true);
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
            <p className="text-sm text-muted-foreground">{leads.length} total leads</p>
          </div>
          <Button size="sm" onClick={openNewLead}>
            <Plus className="mr-1.5 h-4 w-4" />Add Lead
          </Button>
          <LeadFormSheet 
            open={sheetOpen} 
            onOpenChange={setSheetOpen} 
            lead={editingLead} 
            onSave={handleSaveLead} 
          />
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40"><SelectValue placeholder="All statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Company</th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">Value</th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">Status</th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground xl:table-cell">Last Contact</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">No leads found.</td></tr>
              ) : (
                filtered.map(lead => (
                  <tr key={lead.id} className="border-b border-border transition-colors hover:bg-accent/50">
                    <td className="px-4 py-3">
                      <Link to="/leads/$leadId" params={{ leadId: lead.id }} className="font-medium text-card-foreground hover:text-primary">
                        {lead.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{lead.email}</p>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{lead.company}</td>
                    <td className="hidden px-4 py-3 text-card-foreground lg:table-cell">
                      {new Intl.NumberFormat(undefined, { style: 'currency', currency: lead.currency || 'USD' }).format(lead.value || 0)}
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell"><StatusBadge status={lead.status} /></td>
                    <td className="hidden px-4 py-3 text-muted-foreground xl:table-cell">
                      {lead.last_contacted_at ? format(new Date(lead.last_contacted_at), "MMM d, yyyy") : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditLead(lead)}>
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
