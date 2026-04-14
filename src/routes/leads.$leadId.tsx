import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useLeadById, useMessages, useLeads, useReminders, type LeadStatus } from "@/lib/store";
import { generateFollowUp, summarizeConversation, getSmartSuggestions } from "@/lib/ai.functions";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Sparkles, Copy, Bell, Loader2 } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/leads/$leadId")({
  head: () => ({
    meta: [{ title: "Lead Detail — SalesAI" }],
  }),
  component: LeadDetailPage,
});

const STATUSES: LeadStatus[] = ["Lead", "Contacted", "Negotiation", "Closed", "Lost"];
const TONES = ["friendly", "professional", "persuasive"] as const;

function LeadDetailPage() {
  const { leadId } = Route.useParams();
  const { updateLead } = useLeads();
  const { lead, loading: leadLoading, setLead } = useLeadById(leadId);
  const { messages, addMessage } = useMessages(leadId);
  const { addReminder } = useReminders();
  const [newMessage, setNewMessage] = useState("");
  const [aiOutput, setAiOutput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMode, setAiMode] = useState<"followup" | "summarize" | "suggest">("followup");
  const [tone, setTone] = useState<typeof TONES[number]>("professional");
  const [conversationText, setConversationText] = useState("");
  const [reminderOpen, setReminderOpen] = useState(false);

  if (leadLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!lead) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground">Lead not found.</p>
          <Link to="/leads" className="mt-4 text-sm text-primary hover:underline">Back to leads</Link>
        </div>
      </AppLayout>
    );
  }

  async function handleSendMessage() {
    if (!newMessage.trim()) return;
    await addMessage(newMessage.trim());
    await updateLead(leadId, { last_contacted_at: new Date().toISOString() });
    setNewMessage("");
  }

  async function handleStatusChange(status: LeadStatus) {
    await updateLead(leadId, { status });
    setLead((prev) => prev ? { ...prev, status } : prev);
  }

  async function handleAI() {
    if (!lead) return;
    setAiLoading(true);
    try {
      if (aiMode === "followup") {
        const lastMsg = messages[messages.length - 1]?.content || lead.notes;
        const result = await generateFollowUp({
          data: {
            leadName: lead.name,
            company: lead.company,
            lastMessage: lastMsg,
            notes: lead.notes,
            tone,
          },
        });
        setAiOutput(result.text);
      } else if (aiMode === "summarize") {
        const text = conversationText || messages.map((m) => m.content).join("\n");
        const result = await summarizeConversation({
          data: {
            conversationText: text || "No conversation yet.",
            leadName: lead.name,
            company: lead.company,
          },
        });
        setAiOutput(result.text);
      } else {
        const result = await getSmartSuggestions({
          data: {
            leadName: lead.name,
            company: lead.company,
            status: lead.status,
            notes: lead.notes,
            messageHistory: messages.map((m) => m.content).join("\n"),
          },
        });
        setAiOutput(result.text);
      }
    } catch (err) {
      console.error("AI error:", err);
      setAiOutput("[Error] Failed to generate AI response. Please try again.");
    } finally {
      setAiLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(aiOutput);
    toast.success("Copied to clipboard");
  }

  async function handleCreateReminder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await addReminder({ lead_id: leadId, date: fd.get("date") as string, note: fd.get("note") as string });
    setReminderOpen(false);
    toast.success("Reminder created");
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <Link to="/leads" className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-accent">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight">{lead.name}</h1>
            <p className="text-sm text-muted-foreground">{lead.company} · {lead.email}</p>
          </div>
          <Select value={lead.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Notes</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-card-foreground">{lead.notes || "No notes yet."}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Last contacted: {lead.last_contacted_at ? format(new Date(lead.last_contacted_at), "MMM d, yyyy 'at' h:mm a") : "Never"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">Conversation</CardTitle>
                <Dialog open={reminderOpen} onOpenChange={setReminderOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm"><Bell className="mr-1 h-3.5 w-3.5" />Remind</Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border">
                    <DialogHeader><DialogTitle>Create Reminder</DialogTitle></DialogHeader>
                    <form onSubmit={handleCreateReminder} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" name="date" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Note</Label>
                        <Input name="note" required placeholder="Follow up on..." />
                      </div>
                      <Button type="submit" className="w-full">Create</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {messages.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">No messages yet.</p>
                  ) : (
                    messages.map(m => (
                      <div key={m.id} className="rounded-lg bg-accent/50 p-3">
                        <p className="text-sm text-card-foreground">{m.content}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{format(new Date(m.created_at), "MMM d, h:mm a")}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Add a message..."
                    onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button size="icon" onClick={handleSendMessage}><Send className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary" /> AI Assistant (Gemini)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  {(["followup", "summarize", "suggest"] as const).map(mode => (
                    <Button
                      key={mode}
                      variant={aiMode === mode ? "default" : "secondary"}
                      size="sm"
                      onClick={() => { setAiMode(mode); setAiOutput(""); }}
                    >
                      {mode === "followup" ? "Follow-up" : mode === "summarize" ? "Summarize" : "Suggest"}
                    </Button>
                  ))}
                </div>

                {aiMode === "followup" && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Tone</Label>
                    <Select value={tone} onValueChange={v => setTone(v as typeof tone)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {TONES.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {aiMode === "summarize" && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Paste conversation (or leave empty to use messages above)</Label>
                    <Textarea value={conversationText} onChange={e => setConversationText(e.target.value)} rows={4} placeholder="Paste conversation here..." />
                  </div>
                )}

                <Button onClick={handleAI} disabled={aiLoading} className="w-full">
                  {aiLoading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1.5 h-4 w-4" />}
                  {aiLoading ? "Generating..." : "Generate with Gemini"}
                </Button>

                {aiOutput && (
                  <div className="space-y-2">
                    <div className="rounded-lg bg-primary/5 p-4 text-sm whitespace-pre-wrap text-card-foreground">{aiOutput}</div>
                    <Button variant="ghost" size="sm" onClick={handleCopy}><Copy className="mr-1 h-3.5 w-3.5" />Copy</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
