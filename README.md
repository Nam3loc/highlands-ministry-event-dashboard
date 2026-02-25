# Ministry Events API & Dashboard

A full-stack web application for managing and displaying ministry events. Built with **Next.js, PostgreSQL, Drizzle ORM, NextAuth, and TailwindCSS**, this project provides a REST API, internal admin dashboard, and public events view.

This project was developed as part of a take-home assessment to demonstrate full-stack architecture, API design, database modeling, testing, and UI implementation.

---

## Demo Video

*(Add Loom or YouTube link here)*

This video demonstrates:

- Public events dashboard
- Admin dashboard functionality
- Creating, editing, publishing, and deleting events
- API endpoint functionality
- Database schema overview
- Code walkthrough

---

## Features

### Public Dashboard

- Displays published events
- Pagination support
- Clean, responsive mobile-friendly UI

Accessible at:  
[http://localhost:3000](http://localhost:3000)

---

### Admin Dashboard

- View all events (published and unpublished)
- Create new events
- Edit existing events
- Publish/unpublish events
- Delete events
- Mobile-friendly responsive layout

Accessible at:  
[http://localhost:3000/admin](http://localhost:3000/admin)

---

### REST API

Fully RESTful API with validation and error handling.

| Method | Endpoint | Description |
|------|---------|-------------|
| GET | `/api/events` | Get all events |
| GET | `/api/events/:id` | Get event by ID |
| POST | `/api/admin/new` | Create event |
| PUT | `/api/admin/:id` | Update event |
| DELETE | `/api/admin/:id/delete` | Delete event |

Supports filtering:

```
/api/events?campus=Main&category=Worship&published=true
```

---

### Authentication

Uses NextAuth Credentials Provider for admin login.

Admin credentials are defined in environment variables.

---

## Running Tests

Run the Jest test suite:

```bash
npm test
```

---

## Tech Stack

### Frontend
- Next.js (App Router)
- React
- TailwindCSS

### Backend
- Next.js API Routes
- PostgreSQL
- Drizzle ORM

### Authentication
- NextAuth

### Validation
- Zod

### Testing
- Jest

---

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/ministry-events-dashboard.git
cd ministry-events-dashboard
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env.local` file in the project root directory:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/ministry_events

ADMIN_USERNAME=admin
ADMIN_PASSWORD=password123

NEXTAUTH_SECRET=super-secret-key
NEXTAUTH_URL=http://localhost:3000
```

---

### 4. Setup PostgreSQL Database

Make sure PostgreSQL is installed and running.

#### Create Database

```sql
CREATE DATABASE ministry_events;
```

---

#### Run Migrations

```bash
npm run db:generate
npm run db:migrate
```

---

#### Optional: Seed Database

```bash
npm run db:seed
```

---

### 5. Run Development Server

```bash
npm run dev
```

---

### Open in Browser

Public dashboard:  
[http://localhost:3000](http://localhost:3000)

Admin dashboard:  
[http://localhost:3000/admin](http://localhost:3000/admin)

---

### Admin Login

Use credentials from `.env.local`:

```
Username: admin
Password: password123
```

---

### Run Tests

```bash
npm test
```

---

## Project Structure

```
src/

├── app/
│   ├── admin/                # Admin dashboard pages
│   ├── api/                  # REST API routes
│   ├── components/           # Shared components
│   └── page.tsx              # Public dashboard

├── db/
│   ├── schema.ts             # Drizzle schema
│   └── index.ts              # Database connection

├── lib/
│   ├── data/                 # Data access layer
│   ├── validators/           # Zod validation schemas
│   └── auth/                 # Authentication logic

└── __tests__/                # Jest test suite
```

---

## API Example

### Create Event

**Endpoint**

```http
POST /api/events
```

**Request Body**

```json
{
  "title": "Sunday Worship",
  "description": "Weekly service",
  "campus": "Main Campus",
  "category": "Worship",
  "startDateTime": "2030-01-01T18:00:00Z",
  "endDateTime": "2030-01-01T19:00:00Z",
  "cost": 0,
  "isPublished": true
}
```

---

## Postman Collection

Import:

```
postman/MinistryEvents.postman_collection.json
```

Or via link:

```
https://your-postman-link-here
```

---

## Database Schema

### Table: events

| Column | Description |
|--------|-------------|
| id | UUID, primary key |
| title | Event title |
| description | Event description |
| campus | Campus name |
| category | Event category |
| startDateTime | Event start date/time |
| endDateTime | Event end date/time |
| cost | Event cost |
| isPublished | Publish status |
| createdAt | Record creation timestamp |
| updatedAt | Record last update timestamp |

---

## Architecture Overview

```
Client (Next.js Frontend)
        │
        ▼
Next.js API Routes
        │
        ▼
Data Layer (Drizzle ORM)
        │
        ▼
PostgreSQL Database
```

---

## Production Build

```bash
npm run build
npm run start
```

---

## Deployment

Recommended platform: **Vercel**

Steps:

1. Push project to GitHub  
2. Connect repository to Vercel  
3. Configure environment variables  
4. Deploy  

---

## Future Improvements

- Weather API integration
- Automated Postman test runs
- Role-based permissions
- Event image uploads
- Filtering by campus and category

---

## Author

Coleman Escue

GitHub:  
https://github.com/yourusername