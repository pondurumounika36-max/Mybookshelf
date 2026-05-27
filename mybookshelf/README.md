# 📚 MyBookShelf

A personal book library tracker. Add books, mark them as **Want to Read**, **Reading**, or **Completed**, give them a star rating, and filter your shelf by status.

Built as a full-stack learning project: a Node/Express/Prisma backend and a React/Vite frontend talking through a JSON API.

## Tech Stack

**Backend** (`server/`)
- Node.js + Express
- Prisma ORM with PostgreSQL
- Zod for request validation

**Frontend** (`client/`)
- React 18 + Vite
- TanStack React Query for server-state caching
- Axios for HTTP

## Prerequisites

You need these installed before starting:

- [Node.js](https://nodejs.org/) 18 or newer
- [PostgreSQL](https://www.postgresql.org/download/) 14 or newer, running locally
- npm (comes with Node)

Make sure your local Postgres is running and you have a user that can create databases.

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/mybookshelf.git
cd mybookshelf
```

### 2. Configure the backend

```bash
cd server
npm install
cp .env.example .env
```

Open `server/.env` and replace `YOUR_PASSWORD_HERE` with your real Postgres password. Adjust `DATABASE_URL` if your Postgres user, host, or port is different.

### 3. Create the database

In `psql` or any Postgres client, create the database:

```sql
CREATE DATABASE mybookshelf;
```

Then run the Prisma migrations to create the `books` table:

```bash
npm run prisma:migrate
```

### 4. Install the frontend

```bash
cd ../client
npm install
```

## Running the app

You need **two terminals open** — one for the backend, one for the frontend.

**Terminal 1 — backend:**
```bash
cd server
npm run dev
```
Server runs at `http://localhost:4000`.

**Terminal 2 — frontend:**
```bash
cd client
npm run dev
```
Frontend runs at `http://localhost:5173` (Vite default). The Vite dev server proxies `/api/*` requests to the backend automatically — see `client/vite.config.js`.

Open `http://localhost:5173` in your browser.

## Available scripts

### `server/`
- `npm run dev` — start with nodemon (auto-restart on file changes)
- `npm start` — start without nodemon
- `npm run prisma:migrate` — apply pending DB migrations
- `npm run prisma:studio` — open Prisma Studio (visual DB editor) at `http://localhost:5555`

### `client/`
- `npm run dev` — start the Vite dev server
- `npm run build` — production build into `dist/`
- `npm run preview` — preview the production build locally

## Project structure

```
mybookshelf/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── api/             # Axios wrappers for the backend API
│       ├── components/      # React components (BookList, BookForm, StatsCard, ...)
│       └── schemas.js       # Frontend copy of Zod validation schemas
└── server/                  # Express + Prisma backend
    ├── prisma/
    │   ├── schema.prisma    # Database schema
    │   └── migrations/      # Migration history
    ├── routes/
    │   └── books.js         # /api/books endpoints
    ├── schemas.js           # Backend Zod validation schemas
    ├── db.js                # Shared Prisma client
    └── index.js             # Express app entry point
```

## API endpoints

| Method | Path             | Description                                  |
| ------ | ---------------- | -------------------------------------------- |
| GET    | `/api/books`     | List books. Optional `?status=` filter.      |
| POST   | `/api/books`     | Create a book.                               |
| PATCH  | `/api/books/:id` | Update a book (partial).                     |
| DELETE | `/api/books/:id` | Delete a book.                               |
| GET    | `/health`        | Health check.                                |

Valid `status` values: `want-to-read`, `reading`, `read`.

## Security notes

- `.env` files are gitignored. **Never commit a real `.env`.** Use `.env.example` as the template.
- The backend validates every request with Zod before touching the database.
- The status filter is whitelisted against `ALLOWED_STATUSES` — unknown values are ignored, not passed through to Prisma.

## License

MIT (or whatever you choose).
