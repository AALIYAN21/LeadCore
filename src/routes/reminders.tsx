import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useReminders, useLeads, getLeadName } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Bell } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

export const Route = createFileRoute("/reminders")({
  head: () => ({
    meta: [
      { title: "Reminders — SalesAI" },
      { name: "description", content: "Manage your follow-up reminders" },
    ],
  }),
  component: RemindersPage,
});

function RemindersPage() {
  const { reminders, addReminder, toggleReminder } = useReminders();
  const { leads } = useLeads();
  const [dialogOpen, setDialogOpen] = useState(false);

  const upcoming = reminders.filter(r => !r.completed).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const completed = reminders.filter(r => r.completed);

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addReminder({ lead_id: fd.get("lead_id") as string, date: fd.get("date") as string, note: fd.get("note") as string });
    setDialogOpen(false);
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reminders</h1>
            <p className="text-sm text-muted-foreground">{upcoming.length} upcoming</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Add Reminder</Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader><DialogTitle>New Reminder</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label>Lead</Label>
                  <Select name="lead_id" required>
                    <SelectTrigger><SelectValue placeholder="Select a lead" /></SelectTrigger>
                    <SelectContent>
                      {leads.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" name="date" required />
                </div>
                <div className="space-y-2">
                  <Label>Note</Label>
                  <Input name="note" required placeholder="What do you need to do?" />
                </div>
                <Button type="submit" className="w-full">Create Reminder</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {upcoming.length === 0 && completed.length === 0 ? (
          <div className="flex flex-col items-center py-20">
            <Bell className="h-10 w-10 text-muted-foreground/30" />
            <p className="mt-3 text-sm text-muted-foreground">No reminders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {upcoming.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Upcoming</h2>
                {upcoming.map(r => (
                  <Card key={r.id} className="bg-card border-border">
                    <CardContent className="flex items-center gap-3 p-4">
                      <Checkbox checked={r.completed} onCheckedChange={() => toggleReminder(r.id)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground">{r.note}</p>
                        <p className="text-xs text-muted-foreground">{getLeadName(r.lead_id)} · {format(new Date(r.date), "MMM d, yyyy")}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {completed.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Completed</h2>
                {completed.map(r => (
                  <Card key={r.id} className="bg-card border-border opacity-50">
                    <CardContent className="flex items-center gap-3 p-4">
                      <Checkbox checked={r.completed} onCheckedChange={() => toggleReminder(r.id)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground line-through">{r.note}</p>
                        <p className="text-xs text-muted-foreground">{getLeadName(r.lead_id)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
