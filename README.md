# Mission Law - Legal Services Management App

A modern legal services management web application built with Next.js, TypeScript, and Tailwind CSS. This application serves as a technical interview canvas for exploring full-stack development patterns and demonstrates a complete client-attorney workflow.

## Features

### Client Portal
- **Dashboard**: Overview of services, statistics, and quick actions
- **Service Requests**: Create new requests for NDAs, employee onboarding, and contract reviews
- **Service Tracking**: Monitor progress through different stages (Submitted → Legal Review → Client Review → Complete)
- **Dynamic Forms**: Type-specific forms with validation and file upload support

### Admin Portal
- **Service Management**: View and manage all client service requests
- **Client Management**: View client profiles and information
- **Status Updates**: Update service status and assign attorneys
- **Filtering & Search**: Find services by status, type, client, or search terms

### Technical Features
- **Authentication**: Role-based access (client vs admin)
- **API Routes**: RESTful endpoints for services and client management
- **Real-time Updates**: SWR for data fetching and caching
- **Responsive Design**: Mobile-first responsive layout
- **Type Safety**: Full TypeScript implementation
- **Professional UI**: Clean, trustworthy interface appropriate for legal services

## Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Drizzle ORM
- **Backend**: Supabase (local development)
- **Data Fetching**: SWR
- **Icons**: Heroicons
- **Authentication**: Custom auth service with localStorage
- **State Management**: React hooks + SWR

## Getting Started

### Quick Setup (Recommended)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the setup script** (starts Supabase, applies migrations, seeds database):
   ```bash
   npm run setup
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3001`

### Manual Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Supabase**:
   ```bash
   npm run db:start
   ```

3. **Apply database migrations**:
   ```bash
   npm run db:push
   ```

4. **Seed the database**:
   ```bash
   npm run script seed
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

### Database Management

- **Start Supabase**: `npm run db:start`
- **Stop Supabase**: `npm run db:stop`
- **Database Studio**: `npm run db:studio` (opens http://localhost:54323)
- **Generate migrations**: `npm run db:generate`
- **Apply migrations**: `npm run db:push`
- **Reset database**: `npm run db:reset`
- **Seed database**: `npm run script seed`

## Demo Accounts

### Client Account
- **Email**: `sarah.johnson@techcorp.com`
- **Role**: Client
- **Access**: Client dashboard, service requests, service tracking

### Admin Account
- **Email**: `david.morrison@missionlaw.com`
- **Role**: Admin
- **Access**: All services management, client management, status updates

## Project Structure

```
/app
  /(public)
    page.tsx                    # Landing page
    /login
      page.tsx                  # Login form
  /client
    layout.tsx                  # Client navigation layout
    /overview
      page.tsx                  # Client dashboard
    /services
      page.tsx                  # Client services list
      /new/[serviceType]
        page.tsx                # Service request form
      /[serviceId]
        page.tsx                # Service detail view
  /admin
    layout.tsx                  # Admin navigation layout
    /services
      page.tsx                  # Admin services list
      /[serviceId]
        page.tsx                # Admin service detail
    /clients
      page.tsx                  # Client management
  /api
    /services
      route.ts                  # Services CRUD
      /[id]
        route.ts                # Individual service operations
    /client
      route.ts                  # Client data
```

## Key Components

### Authentication
- `AuthGuard`: Protects routes based on user role
- `AuthService`: Manages authentication state
- Role-based navigation and access control

### UI Components
- `Button`: Reusable button with variants
- `StatusBadge`: Service status indicators
- `Navigation`: Responsive navigation bar
- `LoadingSpinner`: Loading state component

### Service Management
- Dynamic form generation based on service type
- Progress tracking with visual status steps
- File upload handling (mocked)
- Attorney assignment and notes

## Service Types

1. **NDA (Non-Disclosure Agreement)**
   - Counterparty information
   - Purpose and duration
   - Mutual/unilateral options

2. **Employee Onboarding**
   - Employee details
   - Position and compensation
   - Start date and equity options

3. **Contract Review**
   - Contract information
   - Review priority and deadlines
   - Key concerns and focus areas
   - Document upload

## Database Schema

The application uses PostgreSQL with Drizzle ORM for type-safe database operations.

### Core Tables

- **clients**: Client company information and contact details
- **attorneys**: Legal team members with specialties
- **users**: Application users (clients and admins) with role-based access
- **services**: Legal service requests with status tracking and form data
- **documents**: File attachments and document management

### Key Features

- **Type Safety**: Full TypeScript integration with Drizzle ORM
- **Migrations**: Version-controlled schema changes
- **Relations**: Proper foreign key relationships and joins
- **Enums**: Type-safe status and role definitions
- **JSON Fields**: Flexible form data storage

## API Endpoints

### Services
- `GET /api/services` - List services (with filtering by client, status, type, search)
- `POST /api/services` - Create new service request
- `GET /api/services/[id]` - Get service details with client and attorney info
- `PATCH /api/services/[id]` - Update service status, assignment, notes

### Clients
- `GET /api/client` - List all clients
- `GET /api/client?id=[clientId]` - Get specific client details

### Attorneys
- `GET /api/attorneys` - List all attorneys for assignment

## Development Patterns

### Form Handling
```typescript
// Dynamic form fields based on service type
const template = SERVICE_TEMPLATES.find(t => t.type === serviceType)
const formData = generateFormData(template.fields)
```

### Data Fetching
```typescript
// SWR for caching and real-time updates
const { data, error, mutate } = useSWR(`/api/services/${id}`, fetcher)
```

### Status Management
```typescript
// Status progression with visual indicators
const statusSteps = getStatusSteps(currentStatus)
```

## Mock Data

The application includes realistic sample data:
- 3 client companies with different profiles
- 5+ sample services across all types and statuses
- Attorney profiles with specialties
- Form templates for each service type

## Building for Production

```bash
npm run build
npm start
```

## Future Enhancements

- Real database integration (PostgreSQL, MongoDB)
- Email notifications and templates
- Document generation and e-signature
- Calendar integration for appointments
- Payment processing
- Advanced reporting and analytics
- Multi-tenant architecture

---

This application demonstrates modern full-stack development patterns and serves as an excellent canvas for technical discussions about architecture, scaling, and feature development in the legal services domain.