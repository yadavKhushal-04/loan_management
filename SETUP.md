# Setup Guide

Instructions to run the Loan Management System locally.

## Prerequisites

- Node.js (v18+ recommended)
- A MongoDB instance (local or Atlas)

## 1. Clone the repo

```bash
git clone <repo-url>
cd loan_management
```

## 2. Backend setup

```bash
cd Backend
npm install
cp .env.sample .env   # then fill in the values below
npm start
```

**Backend environment variables** (`Backend/.env`):

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on |
| `CORS_ORIGIN` | Allowed origin for CORS (your frontend URL) |
| `MONGODB_URL` | MongoDB connection string |
| `ACCESS_TOKEN_SECRET` | Secret used to sign JWT access tokens |
| `ACCESS_TOKEN_EXPIRY` | Access token expiry (e.g. `1d`) |
| `REFRESH_TOKEN_SECRET` | Secret used to sign JWT refresh tokens |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiry (e.g. `10d`) |

The server starts at `http://localhost:<PORT>` and connects to MongoDB before booting the cron job for defaulter checks.

## 3. Create your first user

There's no public registration endpoint — users are created via a script:

1. Open `Backend/src/scripts/createUser.js`
2. Edit the `userName`, `fullName`, `password`, and `role` (`admin` or `viewer`) fields
3. Run it:

```bash
node src/scripts/createUser.js
```

## 4. Frontend setup

```bash
cd Frontend
npm install
cp .env.sample .env   # set VITE_API_URL to your backend URL
npm run dev
```

**Frontend environment variables** (`Frontend/.env`):

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API (e.g. `http://localhost:3000/api`) |

## 5. You're set

- Backend runs at `http://localhost:<PORT>`
- Frontend runs at the Vite dev server URL (typically `http://localhost:5173`)
- Log in with the user you created in step 3
