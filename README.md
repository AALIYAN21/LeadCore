# LeadCore — AI-Powered Sales Assistant

**LeadCore** is an intelligent CRM platform designed for freelancers and agencies. It combines lead management, AI-driven insights, and smart reminders to streamline your sales workflow and close more deals.

## 🎯 Features

- **Lead Management** — Track, organize, and manage all your leads in one place
- **AI-Powered Insights** — Intelligent conversation summaries, follow-up suggestions, and deal assessments powered by Gemini AI
- **Messages & History** — Keep detailed records of every interaction with your leads
- **Smart Reminders** — Set and track follow-up reminders to never miss an opportunity
- **Status Tracking** — Monitor lead progress through your sales pipeline (Lead → Contacted → Negotiation → Closed/Lost)
- **Dashboard** — Real-time overview of your sales metrics and pipeline health
- **User Authentication** — Secure login and signup for your team

## 🛠️ Tech Stack

### Frontend
- **React 19** — Modern UI building
- **TanStack Router** — Type-safe routing
- **TanStack React Start** — Meta-frameworks and server functions
- **Tailwind CSS** — Utility-first styling
- **Radix UI** — Accessible component primitives
- **React Hook Form** — Efficient form management
- **Zod** — TypeScript-first schema validation

### Backend & Database
- **Appwrite** — Open-source backend (auth, database, storage)
- **Vite** — Lightning-fast build tool
- **Cloudflare Workers** — Edge computing deployment

### AI & Intelligence
- **Google Gemini API** — AI-powered follow-up generation and conversation analysis

### Additional Tools
- **React Query** — Server state management
- **Recharts** — Data visualization
- **Sonner** — Toast notifications
- **Date-fns** — Date manipulation
- **Lucide React** — Beautiful icons

## 📋 Database Setup

### Database Requirements

**LeadCore** uses **Appwrite** for its backend database. You need to create one database with three collections:

#### Collection 1: `leads`
Core lead information and sales pipeline tracking.

| Column | Data Type | Size | Required | Description |
|--------|-----------|------|----------|-------------|
| `user_id` | String | 36 | Yes | ID of the user who owns this lead |
| `name` | String | 255 | Yes | Lead's full name |
| `email` | String | 255 | Yes | Lead's email address |
| `company` | String | 255 | Yes | Company name |
| `status` | String | 50 | Yes | Lead status: `Lead` \| `Contacted` \| `Negotiation` \| `Closed` \| `Lost` |
| `notes` | String | 5000 | No | Additional notes about the lead |
| `last_contacted_at` | String | 50 | No | ISO 8601 timestamp of last contact |
| `created_at` | String | 50 | Yes | ISO 8601 timestamp when lead was created |

#### Collection 2: `messages`
Conversation history and communication log for each lead.

| Column | Data Type | Size | Required | Description |
|--------|-----------|------|----------|-------------|
| `lead_id` | String | 36 | Yes | Foreign key reference to leads collection |
| `user_id` | String | 36 | Yes | ID of the user who sent the message |
| `content` | String | 5000 | Yes | Message body text |
| `created_at` | String | 50 | Yes | ISO 8601 timestamp when message was sent |

#### Collection 3: `reminders`
Follow-up reminders and tasks related to leads.

| Column | Data Type | Size | Required | Description |
|--------|-----------|------|----------|-------------|
| `lead_id` | String | 36 | Yes | Foreign key reference to leads collection |
| `user_id` | String | 36 | Yes | ID of the user this reminder belongs to |
| `date` | String | 50 | Yes | ISO 8601 timestamp for when the reminder should alert |
| `note` | String | 1000 | Yes | Reminder text/task description |
| `completed` | Boolean | — | Yes | Completion status (default: `false`) |

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun** 1.0+
- **Appwrite Account** (free tier available at [cloud.appwrite.io](https://cloud.appwrite.io))
- **Google Gemini API Key** (free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey))

### 1. Install Dependencies

Using Bun (recommended):
```bash
bun install
```

Or using npm:
```bash
npm install
```

### 2. Set Up Appwrite

1. **Create an Appwrite Account** — Sign up at [cloud.appwrite.io](https://cloud.appwrite.io)
2. **Create a Database** — Create a new database and note its ID
3. **Create Collections** — Create three collections (`leads`, `messages`, `reminders`) with the schema defined above
4. **Set Permissions** — For each collection:
   - Allow authenticated users to Create, Read, Update, Delete their own documents
   - Use document-level permissions or the "Users" role

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_DATABASE_ID=your_database_id_here
VITE_LEADS_COLLECTION_ID=your_leads_collection_id_here
VITE_MESSAGES_COLLECTION_ID=your_messages_collection_id_here
VITE_REMINDERS_COLLECTION_ID=your_reminders_collection_id_here
GEMINI_API_KEY=your_gemini_api_key_here
```

Then update [src/lib/appwrite.ts](src/lib/appwrite.ts) with your configuration:

```typescript
export const DATABASE_ID = "your_database_id_here";
export const COLLECTIONS = {
  LEADS: "your_leads_collection_id_here",
  MESSAGES: "your_messages_collection_id_here",
  REMINDERS: "your_reminders_collection_id_here",
};
```

### 4. Start Development Server

Using Bun:
```bash
bun run dev
```

Or using npm:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── routes/               # TanStack Router pages
│   ├── __root.tsx       # Root layout
│   ├── index.tsx        # Dashboard
│   ├── leads.index.tsx  # Leads list
│   ├── leads.$leadId.tsx # Lead details
│   ├── reminders.tsx    # Reminders view
│   ├── login.tsx        # Authentication
│   └── signup.tsx       # Registration
├── components/          # React components
│   ├── ui/             # Radix UI primitives
│   ├── AppLayout.tsx   # Main layout wrapper
│   ├── AppSidebar.tsx  # Navigation sidebar
│   ├── StatCard.tsx    # Dashboard stat tiles
│   └── StatusBadge.tsx # Lead status display
├── lib/
│   ├── appwrite.ts     # Appwrite client & config
│   ├── auth.tsx        # Authentication logic
│   ├── ai.functions.ts # Gemini AI server functions
│   ├── store.ts        # State management
│   └── utils.ts        # Utility functions
├── hooks/
│   └── use-mobile.tsx  # Mobile detection hook
├── styles.css          # Global styles
├── router.tsx          # Router configuration
└── routeTree.gen.ts    # Auto-generated route types
```

## 🔐 Authentication

LeadCore uses Appwrite's built-in authentication:

- **Sign Up** — Create new user accounts
- **Login** — Authenticate with email/password
- **Session Management** — Persistent sessions with token refresh

Users can only access and modify their own leads, messages, and reminders.

## 🤖 AI Features

All AI features are powered by **Google Gemini API**:

### Follow-up Generation
Automatically generate professional follow-up messages based on lead context and desired tone.

### Conversation Summarization
Get AI-powered summaries of sales conversations with intent analysis and next step recommendations.

### Smart Suggestions
Receive intelligent recommendations for next actions and deal probability assessments.

## 📊 Key Metrics

The dashboard displays:
- **Total Leads** — Count of all leads in your pipeline
- **Active Deals** — Leads in "Contacted" or "Negotiation" phase
- **Follow-ups Due** — Incomplete reminders with past dates
- **Closed Deals** — Leads with "Closed" status

## 🔒 Security & Permissions

- All user data is isolated by `user_id`
- Appwrite handles authentication and authorization
- Document-level permissions ensure users can only access their own data
- API keys are server-side only (Gemini API key never exposed to client)

## 📝 Scripts

```bash
# Development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Lint code
bun run lint

# Production build for development
bun run build:dev
```

## 🚢 Deployment

### Deploy to Cloudflare Workers

1. Configure your `wrangler.jsonc` with Cloudflare account details
2. Run: `bunx wrangler deploy` or `npm run deploy`

### Deploy to Other Platforms

This is a full-stack Vite app and can be deployed to:
- Vercel
- Netlify
- AWS
- Azure
- Any Node.js hosting provider

## 📚 Documentation

- [Appwrite Docs](https://appwrite.io/docs)
- [TanStack Router](https://tanstack.com/router)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [Google Gemini API](https://ai.google.dev)

## 🐛 Troubleshooting

### "GEMINI_API_KEY is not configured"
- Ensure `GEMINI_API_KEY` is set in your server environment variables
- For development, add it to your `.env.local`
- The AI functions will show a placeholder message if not configured

### "Collection not found" Error
- Verify all collection IDs are correct in `appwrite.ts`
- Ensure collections exist in your Appwrite dashboard
- Check that permissions are set correctly

### Authentication Issues
- Clear browser cache and cookies
- Verify Appwrite endpoint and project ID are correct
- Check that authentication is enabled in your Appwrite project

## 📄 License

This project is open source. See LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

---

**Built with ❤️ for freelancers and agencies**
