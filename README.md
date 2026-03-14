# Saturday Hackathon – Full-Stack App

A full-stack application with **React (Vite)** frontend and **Node.js (Express)** backend, using **MongoDB** for data. It includes authentication (register, login, refresh, logout) and full CRUD for **Users**, **Roles**, and **Brands**.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Run locally](#run-locally)
- [How to check the project is running](#how-to-check-the-project-is-running)
- [Run with Docker](#run-with-docker)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)

---

## Tech stack

| Layer    | Technologies |
|----------|--------------|
| Frontend | React 19, Vite 8, TypeScript, Tailwind CSS 4, Redux Toolkit, React Router, Axios, Zod, React Hook Form, React Hot Toast |
| Backend  | Node.js, Express 5, TypeScript, Mongoose, MongoDB, Zod, JWT (access + refresh), bcrypt |
| Database | MongoDB |

---

## Features

### Authentication
- **Register** – Create account (firstname, lastname, email, password, role).
- **Login** – Email + password; returns access token and refresh token.
- **Refresh token** – Get new access token.
- **Logout** – Invalidate session; text-only “Logout” in header (no icon).

### Users
- List users with **pagination**, **search by name**, and **filter by status** (active/inactive).
- **Create**, **View**, **Edit**, **Delete** user (with confirmation dialog).
- Table with skeleton loading; View / Edit / Delete as **icon buttons**; filters below table header.
- Backend success/error **messages shown in toasts**.

### Roles
- List roles with pagination, search by name, filter by status.
- Create, View, Edit, Delete role (with confirmation dialog).
- Same table UX as Users; backend messages in toasts.

### Brands
- List brands with pagination, search by name, filter by status.
- Create, View, Edit, Delete brand (with confirmation dialog).
- Optional description field; same table UX and toasts.

### UI / UX
- **Theme toggle** (light/dark) – class-based dark mode; preference saved in `localStorage`.
- **Error boundary** – Catches runtime errors and shows a fallback UI.
- **404 page** – For unknown routes, with link back to Login.
- **Protected routes** – Dashboard, User, Role, Brand require login; redirect to `/login` if not authenticated.
- **Drawer** – Create/Edit/View in a side drawer; close via button or click outside; state cleared on close.
- **Delete confirmation** – Custom dialog (no `window.confirm`) with Cancel and Delete.
- **Responsive layout** – Sidebar, header (breadcrumb, theme, user name, Logout), main content.

---

## Prerequisites

- **Node.js** 18+ (for local run)
- **MongoDB** (local instance or MongoDB Atlas connection URI)
- **Docker & Docker Compose** (optional; only for Docker run)

---

## Run locally

### 1. Backend

```bash
cd backend
```

Create a `.env` file (see [Environment variables](#environment-variables)):

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/saturday
JWT_SECRET=your-access-token-secret
JWT_REFRESH_SECRET=your-refresh-token-secret
```

Install and run:

```bash
npm install
npm run dev
```

Backend runs at **http://localhost:4000**.

**Seed the database** (in another terminal):

```bash
cd backend
npm run seed
```

This creates an admin user: **admin@gmail.com** / **password123** (and optionally more roles/brands/users by env or CLI).

### 2. Frontend

```bash
cd frontend
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:4000
```

Install and run:

```bash
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**.

---

## How to check the project is running

1. **Backend**
   - Open **http://localhost:4000/health**  
   - You should see: `{ "status": "ok", "timestamp": "..." }`.

2. **Frontend**
   - Open **http://localhost:5173**  
   - You should be redirected to **http://localhost:5173/login**.

3. **Login**
   - Use **admin@gmail.com** / **password123** (after running the seed).
   - Click **Login** → you should land on the **Dashboard**.

4. **Navigation**
   - Use the sidebar: **Dashboard**, **Users**, **Roles**, **Brands**.
   - Each list page has search, status filter, and a **Create** button.

5. **CRUD**
   - **Create** – Click “Create User” (or Role/Brand), fill the form in the drawer, submit → success toast with backend message.
   - **View** – Click the eye icon on a row → drawer opens in read-only mode.
   - **Edit** – Click the pencil icon → edit in drawer → success toast with backend message.
   - **Delete** – Click the trash icon → confirmation dialog → Delete → success toast with backend message.

6. **Theme**
   - Click the sun/moon icon in the header → UI switches between light and dark; preference persists after refresh.

7. **404**
   - Go to **http://localhost:5173/any-unknown-path** → 404 page with “Go to Login”.

8. **Logout**
   - Click **Logout** (text only, no icon) in the header → you are redirected to Login.

---

## Run with Docker

Single command runs **MongoDB**, **backend**, and **frontend** (with hot reload).

### Prerequisites

- Docker and Docker Compose installed.

### Start everything

From the **project root** (folder containing `docker-compose.yml`):

```bash
docker compose up --build
```

- **Frontend:** http://localhost:5173  
- **Backend API:** http://localhost:4000  
- **MongoDB:** local on port 27017 (data in volume `mongo_data`).

### Seed the database (Docker)

After the stack is up:

```bash
docker compose exec backend npm run seed
```

Then log in with **admin@gmail.com** / **password123** and follow [How to check the project is running](#how-to-check-the-project-is-running).

### Use your own MongoDB (e.g. Atlas)

Create a `.env` file in the **project root** (or set variables in your environment):

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/yourdb
JWT_SECRET=your-secret
JWT_REFRESH_SECRET=your-refresh-secret
```

Then run:

```bash
docker compose up --build
```

Compose will pass these into the backend service.

### Stop Docker

```bash
docker compose down
```

To also remove the MongoDB data volume:

```bash
docker compose down -v
```

---

## Environment variables

### Backend (`backend/.env`)

| Variable           | Description                          | Example / default                    |
|--------------------|--------------------------------------|-------------------------------------|
| `PORT`             | Server port                          | `4000`                              |
| `MONGODB_URI`      | MongoDB connection string            | `mongodb://localhost:27017/saturday` |
| `JWT_SECRET`       | Secret for access tokens             | (required in production)             |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens          | (required in production)             |

### Frontend (`frontend/.env`)

| Variable             | Description              | Example              |
|----------------------|--------------------------|----------------------|
| `VITE_API_BASE_URL`  | Backend API base URL     | `http://localhost:4000` |

---

## Project structure

```
Saturday-Hacathon-14-03/
├── backend/
│   ├── src/
│   │   ├── controller/   # Request handlers (auth, user, role, brand)
│   │   ├── route/        # API routes
│   │   ├── models/       # Mongoose models (User, Role, Brand)
│   │   ├── schema/       # Zod validation schemas
│   │   ├── types/        # TypeScript types
│   │   ├── constants/    # Messages, status, config
│   │   ├── middleware/   # Auth (JWT)
│   │   ├── utils/        # DB, tokens, response helpers
│   │   ├── seed/         # Seeder script
│   │   └── server.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # UI, layout, table, drawer, forms, toast
│   │   ├── context/      # Auth, Theme
│   │   ├── hooks/        # e.g. useDebounce
│   │   ├── lib/          # Axios instance, API endpoints
│   │   ├── pages/        # Login, Register, Dashboard, User, Role, Brand, NotFound
│   │   ├── redux/        # Store, slices (auth, user, role, brand)
│   │   ├── routes/       # Router, ProtectedRoute, paths
│   │   ├── schema/       # Zod schemas (forms)
│   │   └── types/        # API types
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml   # mongo + backend + frontend
├── README.md            # This file
└── DOCKER.md            # Docker-only notes
```

### API base path

All API routes are under **`/api`**:

- `POST /api/register` – Register
- `POST /api/login` – Login
- `POST /api/logout` – Logout
- `POST /api/refresh` – Refresh token
- `GET/POST/PATCH/DELETE /api/users` – User CRUD (list with pagination, filters)
- `GET/POST/PATCH/DELETE /api/roles` – Role CRUD
- `GET/POST/PATCH/DELETE /api/brands` – Brand CRUD

Responses use the shape: `{ success, message, data }` (and `pagination` for list endpoints). Backend messages are shown in the frontend toasts for create/update/delete.

---

## Quick reference

| Task              | Local (backend)     | Local (frontend)   | Docker              |
|-------------------|---------------------|--------------------|---------------------|
| Install           | `cd backend && npm install` | `cd frontend && npm install` | —                   |
| Run               | `npm run dev`       | `npm run dev`      | `docker compose up --build` |
| Seed DB           | `npm run seed`      | —                  | `docker compose exec backend npm run seed` |
| Backend URL       | http://localhost:4000 | —                | http://localhost:4000 |
| Frontend URL      | —                   | http://localhost:5173 | http://localhost:5173 |
| Default login     | —                   | admin@gmail.com / password123 | Same (after seed) |
