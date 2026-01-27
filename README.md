# Lunari - Financial Accounting Platform

## Table of Contents
1. [Overview](#overview)
2. [Developer Setup Guide](#developer-setup-guide)
3. [Environment Variables](#environment-variables)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Project Structure](#project-structure)
7. [Key Modules](#key-modules)
8. [API Reference](#api-reference)
9. [Troubleshooting](#troubleshooting)

---

## Overview

Lunari is a comprehensive financial accounting application for managing:
- Prepaid expenses, fixed assets, accruals
- Revenue recognition, investment income, debt amortization
- Financial statement preparation and working papers
- Entity governance and compliance

---

## Developer Setup Guide

### Prerequisites

Before you start, you need to install the following software on your computer:

#### 1. Node.js (Required)
- **Version**: 20.x or higher
- **Download**: https://nodejs.org/
- **How to check if installed**: Open terminal and run:
  ```bash
  node --version
  ```
  You should see something like `v20.10.0`

#### 2. npm (Comes with Node.js)
- **Version**: 10.x or higher
- **How to check if installed**:
  ```bash
  npm --version
  ```
  You should see something like `10.2.0`

#### 3. PostgreSQL Database (Required)
- **Version**: 14.x or higher
- **Download**: https://www.postgresql.org/download/
- **How to check if installed**:
  ```bash
  psql --version
  ```
  You should see something like `psql (PostgreSQL) 14.9`

#### 4. Git (Required)
- **Download**: https://git-scm.com/downloads
- **How to check if installed**:
  ```bash
  git --version
  ```

### Step-by-Step Setup

#### Step 1: Clone the Repository

Open your terminal and run:
```bash
git clone https://github.com/YOUR_USERNAME/lunari.git
cd lunari
```

Replace `YOUR_USERNAME` with the actual GitHub username or organization.

#### Step 2: Install Dependencies

This downloads all the code packages the app needs:
```bash
npm install
```

**Wait for this to complete.** It may take 2-5 minutes depending on your internet speed.

#### Step 3: Create Environment File

Create a file called `.env` in the root folder of the project:
```bash
touch .env
```

Then open `.env` in your code editor and add the required variables (see next section).

#### Step 4: Set Up Database

See the [Database Setup](#database-setup) section below.

#### Step 5: Run the Application

```bash
npm run dev
```

The app will start at `http://localhost:5000`

---

## Environment Variables

Create a `.env` file in the root directory with these variables:

### Required Variables

```env
# Database Connection
# Format: postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/lunari

# Session Security (Generate a random string - at least 32 characters)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
```

### How to Generate SESSION_SECRET

Run this command in your terminal to generate a secure random string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your SESSION_SECRET value.

### Optional Variables (for AI Features)

```env
# OpenAI API Key (only needed for AI Policy Assistant feature)
OPENAI_API_KEY=sk-your-openai-api-key
```

### Example Complete .env File

```env
DATABASE_URL=postgresql://postgres:mypassword123@localhost:5432/lunari
SESSION_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
OPENAI_API_KEY=sk-proj-abc123xyz789
```

---

## Database Setup

### Option A: Local PostgreSQL Installation

#### Step 1: Install PostgreSQL

**On macOS (using Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**On Ubuntu/Debian Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**On Windows:**
1. Download the installer from https://www.postgresql.org/download/windows/
2. Run the installer and follow the prompts
3. **Important**: Remember the password you set for the `postgres` user during installation
4. After installation, open "SQL Shell (psql)" from the Start menu
5. When prompted, press Enter to accept defaults for server, database, port, and username
6. Enter your password when prompted

#### Step 2: Create a Database

Open PostgreSQL command line:
```bash
psql -U postgres
```

**On Windows**: Use "SQL Shell (psql)" from the Start menu.

Create the database:
```sql
CREATE DATABASE lunari;
```

Exit PostgreSQL:
```sql
\q
```

#### Step 3: Update Your .env File

Make sure your DATABASE_URL matches your PostgreSQL setup:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/lunari
```

Replace `YOUR_PASSWORD` with the password you set during PostgreSQL installation.

#### Step 4: Push Database Schema

This creates all the required tables:
```bash
npm run db:push
```

If you get errors, try:
```bash
npm run db:push --force
```

### Option B: Using Replit's Built-in Database

If you're running on Replit, the database is already configured. The `DATABASE_URL` environment variable is automatically set.

---

## Running the Application

### Development Mode (Recommended for Development)

```bash
npm run dev
```

This starts:
- Backend server on port 5000
- Frontend with hot-reload (changes appear instantly)
- Open http://localhost:5000 in your browser

**Note**: Both frontend and backend run on the same port (5000). The Express server handles API requests while Vite serves the frontend.

### What You Should See

1. Terminal shows: `serving on port 5000`
2. Browser shows the Lunari dashboard
3. No red errors in the terminal

### Stopping the Application

Press `Ctrl + C` in the terminal.

### Production Mode

To build and run the application in production:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

The production server runs on port 5000. Make sure your environment variables are set before starting.

---

## Project Structure

```
lunari/
├── client/                    # Frontend (React application)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/            # Base UI components (Button, Card, etc.)
│   │   │   └── app-sidebar.tsx # Main navigation sidebar
│   │   ├── pages/             # Application pages
│   │   │   ├── dashboard.tsx  # Main dashboard
│   │   │   ├── master-mapping.tsx  # GL Master Mapping page
│   │   │   ├── tb-import.tsx  # Trial Balance Import page
│   │   │   └── ...            # Other pages
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions
│   │   ├── contexts/          # React context providers
│   │   ├── App.tsx            # Main application component
│   │   └── index.css          # Global styles
│   └── index.html             # HTML entry point
│
├── server/                    # Backend (Express server)
│   ├── index.ts               # Server entry point
│   ├── routes.ts              # API route definitions
│   ├── storage.ts             # Data storage layer
│   ├── db.ts                  # Database connection
│   ├── middleware/            # Express middleware (auth, RBAC)
│   ├── replit_integrations/   # Replit Auth integration
│   └── vite.ts                # Vite dev server integration
│
├── shared/                    # Code shared between frontend and backend
│   ├── schema.ts              # Data types and validation schemas
│   └── models/                # Data model definitions
│
├── .env                       # Environment variables (you create this)
├── package.json               # Project dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── drizzle.config.ts          # Database ORM configuration
└── README.md                  # This file - developer documentation
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `client/src/App.tsx` | Main React component, defines all page routes |
| `client/src/components/app-sidebar.tsx` | Navigation sidebar with all menu items |
| `server/routes.ts` | All API endpoints (GET, POST, PATCH, DELETE) |
| `server/storage.ts` | Data storage methods (CRUD operations) |
| `server/db.ts` | PostgreSQL database connection |
| `server/middleware/` | Authentication and authorization middleware |
| `shared/schema.ts` | TypeScript types and Zod validation schemas |
| `package.json` | Lists all npm packages and scripts |

---

## Key Modules

### 1. Schedule Studio
Manages financial instruments (prepaids, fixed assets, accruals, revenue, investments, debt).

**Location**: `/schedules`, `/prepaids`, `/fixed-assets`, `/accruals`, `/revenue`, `/investment-income`, `/debt`

### 2. Cash Scheduler
Cash flow tracking with category summaries.

**Location**: `/cash-scheduler`

### 3. OneClose
Close management with certification workflows and task tracking.

**Location**: `/oneclose`

### 4. Reconciliations
Balance sheet account reconciliation workspaces.

**Location**: `/reconciliations`

### 5. NetTool (Financial Statements)
Complete financial reporting suite:
- **Trial Balance**: `/nettool/fs/trial-balance`
- **Balance Sheet**: `/nettool/fs/balance-sheet`
- **Income Statement**: `/nettool/fs/income-statement`
- **Working Papers**: `/nettool/working-papers`
- **GL Master Mapping**: `/master-mapping`
- **TB Import**: `/tb-import`

### 6. One Compliance
Entity governance and regulatory compliance tracking.

**Location**: `/compliance`

---

## API Reference

### Base URL
All API endpoints start with `/api/`

**Note**: This section documents the most commonly used endpoints. Each module (prepaids, fixed-assets, accruals, revenue, investment-income, debt, cash, reconciliations, close-control) has additional endpoints for KPIs, breakdowns, trends, and detailed operations. See `server/routes.ts` for the complete list.

### Main Endpoints

#### Schedules
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schedules` | Get all schedules |
| GET | `/api/schedules/:id` | Get single schedule |
| POST | `/api/schedules` | Create new schedule |
| POST | `/api/schedules/:id/events` | Add event to schedule |
| POST | `/api/schedules/:id/rebuild` | Rebuild schedule periods |

#### GL Master Mapping
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/gl-mappings` | Get all GL mappings |
| GET | `/api/gl-mappings/:id` | Get single mapping |
| GET | `/api/gl-mappings/wp-names` | Get unique WP names for dropdown |
| POST | `/api/gl-mappings` | Create new mapping (requires: glAccountNumber, glDescriptionCategory, footnoteDescription) |
| PATCH | `/api/gl-mappings/:id` | Update mapping |
| DELETE | `/api/gl-mappings/:id` | Delete mapping |

#### Trial Balance Import
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tb-imports` | Get all import batches |
| GET | `/api/tb-imports/:batchId` | Get single batch with entries |
| POST | `/api/tb-imports` | Import TB data |
| DELETE | `/api/tb-imports/:batchId` | Delete import batch |

#### Working Papers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/working-papers` | Get all working papers |
| POST | `/api/working-papers` | Create working paper |
| POST | `/api/working-papers/auto-populate` | Auto-populate from TB data |
| PATCH | `/api/working-papers/:id` | Update working paper |
| DELETE | `/api/working-papers/:id` | Delete working paper |

#### Entities & Periods
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/entities` | Get all entities |
| POST | `/api/db/entities` | Create entity |
| GET | `/api/entities/:entityId/periods` | Get periods for entity |
| POST | `/api/entities/:entityId/periods/:period/close` | Close a period |

#### Reconciliations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reconciliations` | Get all reconciliations |
| GET | `/api/reconciliations/:id` | Get single reconciliation |
| POST | `/api/reconciliations` | Create reconciliation |
| PATCH | `/api/reconciliations/:id/status` | Update status |

#### Close Control (OneClose)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/close-control/templates` | Get all templates |
| POST | `/api/close-control/templates/:id/tasks` | Add task to template |
| GET | `/api/close-control/certifications` | Get certifications |
| POST | `/api/close-control/certifications` | Create certification |

#### Import/Export
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/import/trial-balance` | Import trial balance |
| POST | `/api/import/parse-file` | Parse uploaded file |
| GET | `/api/export/pdf/:type` | Export PDF (balance-sheet, income-statement, cash-flow) |
| GET | `/api/export/excel/:type` | Export Excel (trial-balance, schedules) |

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/user` | Get current logged-in user |
| POST | `/api/auth/logout` | Log out current user |

---

## Troubleshooting

### Common Issues and Solutions

#### 1. "npm install" fails

**Problem**: Errors during package installation

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and try again
rm -rf node_modules
npm install
```

#### 2. "Cannot connect to database"

**Problem**: DATABASE_URL is incorrect or PostgreSQL is not running

**Solutions**:
1. Check PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   
   # Windows
   # Check Windows Services for "postgresql" service
   ```

2. Verify your DATABASE_URL format:
   ```
   postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
   ```

3. Test connection manually:
   ```bash
   psql $DATABASE_URL
   ```

#### 3. "Port 5000 already in use"

**Problem**: Another application is using port 5000

**Solution**:
```bash
# Find what's using port 5000 (macOS/Linux)
lsof -i :5000

# Kill that process (replace PID with the number shown)
kill -9 PID
```

**On Windows:**
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

#### 4. "Module not found" errors

**Problem**: Missing dependencies

**Solution**:
```bash
npm install
```

#### 5. Database tables don't exist

**Problem**: Schema not pushed to database

**Solution**:
```bash
npm run db:push
```

#### 6. Changes not appearing in browser

**Problem**: Browser cache or server needs restart

**Solutions**:
1. Hard refresh browser: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
2. Restart the server: Press `Ctrl + C` then run `npm run dev` again

#### 7. TypeScript errors

**Problem**: Type mismatches in code

**Solution**:
Check the terminal for specific error messages. The error will tell you:
- Which file has the problem
- Which line number
- What type was expected vs. received

---

## User Preferences

- Financial application styling with professional appearance
- Clear currency formatting with proper decimal places
- Dark mode support
- Period state visual indicators (badges with colors)

---

## External Dependencies

| Package | Purpose |
|---------|---------|
| React | Frontend UI library |
| TypeScript | Type-safe JavaScript |
| TanStack Query | Data fetching and caching |
| Wouter | Client-side routing |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Pre-built UI components |
| Express | Backend web server |
| Drizzle ORM | Database access |
| Zod | Data validation |
| Decimal.js | Precise financial calculations |
| xlsx | Excel file handling |
| pdfkit | PDF generation |
| multer | File upload handling |

---

## Getting Help

If you encounter issues not covered here:

1. Check the terminal for error messages
2. Look at the browser console (F12 > Console tab)
3. Review recent code changes
4. Search the codebase for similar implementations

---

*Last updated: January 2026*
