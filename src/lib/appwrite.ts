import { Client, Account, Databases } from "appwrite";

const client = new Client();

const endPoint = import.meta.env.VITE_APPWRITE_ENDPOINT
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID

const databseConfig = {
  leads: import.meta.env.VITE_APPWRITE_LEADS_COLLECTION_ID,
  messages: import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID,
  reminders: import.meta.env.VITE_APPWRITE_REMINDERS_COLLECTION_ID
}

// ⚠️ TODO: Replace with our Appwrite endpoint and project ID
client
  .setEndpoint(endPoint as string) 
  .setProject(projectId as string);

export const account = new Account(client);
export const databases = new Databases(client);

// ⚠️ TODO: Replace these with Appwrite Database ID and Collection IDs
// we need to create these collections in our Appwrite Console:
//
// Database: Create a database and paste its ID below
//
// Collection: "leads"
//   Attributes:
//     - user_id (string, required, size: 36)
//     - name (string, required, size: 255)
//     - email (string, required, size: 255)
//     - company (string, required, size: 255)
//     - status (string, required, size: 50) — values: Lead, Contacted, Negotiation, Closed, Lost
//     - notes (string, size: 5000)
//     - last_contacted_at (string, size: 50)
//     - created_at (string, required, size: 50)
//
// Collection: "messages"
//   Attributes:
//     - lead_id (string, required, size: 36)
//     - user_id (string, required, size: 36)
//     - content (string, required, size: 5000)
//     - created_at (string, required, size: 50)
//
// Collection: "reminders"
//   Attributes:
//     - lead_id (string, required, size: 36)
//     - user_id (string, required, size: 36)
//     - date (string, required, size: 50)
//     - note (string, required, size: 1000)
//     - completed (boolean, required, default: false)
//
// ⚠️ IMPORTANT: For each collection, set permissions to allow
//   authenticated users to Create, Read, Update, Delete their own documents.
//   You can use "Users" role or set document-level permissions.

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID; // ← Replace with your Database ID
export const COLLECTIONS = {
  LEADS: databseConfig.leads, 
  MESSAGES: databseConfig.messages,
  REMINDERS: databseConfig.reminders,
};
