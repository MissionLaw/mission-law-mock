# Database Setup Guide

## Overview

The Mission Law application is configured with **Drizzle ORM** and **Supabase** for local development, providing a production-ready database foundation.

## 🏗️ Architecture

### Database Stack
- **PostgreSQL**: Primary database
- **Drizzle ORM**: Type-safe database operations
- **Supabase**: Local development backend
- **TypeScript**: Full type safety throughout

### Hybrid Approach
The application uses a smart hybrid system that:
- **Tries database first** when available
- **Falls back to mock data** if database is unavailable
- **Provides seamless experience** regardless of setup

## 📁 Database Structure

### Core Tables

```sql
-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  company VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP DEFAULT now() NOT NULL
);

-- Attorneys table
CREATE TABLE attorneys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  specialties JSONB NOT NULL, -- Array of service types
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP DEFAULT now() NOT NULL
);

-- Users table (authentication)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role user_role NOT NULL, -- 'client' | 'admin'
  client_id UUID REFERENCES clients(id),
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP DEFAULT now() NOT NULL
);

-- Services table (main business logic)
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  type service_type NOT NULL, -- 'nda' | 'employee_onboarding' | 'contract_review'
  status service_status NOT NULL DEFAULT 'submitted', -- 'submitted' | 'legal_review' | 'client_review' | 'complete'
  client_id UUID NOT NULL REFERENCES clients(id),
  assigned_attorney_id UUID REFERENCES attorneys(id),
  form_data JSONB NOT NULL, -- Dynamic form fields
  notes JSONB DEFAULT '[]', -- Array of string notes
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP DEFAULT now() NOT NULL
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  service_id UUID NOT NULL REFERENCES services(id),
  uploaded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now() NOT NULL
);
```

### Enums

```sql
CREATE TYPE service_type AS ENUM ('nda', 'employee_onboarding', 'contract_review');
CREATE TYPE service_status AS ENUM ('submitted', 'legal_review', 'client_review', 'complete');
CREATE TYPE user_role AS ENUM ('client', 'admin');
```

## 🚀 Setup Instructions

### Option 1: Quick Setup (Recommended)

```bash
npm install
npm run setup  # Starts Supabase, applies migrations, seeds data
npm run dev    # Start the application
```

### Option 2: Manual Setup

```bash
npm install
npm run db:start      # Start Supabase
npm run db:push       # Apply database schema
npm run script seed   # Seed with sample data
npm run dev          # Start the application
```

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run setup` | Complete setup (start DB, migrate, seed) |
| `npm run db:start` | Start local Supabase |
| `npm run db:stop` | Stop local Supabase |
| `npm run db:studio` | Open database studio (localhost:54323) |
| `npm run db:generate` | Generate migrations from schema |
| `npm run db:push` | Push schema changes to database |
| `npm run db:migrate` | Apply migrations |
| `npm run db:reset` | Reset database |
| `npm run script seed` | Seed database with sample data |

## 🔌 Database Service Layer

### HybridDatabaseService

The application uses a smart hybrid service (`lib/services/hybrid-database.ts`) that:

```typescript
// Automatically detects database availability
const isAvailable = await HybridDatabaseService.checkDatabaseConnection()

// Uses database when available, falls back to mock data
const services = await HybridDatabaseService.getServices(filters)
```

### Key Features

- **Automatic Fallback**: Seamlessly switches between database and mock data
- **Type Safety**: Full TypeScript integration with Drizzle types
- **Error Handling**: Graceful degradation when database is unavailable
- **Development Friendly**: Works with or without database setup

## 🗄️ Sample Data

The seeding script creates:

- **3 Client Companies**: TechCorp, InnovateLab, Global Ventures
- **2 Attorneys**: David Morrison (contracts/NDAs), Lisa Thompson (employment/contracts)
- **5 Users**: 3 clients + 2 admin attorneys
- **5 Services**: Mix of NDAs, employee onboarding, contract reviews
- **Various Statuses**: From submitted to complete

### Demo Accounts

```
Client Accounts:
- sarah.johnson@techcorp.com (TechCorp Solutions)
- michael.chen@innovatelab.com (InnovateLab Inc)
- amanda.rodriguez@globalventures.com (Global Ventures LLC)

Admin Accounts:
- david.morrison@missionlaw.com (Contract/NDA specialist)
- lisa.thompson@missionlaw.com (Employment/Contract specialist)
```

## 🔍 Database Operations

### Services CRUD

```typescript
// Get all services with filtering
const services = await HybridDatabaseService.getServices({
  clientId: 'client-1',
  status: 'legal_review',
  type: 'nda',
  search: 'DataFlow'
})

// Create new service
const service = await HybridDatabaseService.createService({
  title: 'NDA with Partner Co',
  type: 'nda',
  clientId: 'client-1',
  formData: { /* dynamic form data */ }
})

// Update service
const updated = await HybridDatabaseService.updateService('service-1', {
  status: 'legal_review',
  assignedAttorneyId: 'attorney-1',
  notes: ['Started review process']
})
```

### Relations & Joins

All database operations include proper relations:

```typescript
// Service with client and attorney info
{
  id: 'service-1',
  title: 'NDA with DataFlow Systems',
  status: 'legal_review',
  client: {
    name: 'Sarah Johnson',
    company: 'TechCorp Solutions'
  },
  attorney: {
    name: 'David Morrison',
    specialties: ['contract_review', 'nda']
  }
}
```

## 🛠️ Troubleshooting

### Database Connection Issues

If Supabase fails to start:

1. **Check Docker**: Ensure Docker is running
2. **Port Conflicts**: Stop other Supabase instances
3. **Hybrid Mode**: App will fall back to mock data automatically

### Common Commands

```bash
# Check database status
npm run db:studio

# Reset everything
npm run db:stop
npm run db:reset
npm run setup

# View logs
npx supabase logs
```

### Environment Variables

Required in `.env.local`:

```bash
# Supabase Local
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=<local-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<local-service-key>

# Public (client-side)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local-anon-key>

# Database
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

## 🎯 Production Considerations

This setup provides a solid foundation for production with:

- **Type-safe database operations** via Drizzle ORM
- **Migration system** for schema changes
- **Proper foreign key relationships**
- **JSON fields** for flexible form data
- **Role-based access control**
- **Audit fields** (created_at, updated_at)

To deploy to production, simply:

1. Set up Supabase project
2. Update environment variables
3. Run migrations: `npm run db:migrate`
4. Deploy Next.js app

The hybrid service ensures the application works seamlessly in both development and production environments.