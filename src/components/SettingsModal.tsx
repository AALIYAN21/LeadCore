import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useSettings } from "@/lib/store";
import { databases, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { ID, Query } from "appwrite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const { settings, updateSettings } = useSettings();
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [docId, setDocId] = useState<string | null>(null);

  const [nativeCurrency, setNativeCurrency] = useState("USD");
  const [rates, setRates] = useState<{ currency: string; rate: number }[]>([]);
  const [newCurrency, setNewCurrency] = useState("");
  const [newRate, setNewRate] = useState("");

  useEffect(() => {
    if (open && user) {
      loadApiKey();
    }
  }, [open, user]);

  useEffect(() => {
    if (settings) {
      setNativeCurrency(settings.nativeCurrency || "USD");
      const ratesArr = Object.entries(settings.exchangeRates || {}).map(([currency, rate]) => ({ currency, rate: rate as number }));
      setRates(ratesArr);
    }
  }, [settings]);

  const loadApiKey = async () => {
    try {
      const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.USER_AI, [
        Query.equal("user_id", user!.$id),
        Query.limit(1)
      ]);
      if (res.documents.length > 0) {
        setApiKey(res.documents[0].geminiApiKey);
        setDocId(res.documents[0].$id);
      }
    } catch (error) {
      console.error("Failed to load API key", error);
    }
  };

  const handleAddRate = () => {
    if (!newCurrency || !newRate) return;
    setRates(prev => [...prev.filter(r => r.currency !== newCurrency), { currency: newCurrency, rate: parseFloat(newRate) }]);
    setNewCurrency("");
    setNewRate("");
  };

  const handleRemoveRate = (currency: string) => {
    setRates(prev => prev.filter(r => r.currency !== currency));
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (docId) {
        await databases.updateDocument(DATABASE_ID, COLLECTIONS.USER_AI, docId, {
          geminiApiKey: apiKey,
        });
      } else {
        const res = await databases.createDocument(DATABASE_ID, COLLECTIONS.USER_AI, ID.unique(), {
          user_id: user.$id,
          geminiApiKey: apiKey,
        });
        setDocId(res.$id);
      }

      const ratesObj = rates.reduce((acc, curr) => ({ ...acc, [curr.currency]: curr.rate }), {});
      await updateSettings({ nativeCurrency, exchangeRates: ratesObj });

      toast.success("Settings updated successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your AI assistant and multi-currency preferences.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai">AI Models</TabsTrigger>
            <TabsTrigger value="currency">Currency</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai" className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="apiKey">Gemini API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your API key is stored securely in your database space.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Other Models
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-border bg-muted/20 flex flex-col gap-2 relative overflow-hidden group">
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-muted text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                    Coming Soon
                  </div>
                  <div className="font-semibold text-sm text-foreground flex items-center gap-2">
                    OpenAI
                  </div>
                  <div className="text-[11px] text-muted-foreground">GPT-4o</div>
                </div>
                <div className="p-3 rounded-lg border border-border bg-muted/20 flex flex-col gap-2 relative overflow-hidden group">
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-muted text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                    Coming Soon
                  </div>
                  <div className="font-semibold text-sm text-foreground flex items-center gap-2">
                    Anthropic
                  </div>
                  <div className="text-[11px] text-muted-foreground">Claude 3.5 Sonnet</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="currency" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nativeCurrency">Native Currency</Label>
              <Select value={nativeCurrency} onValueChange={setNativeCurrency}>
                <SelectTrigger id="nativeCurrency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {["USD", "PKR", "SAR", "INR", "GBP", "EUR", "AUD", "CAD", "AED"].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Dashboard revenue will be calculated in this currency.</p>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-border">
              <Label>Exchange Rates (1 [Native] = X [Other])</Label>
              <p className="text-xs text-muted-foreground mb-2">Example: If Native is USD, 1 USD = 278 PKR.</p>
              
              <div className="flex gap-2 items-center">
                <Input 
                  placeholder="Currency (e.g. PKR)" 
                  value={newCurrency} 
                  onChange={(e) => setNewCurrency(e.target.value.toUpperCase())} 
                  className="w-24 uppercase"
                  maxLength={3}
                />
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="Rate (e.g. 278)" 
                  value={newRate} 
                  onChange={(e) => setNewRate(e.target.value)} 
                />
                <Button variant="secondary" size="icon" onClick={handleAddRate} className="shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                {rates.map(r => (
                  <div key={r.currency} className="flex items-center justify-between bg-muted/30 p-2 rounded-md border border-border text-sm">
                    <span>1 {nativeCurrency} = {r.rate} {r.currency}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveRate(r.currency)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {rates.length === 0 && <p className="text-xs text-muted-foreground italic">No custom exchange rates added.</p>}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
