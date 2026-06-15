## Overview
This monorepo manages a loan tracking system with a Node.js/Express backend and a React frontend. It tracks borrowers, loans, and payments, and exposes REST APIs for frontend consumption.

## Architecture
- **Backend (`Backend/`)**: Node.js (ESM), Express, MongoDB (via Mongoose)
  - `src/models/`: Mongoose schemas for `Borrower`, `Loan`, `Payment`, and `User`.
  - `src/controllers/`: Business logic for authentication, borrowers, loans, and payments.
  - `src/routes/`: API route definitions, grouped by resource.
  - `src/middlewares/`: Auth, validation, and async error handling utilities.
  - `src/utils/`: Shared helpers (e.g., asyncHandle.js).
  - `src/DB/`: Database connection logic.
  - **Entry point**: `src/index.js` (loads env, connects DB, starts server)
- **Frontend (`frontend/`)**: React (Create React App)
  - `src/components/`: UI components for forms and lists.
  - `src/pages/`: Page-level containers (e.g., Dashboard).
  - `src/services/api.js`: Handles API requests to backend.

## Key Workflows
- **Backend**
  - Start: `npm start` (uses nodemon, loads `.env`)
  - Main server: `src/index.js` → `src/app.js`
  - MongoDB connection: `src/DB/index.js`
  - API endpoints: `/api/auth`, `/api/borrowers`, `/api/loans`, `/api/payments`, `/api/stats`
  - Environment variables: `.env` (see `dotenv` usage)
- **Frontend**
  - Start: `npm start`
  - Build: `npm run build`
  - Test: `npm test`

## Project Conventions
- **ESM syntax**: All backend code uses ES modules (`import/export`).
- **Error handling**: Use `asyncHandle.js` for wrapping async route handlers (see commented usage in controllers).
- **API responses**: Consistent JSON structure with `success` and `message` fields.
- **Model relationships**: Loans reference Borrowers; Payments reference Loans.
- **.env required**: Backend expects environment variables for DB and CORS.

## Integration Points
- **Frontend ↔ Backend**: Communicating via REST API endpoints (see `frontend/src/services/api.js`).
- **MongoDB**: All persistent data via Mongoose models.

## Examples
- Add a payment: `POST /api/payments/:loanId`
- Fetch borrowers: `GET /api/borrowers`

## References
- [DB Structure Diagram](https://dbdiagram.io/d/688e0d4ecca18e685cefe1eb)
- [Model Link](https://app.eraser.io/workspace/NhjAdZjnNcX0dJGYKf3J)


## Valar Morghulis
---
