import { useState, useEffect, useCallback } from "react";

export type LeadStatus = "Lead" | "Contacted" | "Negotiation" | "Closed" | "Lost";

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  status: LeadStatus;
  notes: string;
  last_contacted_at: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  lead_id: string;
  content: string;
  created_at: string;
}

export interface Reminder {
  id: string;
  lead_id: string;
  date: string;
  note: string;
  completed: boolean;
}

const LEADS_KEY = "sales_assistant_leads";
const MESSAGES_KEY = "sales_assistant_messages";
const REMINDERS_KEY = "sales_assistant_reminders";

function generateId() {
  return crypto.randomUUID();
}

function load<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Seed data
const SEED_LEADS: Lead[] = [
  { id: generateId(), name: "Sarah Chen", email: "sarah@techvault.io", company: "TechVault", status: "Negotiation", notes: "Interested in full rebrand. Budget ~$15k.", last_contacted_at: "2026-04-12T10:00:00Z", created_at: "2026-04-01T09:00:00Z" },
  { id: generateId(), name: "Marcus Rivera", email: "marcus@greenleaf.co", company: "GreenLeaf Co", status: "Contacted", notes: "Needs a landing page for product launch.", last_contacted_at: "2026-04-10T14:00:00Z", created_at: "2026-04-03T11:00:00Z" },
  { id: generateId(), name: "Emily Watson", email: "emily@novadesign.com", company: "Nova Design", status: "Lead", notes: "Referred by Jake. Interested in UX audit.", last_contacted_at: null, created_at: "2026-04-08T16:00:00Z" },
  { id: generateId(), name: "James Park", email: "james@finflow.app", company: "FinFlow", status: "Closed", notes: "Signed contract for dashboard redesign. $8k.", last_contacted_at: "2026-04-11T09:00:00Z", created_at: "2026-03-20T08:00:00Z" },
  { id: generateId(), name: "Lisa Thompson", email: "lisa@urbancraft.co", company: "UrbanCraft", status: "Lost", notes: "Went with a competitor. Price was the issue.", last_contacted_at: "2026-04-05T12:00:00Z", created_at: "2026-03-15T10:00:00Z" },
];

function initializeStore() {
  if (!localStorage.getItem(LEADS_KEY)) {
    save(LEADS_KEY, SEED_LEADS);
  }
  if (!localStorage.getItem(MESSAGES_KEY)) {
    save(MESSAGES_KEY, []);
  }
  if (!localStorage.getItem(REMINDERS_KEY)) {
    const seedReminders: Reminder[] = [
      { id: generateId(), lead_id: SEED_LEADS[0].id, date: "2026-04-15", note: "Follow up on proposal", completed: false },
      { id: generateId(), lead_id: SEED_LEADS[1].id, date: "2026-04-16", note: "Send landing page mockups", completed: false },
    ];
    save(REMINDERS_KEY, seedReminders);
  }
}

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    initializeStore();
    setLeads(load<Lead>(LEADS_KEY, []));
  }, []);

  const refresh = useCallback(() => setLeads(load<Lead>(LEADS_KEY, [])), []);

  const addLead = useCallback((lead: Omit<Lead, "id" | "created_at">) => {
    const newLead: Lead = { ...lead, id: generateId(), created_at: new Date().toISOString() };
    const updated = [newLead, ...load<Lead>(LEADS_KEY, [])];
    save(LEADS_KEY, updated);
    setLeads(updated);
    return newLead;
  }, []);

  const updateLead = useCallback((id: string, patch: Partial<Lead>) => {
    const updated = load<Lead>(LEADS_KEY, []).map(l => l.id === id ? { ...l, ...patch } : l);
    save(LEADS_KEY, updated);
    setLeads(updated);
  }, []);

  const deleteLead = useCallback((id: string) => {
    const updated = load<Lead>(LEADS_KEY, []).filter(l => l.id !== id);
    save(LEADS_KEY, updated);
    setLeads(updated);
  }, []);

  return { leads, addLead, updateLead, deleteLead, refresh };
}

export function useMessages(leadId: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const all = load<Message>(MESSAGES_KEY, []);
    setMessages(all.filter(m => m.lead_id === leadId));
  }, [leadId]);

  const addMessage = useCallback((content: string) => {
    const msg: Message = { id: generateId(), lead_id: leadId, content, created_at: new Date().toISOString() };
    const all = [...load<Message>(MESSAGES_KEY, []), msg];
    save(MESSAGES_KEY, all);
    setMessages(all.filter(m => m.lead_id === leadId));
    return msg;
  }, [leadId]);

  return { messages, addMessage };
}

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    initializeStore();
    setReminders(load<Reminder>(REMINDERS_KEY, []));
  }, []);

  const addReminder = useCallback((r: Omit<Reminder, "id" | "completed">) => {
    const reminder: Reminder = { ...r, id: generateId(), completed: false };
    const updated = [...load<Reminder>(REMINDERS_KEY, []), reminder];
    save(REMINDERS_KEY, updated);
    setReminders(updated);
    return reminder;
  }, []);

  const toggleReminder = useCallback((id: string) => {
    const updated = load<Reminder>(REMINDERS_KEY, []).map(r => r.id === id ? { ...r, completed: !r.completed } : r);
    save(REMINDERS_KEY, updated);
    setReminders(updated);
  }, []);

  return { reminders, addReminder, toggleReminder };
}

export function getLeadById(id: string): Lead | undefined {
  return load<Lead>(LEADS_KEY, []).find(l => l.id === id);
}

export function getLeadName(leadId: string): string {
  const lead = getLeadById(leadId);
  return lead?.name ?? "Unknown";
}
