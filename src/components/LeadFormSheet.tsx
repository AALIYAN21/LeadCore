import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type Lead, type LeadStatus } from "@/lib/store";

interface LeadFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead | null;
  onSave: (leadData: Partial<Lead>) => void;
}

const STATUSES: LeadStatus[] = ["Lead", "Contacted", "Negotiation", "Closed", "Lost"];
const CURRENCIES = ["USD", "PKR", "SAR", "INR", "GBP", "EUR", "AUD", "CAD", "AED"];

export function LeadFormSheet({ open, onOpenChange, lead, onSave }: LeadFormSheetProps) {
  const isEditing = !!lead;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSave({
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      company: fd.get("company") as string,
      status: (fd.get("status") as LeadStatus) || "Lead",
      notes: (fd.get("notes") as string) || "",
      value: parseFloat((fd.get("value") as string) || "0"),
      currency: (fd.get("currency") as string) || "USD",
    });
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card border-border sm:max-w-md w-full overflow-y-auto">
        <SheetHeader className="mb-5">
          <SheetTitle>{isEditing ? "Edit Lead" : "New Lead"}</SheetTitle>
          <SheetDescription>
            {isEditing ? "Update lead details below." : "Enter the details for your new lead."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required placeholder="John Doe" defaultValue={lead?.name} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="john@company.com" defaultValue={lead?.email} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" required placeholder="Acme Inc" defaultValue={lead?.company} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input id="value" name="value" type="number" step="0.01" min="0" placeholder="5000" defaultValue={lead?.value} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select name="currency" defaultValue={lead?.currency || "USD"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={lead?.status || "Lead"}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" placeholder="Any initial notes..." rows={4} defaultValue={lead?.notes} />
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button type="submit" className="w-full sm:w-auto">{isEditing ? "Save Changes" : "Create Lead"}</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
