$ powershell -NoProfile -Command "$content = @'# Expense Tracker

A full-stack expense tracker built with React (Vite) on the frontend and Express + MongoDB (Mongoose) on the backend.

## Features
- Add/delete expenses with title, amount, category, date
- Local storage persistence + REST API integration
- Analytics tab: totals, category breakdown, monthly trend
- Filters: search, category, sort, order
- Responsive UI with modern styling and icons

## Tech Stack
- Frontend: React + Vite, axios, lucide-react
- Backend: Node.js, Express, Mongoose, dotenv, cors, nodemon
- Database: MongoDB (local or Atlas)

## Project Structure
```
Expense tracker/
├─ backend/
│  ├─ src/
│  │  ├─ db.js               # Mongo connection helper
│  │  ├─ server.js           # Express app & routes wiring
│  │  ├─ models/Expense.js   # Expense schema/model
│  │  └─ routes/expenses.js  # CRUD + stats routes
│  ├─ package.json
│  └─ .env                   # PORT, MONGODB_URI
├─ frontend/
│  ├─ src/
│  │  ├─ App.jsx, App.css    # UI + logic
│  │  ├─ components/
│  │  │  ├─ Analytics.jsx
│  │  │  └─ Filter.jsx
│  │  └─ main.jsx
│  ├─ index.html, vite.config.js
│  └─ package.json
└─ .gitignore, README.md
```

## Prerequisites
- Node.js 20.19+ (recommended LTS 22.12+)
- npm 10+
- MongoDB running locally (or provide Atlas connection string)

## Backend Setup
1. Configure environment variables in `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/expense_tracker
```
2. Install & run:
```
cd backend
npm install
npm run dev
```
3. Health check & API info:
- Health: `http://localhost:5000/health`
- Info:   `http://localhost:5000/api`

### API Endpoints
- GET    `/api/expenses`                 — list (query: category, startDate, endDate, page, limit)
- GET    `/api/expenses/stats`           — totals, category breakdown, monthly trend
- POST   `/api/expenses`                 — create `{ title, amount, category, date, description?, tags? }`
- GET    `/api/expenses/:id`             — get one
- PUT    `/api/expenses/:id`             — partial update
- DELETE `/api/expenses/:id`             — delete

Example create:
```
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"title":"Grocery","amount":42.5,"category":"Food","date":"2025-09-16"}'
```

## Frontend Setup
1. Install & run:
```
cd frontend
npm install
npm run dev
```
2. Open `http://localhost:5173`.

## Scripts
- Backend: `npm run dev` (nodemon), `npm start`
- Frontend: `npm run dev`

## Troubleshooting
- Vite requires Node 20.19+ or 22.12+.
  - Check: `node -v`
  - Windows (nvm): install nvm for Windows → `nvm install 20.19.0 && nvm use 20.19.0`
- Backend not reachable / Failed to fetch:
  - Ensure backend is running on port 5000
  - Ensure MongoDB is running and `MONGODB_URI` is correct
  - Test: `curl http://localhost:5000/health` and `curl http://localhost:5000/api/expenses`
- 404 at `/` is normal; a welcome route is provided with helpful links.

## Deployment (quick notes)
- Backend: Render/Railway (set `MONGODB_URI`, `PORT` is provided by host)
- Frontend: Netlify/Vercel (set API base URL to your deployed backend)

## License
MIT
'@; Set-Content -Path 'README.md' -Value $content"