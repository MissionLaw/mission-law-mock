# Mission Law - Legal Services Management Demo App

A modern full-stack legal services management platform built with Next.js, TypeScript, and Tailwind CSS. This application demonstrates contemporary development patterns including database integration with Drizzle ORM and Supabase.

## 🚀 Quick Start

```bash
npm install       # Install dependencies
npm run setup     # Starts Supabase, applies schema, seeds data
npm run dev       # Start development server

# Open http://localhost:3001
```

## 🔐 Demo Accounts

**Client Account:**

- Email: `sarah.johnson@techcorp.com`
- Access: Client dashboard, service requests, status tracking

**Admin Account:**

- Email: `david.morrison@missionlaw.com`
- Access: Service management, client oversight, status updates

## ✨ Features

### Client Portal

- **Dashboard**: Service overview with statistics and quick actions
- **Service Requests**: Dynamic forms for NDAs, employee onboarding, contract reviews
- **Progress Tracking**: Real-time status updates (Submitted → Legal Review → Client Review → Complete)
- **Professional UI**: Clean, trustworthy interface for legal services

### Admin Portal

- **Service Management**: View and manage all client requests
- **Status Controls**: Update service status and assign attorneys
- **Client Overview**: Manage client accounts and information
- **Search & Filtering**: Find services by status, type, client, or keywords

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with full type safety
- **Styling**: Tailwind CSS with responsive design
- **Database**: PostgreSQL with Drizzle ORM (optional)
- **Backend**: Supabase for local development
- **Data Fetching**: SWR for caching and real-time updates
- **Icons**: Heroicons
- **State**: React hooks + SWR

## 🗄️ Database (Optional)

The app uses a smart hybrid system:

- **Database-first**: Uses PostgreSQL when available
- **Fallback**: Seamlessly falls back to mock data
- **Session persistence**: Maintains created services in memory

### Database Setup

```bash
# Full database setup (optional)
npm run setup     # Starts Supabase, migrates, seeds data

# Manual setup
npm run db:start  # Start local Supabase
npm run db:push   # Apply schema
npm run script seed # Add sample data
```

### Database Commands

```bash
npm run db:studio    # Open database studio
npm run db:stop      # Stop Supabase
npm run db:reset     # Reset database
```

## 📁 Service Types

1. **NDAs**: Non-disclosure agreements with counterparty details
2. **Employee Onboarding**: New hire documentation and contracts
3. **Contract Review**: Legal review of third-party agreements

## 🎯 Architecture Highlights

- **Role-based routing** with protected layouts
- **Dynamic forms** based on service type
- **Type-safe database operations** with Drizzle
- **Responsive design** with mobile-first approach
- **Professional UI patterns** for legal industry
- **Real-time status tracking** with visual progress indicators

## 🔧 Development

The application demonstrates:

- Modern Next.js 15 patterns with async components
- Full-stack TypeScript implementation
- Database design with proper relations
- Form handling with validation
- Authentication and authorization
- Responsive component architecture

## 📝 Sample Data

Includes realistic legal service scenarios:

- 3 client companies (TechCorp, InnovateLab, Global Ventures)
- 2 attorneys with different specialties
- 5+ services across all types and statuses
- Complete form templates for each service type

---

The purpose of this project is to provide a simple canvas for technical interviews using a tech stack and features that are similar to our production app.
