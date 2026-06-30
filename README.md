# ITA (Initus Talent Acquisition Portal)

An AI-native recruitment and talent acquisition management platform frontend built for **Initus Consulting**. The application features separate, tailored portals for **Administrators** (control plane) and **Talent Acquisition Executives** (operational workspace).

---

##  Current Project Status

This project is currently a **frontend-only prototype**. 
- **Database & Backend**: None.
- **Authentication**: Hardcoded demo credentials verified on the client side.
- **Data Layer**: Mocked using static datasets (located in `src/mock/data/`).
- **AI Processing**: Conversational flows, drafting tools, and screening workflows are simulated on the client side with timed responses.

---

##  Demo Credentials

To explore the role-based portals, use the following credentials on the login screen:

| Portal / Role | Email | Password | Dashboard Route |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@initus.com` | `admin123` | `/admin/dashboard` |
| **Talent Acquisition (TA)** | `ta@initus.com` | `ta123` | `/ta/dashboard` |

---

##  Tech Stack

This frontend is built using the following technologies:

- **Core Framework**: React 19, TypeScript, Vite
- **State Management**: Zustand
- **Routing**: React Router v7
- **Data Fetching & Caching**: TanStack Query
- **Styling & Theme**: Tailwind CSS (Dark-mode first design system)
- **Forms & Validation**: React Hook Form, Zod
- **Data Visualization**: Recharts
- **Drag-and-Drop Interaction**: @dnd-kit
- **Animations**: Framer Motion
- **Excel Export**: xlsx
- **Toast Notifications**: Sonner

---

##  Features

### Currently Implemented
- **Role-Based Dashboards**: Custom metrics, leaderboard, pipelines, and charts for both Admin and TA users.
- **Client Management**: Full CRUD interface for managing client accounts.
- **TA User Management**: Management dashboard for setting up recruiters and reviewing performance metrics.
- **Job Requisition (JR) Management**: Workspace to configure job briefs, edit generated requisitions, and review version history.
- **Candidate Pipeline (Kanban)**: Drag-and-drop pipeline interface with built-in SLA timers and candidate detail panels.
- **Interview Tracking**: Upcoming cards, completed panels with feedback scoring, and a visual calendar view.
- **Reports & Exporting**: Custom performance metrics, conversion funnels, and data tables with Excel download capabilities.
- **System Notifications**: Notification center for alerts, escalations, and system updates.

### Planned / Not Yet Built
- **Backend API Integration**: Connect frontend requests to a persistent web server.
- **Database Storage**: Move mock states to a relational database schema.
- **Production Authentication**: Replace mock store logic with OAuth / JWT authentication flow.
- **Autonomous AI Agent Workflows**: Integrate live AI agents for JR drafting, CV screening, pipeline SLA tracking, and Natural Language reporting.

---

##  Project Directory Structure

```
ita-portal/
├── src/
│   ├── components/    # Reusable UI components (primitives, shared widgets, and layouts)
│   ├── features/      # Portal-specific page structures and modules (admin, ta, auth, and shared settings)
│   ├── lib/           # Common utilities, styling helper hooks, and app constants
│   ├── mock/          # Mock data arrays representing clients, jobs, candidates, and logs
│   ├── routes/        # App router structure mapping roles to layout panels
│   ├── store/         # Zustand store files maintaining auth states and interface states
│   ├── types/         # Domain-specific TypeScript interfaces (candidate, client, agent, job, etc.)
│   ├── App.tsx        # App entry wrapper displaying toast systems and root routes
│   └── main.tsx       # Entry point launching React DOM
```

---

##  Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/melonelonie/ita-portal.git
   cd ita-portal
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The app should open at [http://localhost:5173/](http://localhost:5173/)*

### Other Commands
- **Build for Production**: `npm run build`
- **Lint Codebase**: `npm run lint`

---

## 
Screenshots & Previews

*(Placeholders: Add images or GIFs of the interface here)*
- **Admin Dashboard**: Visual overview of team performance, metrics, and leaderboards.
- **TA Kanban Board**: Dragging candidates across workflow stages.
- **JR Drafting Workspace**: Split-panel AI agent mock conversation.
- **Reports & Analytics**: Conversion funnel charts and tables.
