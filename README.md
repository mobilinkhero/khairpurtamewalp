# Khairpur Tamewali — Web (Next.js)

Single Next.js project containing:
- **Public website** — user-facing city guide
- **Admin panel** — content management at `/admin`
- **REST API** — used by the Flutter mobile app

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Database | MySQL + Prisma ORM |
| Auth | JWT via `jose` (HTTP-only cookie) |
| Styling | Tailwind CSS |
| State | TanStack Query (React Query) |
| Language | TypeScript |

---

## Getting Started

### 1. Install dependencies
```bash
cd web
npm install
```

### 2. Set up environment
```bash
cp .env.example .env.local
# Edit .env.local with your MySQL credentials and JWT secret
```

### 3. Set up MySQL database
Create a MySQL database:
```sql
CREATE DATABASE khairpur_tamewali;
```

### 4. Run Prisma migrations
```bash
npm run db:push       # Push schema to database
npm run db:seed       # Seed with sample data
```

### 5. Start development server
```bash
npm run dev
```

App runs at **http://localhost:3000**

---

## URLs

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Public website |
| `http://localhost:3000/admin` | Admin panel |
| `http://localhost:3000/admin/login` | Admin login |
| `http://localhost:3000/api/businesses` | Businesses API |
| `http://localhost:3000/api/places` | Places API |
| `http://localhost:3000/api/news` | News API |
| `http://localhost:3000/api/events` | Events API |
| `http://localhost:3000/api/emergency` | Emergency API |

---

## Default Admin Credentials
```
Email:    admin@khairpurtamewali.com
Password: admin123
```
**Change these after first login.**

---

## API Reference (for Flutter app)

All APIs return:
```json
{ "success": true, "message": "...", "data": { ... } }
```

### Businesses
- `GET /api/businesses` — list (supports `?search=`, `?category=`, `?featured=true`, `?page=`, `?limit=`)
- `GET /api/businesses/:id` — single business
- `POST /api/businesses` — create (admin auth required)
- `PUT /api/businesses/:id` — update (admin auth required)
- `DELETE /api/businesses/:id` — soft delete (admin auth required)

### Places
- `GET /api/places` — list (supports `?category=`, `?search=`)
- `GET /api/places/:id` — single place
- `POST /api/places` — create (admin)
- `PUT /api/places/:id` — update (admin)
- `DELETE /api/places/:id` — delete (admin)

### News
- `GET /api/news` — published articles only
- `GET /api/news/:id` — single article
- `POST /api/news` — create (admin)
- `PUT /api/news/:id` — update (admin)
- `DELETE /api/news/:id` — delete (admin)

### Events
- `GET /api/events` — published events (`?upcoming=true` for future only)
- `GET /api/events/:id` — single event
- `POST /api/events` — create (admin)
- `PUT /api/events/:id` — update (admin)
- `DELETE /api/events/:id` — delete (admin)

### Emergency
- `GET /api/emergency` — all active contacts

### Auth (Admin)
- `POST /api/auth/login` — `{ email, password }` → sets `admin_token` cookie
- `POST /api/auth/logout` — clears cookie

---

## Production Build
```bash
npm run build
npm start
```
