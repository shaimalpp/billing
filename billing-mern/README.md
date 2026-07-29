# EP Services — Electrical & Plumbing Billing Software (MERN Stack)

Full-stack rebuild of the 13-screen billing software design (Dashboard, Profit &
Recent Jobs, Customers, Quotation, Employee Assignment, Work Entry, Expenses,
Invoice, Profit Analysis, Salary Summary, Reports, Settings) using
**MongoDB, Express, React (Vite) and Node.js**.

## Project Structure

```
billing-mern/
  backend/     -> Express + MongoDB REST API
  frontend/    -> React (Vite) single-page app
```

## Prerequisites

- Node.js 18+ and npm
- MongoDB running locally (or a MongoDB Atlas connection string)

## 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env      # edit MONGO_URI if needed
npm run dev                # starts on http://localhost:5000
```

The API is namespaced under `/api`:
`/api/customers`, `/api/employees`, `/api/jobs`, `/api/quotations`,
`/api/workentries`, `/api/expenses`, `/api/invoices`, `/api/settings`,
`/api/dashboard`, `/api/reports/*`.

## 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev                # starts on http://localhost:5173
```

The Vite dev server proxies `/api/*` requests to `http://localhost:5000`
(see `vite.config.js`), so just run both servers side by side.

## 3. Using the App

1. Go to **Settings** and set your company name/tagline.
2. Add a few **Customers**.
3. Add **Employees**.
4. Create a **Quotation** for a customer (material/labour/other charges).
5. Create a **Job**, then use **Employee Assignment** to assign staff and
   work rates (jobs are created via the API — you can add a small "New Job"
   form the same way Customers works, or POST to `/api/jobs` directly for now).
6. Log daily **Work Entry** (hours + overtime) for employees.
7. Record **Expenses** (fuel, food, travel, material, other).
8. Generate an **Invoice** for a customer/job — profit is auto-calculated
   (bill amount − cost).
9. View **Profit Analysis** (6-month income/expense/profit trend),
   **Salary Summary** (per-employee hours & pay), and **Reports**.

## Notes

- All monetary values are in ₹ (INR) formatting, matching the original design.
- The sidebar, cards, and tables follow the dark-navy + colorful-accent design
  from the source presentation.
- Recharts is used for the pie chart (dashboard expense summary) and line
  chart (profit analysis).
- This is a working starting point — validation, authentication, and
  file/photo uploads (as seen in the original screenshots) can be added next
  (e.g. `multer` for photo uploads, `jsonwebtoken` for login).
