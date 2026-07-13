# Loan Management System

A full-stack application for tracking borrowers, loans, and repayments. Built with a Node.js/Express/MongoDB backend and a React (Vite) frontend, it lets an admin manage borrowers and loans, log EMI payments, monitor overdue accounts, and view repayment summaries on a dashboard.

[Website link](https://loan-management-three-livid.vercel.app/borrowers/6a2fb0b0f92264639ebf9f85)

### Demo Credentials:
username: DemoUser <br>
pass: DemoPassword

## Screenshots

<!-- Add screenshots of the live site here -->
<!-- ![Dashboard](path/to/screenshot.png) -->
#### Dashboard
![Dashboard](/Frontend/public/Dashboard.png)

#### Borrowers Page
![Borrowers Page](/Frontend/public/Borrower-page.png)

#### Adding New Borrower
![Add-Borrower](/Frontend/public/Add-Borrower.png)

#### Separate list for Defaulters
![Defaulter-List](/Frontend/public/Defaulter-List.png)

#### Adding new Loan
![Add-Loan](/Frontend/public/Add-Loan.png)

#### Adding a Payment
![Add-Payment](/Frontend/public/Add-Payment.png)

#### Payment History
![Payment-History](/Frontend/public/Payment-History.png)


## Features

- **Authentication** — JWT-based login with access/refresh tokens (httpOnly cookies) and role-based access (`admin` / `viewer`)
- **Borrower management** — create, update, view, and soft-delete borrowers; track status (`active`, `defaulter`, `cleared`)
- **Loan management** — issue loans with principal, interest, EMI, and witness details; update loan status; extend loan duration
- **Payment tracking** — log EMI payments (cash/UPI), view payment history per loan, and get loan repayment summaries
- **Defaulter detection** — a daily cron job automatically flags borrowers who missed the previous month's payment and reverts them once they catch up
- **Dashboard & stats** — aggregate stats endpoint for an at-a-glance overview
- **Overdue tracking** — dedicated endpoint/page to list defaulting borrowers

## Tech Stack

**Backend**
- Node.js (ESM) + Express 5
- MongoDB with Mongoose (`mongoose-aggregate-paginate-v2` for pagination)
- JWT authentication (`jsonwebtoken`), password hashing (`bcrypt`)
- `express-validator` for request validation
- `node-cron` for the scheduled defaulter check

**Frontend**
- React 19 + Vite
- React Router v7
- Zustand for state management
- Axios for API calls
- Tailwind CSS
- React Hot Toast for notifications

## Project Structure

```
loan_management/
├── Backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers (auth, borrower, loan, payment, stats)
│   │   ├── routes/          # Express route definitions
│   │   ├── models/          # Mongoose schemas (User, Borrower, Loan, Payment)
│   │   ├── middlewares/     # Auth guard, role guard, validators
│   │   ├── jobs/            # Scheduled defaulter-check cron job
│   │   ├── utils/           # asyncHandle, paginate helpers
│   │   ├── scripts/         # createUser.js — one-off script to seed a user
│   │   ├── DB/               # MongoDB connection
│   │   ├── app.js           # Express app setup
│   │   └── index.js         # Entry point
│   └── .env.sample
└── Frontend/
    ├── src/
    │   ├── pages/            # Login, Dashboard, Borrowers, BorrowerProfile, AddBorrower, AddLoan, AddPayment, Defaulters, NotFound
    │   ├── components/       # Navbar, Loader, ProtectedRoute, StatCard, PaymentHistoryGrid
    │   ├── store/             # Zustand stores (auth, borrower)
    │   └── api/               # Axios instance
    └── .env.sample
```

## API Overview

All routes are prefixed with `/api`. Protected routes require a valid access token (sent as an httpOnly cookie); admin-only routes additionally require the `admin` role.

### Auth (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/login` | Log in and receive access/refresh tokens | Public |
| POST | `/refresh` | Refresh the access token | Public |
| POST | `/logout` | Log out and clear tokens | Authenticated |
| GET | `/me` | Get current user profile | Authenticated |
| PATCH | `/me` | Update current user profile | Authenticated |

### Borrowers (`/api/borrowers`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List all borrowers |
| POST | `/create` | Create a borrower |
| GET | `/status/overdue` | List overdue/defaulting borrowers |
| GET | `/:id` | Get a borrower by ID |
| PATCH | `/:id` | Update a borrower |
| PATCH | `/:id/status` | Update a borrower's status |
| DELETE | `/:id` | Delete a borrower |

### Loans (`/api/loans`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/:borrowerId` | Create a loan for a borrower |
| GET | `/:borrowerId` | List loans for a borrower |
| PATCH | `/:loanId/witness` | Update loan witness details |
| PATCH | `/:loanId/status` | Update loan status |
| PATCH | `/:loanId/extend` | Extend a loan's duration |
| DELETE | `/:loanId` | Delete a loan |

### Payments (`/api/payments`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/:loanId` | Add a payment for a loan |
| GET | `/:loanId` | Get payment history for a loan |
| GET | `/:loanId/summary` | Get repayment summary for a loan |
| DELETE | `/:paymentId/delete` | Delete a payment |

### Stats (`/api/stats`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get aggregate dashboard stats |

## Data Models

- **User** — `userName`, `fullName`, `password` (hashed), `role` (`admin`/`viewer`), `refreshToken`
- **Borrower** — `name`, `phone`, `address`, `fatherName`, `loans[]`, `status` (`active`/`defaulter`/`cleared`)
- **Loan** — `borrowerId`, `principalAmount`, `interestRate`, `totalAmount`, `emiAmount`, `durationMonths`, `startDate`, `status` (`active`/`completed`/`defaulter`), `witness`, `payments[]`
- **Payment** — `loanId`, `amount`, `paidDate`, `monthFor`, `method` (`cash`/`upi`), `note`, `autoGenerated`

Diagrams: [DB Structure](https://dbdiagram.io/d/688e0d4ecca18e685cefe1eb) · [Model Overview](https://app.eraser.io/workspace/NhjAdZjnNcX0dJGYKf3J)

## Background Jobs

A cron job (`Backend/src/jobs/defaulterCheck.js`) runs daily at midnight:
- Flags borrowers whose loans have no logged payment for the previous month as `defaulter`
- Reverts borrowers back to `active` once a payment for the missed month is recorded

## Valar Morghulis