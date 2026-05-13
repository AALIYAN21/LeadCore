import { useState, useEffect, useCallback } from "react";
import { databases, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth";
import { Query, ID } from "appwrite";

export type LeadStatus = "Lead" | "Contacted" | "Negotiation" | "Closed" | "Lost";

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  email: string;
  company: string;
  status: LeadStatus;
  notes: string;
  value: number;
  currency: string;
  last_contacted_at: string | null;
  created_at: string;
  updated_at?: string;
}

export interface Message {
  id: string;
  lead_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface Reminder {
  id: string;
  lead_id: string;
  user_id: string;
  date: string;
  note: string;
  completed: boolean;
}

function docToLead(doc: any): Lead {
  return {
    id: doc.$id,
    user_id: doc.user_id,
    name: doc.name,
    email: doc.email,
    company: doc.company,
    status: doc.status as LeadStatus,
    notes: doc.notes || "",
    value: doc.value || 0,
    currency: doc.currency || "USD",
    last_contacted_at: doc.last_contacted_at || null,
    created_at: doc.created_at,
    updated_at: doc.$updatedAt,
  };
}

function docToMessage(doc: any): Message {
  return {
    id: doc.$id,
    lead_id: doc.lead_id,
    user_id: doc.user_id,
    content: doc.content,
    created_at: doc.created_at,
  };
}

function docToReminder(doc: any): Reminder {
  return {
    id: doc.$id,
    lead_id: doc.lead_id,
    user_id: doc.user_id,
    date: doc.date,
    note: doc.note,
    completed: doc.completed,
  };
}

export function useLeads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.LEADS, [
        Query.equal("user_id", user.$id),
        Query.orderDesc("created_at"),
        Query.limit(100),
      ]);
      setLeads(res.documents.map(docToLead));
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addLead = useCallback(
    async (lead: Omit<Lead, "id" | "created_at" | "user_id">) => {
      if (!user) return;
      const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.LEADS, ID.unique(), {
        ...lead,
        user_id: user.$id,
        value: lead.value || 0,
        currency: lead.currency || "USD",
        last_contacted_at: lead.last_contacted_at || "",
        notes: lead.notes || "",
        created_at: new Date().toISOString(),
      });
      const newLead = docToLead(doc);
      setLeads((prev) => [newLead, ...prev]);
      return newLead;
    },
    [user]
  );

  const updateLead = useCallback(
    async (id: string, patch: Partial<Lead>) => {
      const { id: _id, user_id: _uid, ...rest } = patch as any;
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.LEADS, id, rest);
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    },
    []
  );

  const deleteLead = useCallback(async (id: string) => {
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.LEADS, id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return { leads, loading, addLead, updateLead, deleteLead, refresh };
}

export function useMessages(leadId: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!user || !leadId) return;
    databases
      .listDocuments(DATABASE_ID, COLLECTIONS.MESSAGES, [
        Query.equal("lead_id", leadId),
        Query.orderAsc("created_at"),
        Query.limit(100),
      ])
      .then((res) => setMessages(res.documents.map(docToMessage)))
      .catch((err) => console.error("Failed to fetch messages:", err));
  }, [user, leadId]);

  const addMessage = useCallback(
    async (content: string) => {
      if (!user) return;
      const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.MESSAGES, ID.unique(), {
        lead_id: leadId,
        user_id: user.$id,
        content,
        created_at: new Date().toISOString(),
      });
      const msg = docToMessage(doc);
      setMessages((prev) => [...prev, msg]);
      return msg;
    },
    [user, leadId]
  );

  return { messages, addMessage };
}

export function useReminders() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.REMINDERS, [
        Query.equal("user_id", user.$id),
        Query.limit(100),
      ]);
      setReminders(res.documents.map(docToReminder));
    } catch (err) {
      console.error("Failed to fetch reminders:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addReminder = useCallback(
    async (r: Omit<Reminder, "id" | "completed" | "user_id">) => {
      if (!user) return;
      const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.REMINDERS, ID.unique(), {
        ...r,
        user_id: user.$id,
        completed: false,
      });
      const reminder = docToReminder(doc);
      setReminders((prev) => [...prev, reminder]);
      return reminder;
    },
    [user]
  );

  const toggleReminder = useCallback(async (id: string) => {
    const existing = reminders.find((r) => r.id === id);
    if (!existing) return;
    await databases.updateDocument(DATABASE_ID, COLLECTIONS.REMINDERS, id, {
      completed: !existing.completed,
    });
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)));
  }, [reminders]);

  return { reminders, loading, addReminder, toggleReminder, refresh };
}

export function useLeadById(id: string) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    databases
      .getDocument(DATABASE_ID, COLLECTIONS.LEADS, id)
      .then((doc) => setLead(docToLead(doc)))
      .catch(() => setLead(null))
      .finally(() => setLoading(false));
  }, [id]);

  return { lead, loading, setLead };
}

export interface UserSettings {
  id: string;
  user_id: string;
  nativeCurrency: string;
  exchangeRates: Record<string, number>;
}

export function useSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.SETTINGS, [
        Query.equal("user_id", user.$id),
        Query.limit(1)
      ]);
      if (res.documents.length > 0) {
        const doc = res.documents[0];
        setSettings({
          id: doc.$id,
          user_id: doc.user_id,
          nativeCurrency: doc.nativeCurrency || "USD",
          exchangeRates: doc.exchangeRates ? JSON.parse(doc.exchangeRates) : {}
        });
      } else {
        setSettings({
          id: "",
          user_id: user.$id,
          nativeCurrency: "USD",
          exchangeRates: {}
        });
      }
    } catch (err) {
      console.error("Failed to fetch settings", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateSettings = async (patch: { nativeCurrency?: string; exchangeRates?: Record<string, number> }) => {
    if (!user || !settings) return;
    try {
      const payload: any = {};
      if (patch.nativeCurrency !== undefined) payload.nativeCurrency = patch.nativeCurrency;
      if (patch.exchangeRates !== undefined) payload.exchangeRates = JSON.stringify(patch.exchangeRates);

      if (settings.id) {
        await databases.updateDocument(DATABASE_ID, COLLECTIONS.SETTINGS, settings.id, payload);
      } else {
        const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.SETTINGS, ID.unique(), {
          user_id: user.$id,
          ...payload
        });
        settings.id = doc.$id;
      }
      setSettings(prev => prev ? { ...prev, ...patch } : null);
    } catch (err) {
      console.error("Failed to update settings", err);
      throw err;
    }
  };

  return { settings, loading, updateSettings, refresh };
}
