# AI-Assisted Journal System

A full-stack journaling application powered by Google Gemini AI that helps users document their thoughts, receive instant emotional analysis, and track mood patterns over time.

**YouTube Demo**: [Click here to watch](https://youtu.be/UHttaJ5Km8M)

---

## Goal

Build a full-stack AI-assisted journaling application that helps users:

- Document their thoughts and feelings through structured journal entries
- Receive instant AI-powered emotional analysis (emotion detection, keyword extraction, concise summaries)
- Track mood patterns and emotional trends over time through a personal insights dashboard
- Choose personalized ambience themes to enhance their journaling experience

---

## Features

- **User Authentication** — Secure registration and login using JWT stored as httpOnly cookies
- **Live AI Analysis** — Preview Gemini-powered emotion, keywords, and summary before saving an entry
- **Journal Entries** — Create and store entries with an ambience context (forest, ocean, mountain)
- **Personal Dashboard** — View all past entries alongside aggregated insights (top emotion, favourite ambience, recent keywords)
- **Author-level Authorization** — Users can only access their own entries

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 7 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| HTTP Client | Axios |
| Backend | Express.js v5 (ES Modules) |
| Database | MongoDB + Mongoose v9 |
| Authentication | JWT + bcrypt |
| AI / LLM | Google Gemini (`gemini-3-flash-preview`) |

---

## Project Structure

```
Ai-assisted-journal-system/
├── backend/
│   ├── index.js              # App entry point
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   ├── controllers/
│   │   ├── auth.js
│   │   └── journal.js        # AI analysis + CRUD
│   ├── middleware/
│   │   ├── auth.js           # JWT verification
│   │   └── authorization.js  # Author-only guard
│   ├── models/
│   │   ├── auth.js           # User schema
│   │   └── journal.js        # Journal entry schema
│   ├── routes/
│   │   ├── auth.js
│   │   └── journal.js
│   └── services/
│       ├── gemini.js         # Gemini AI client
│       ├── jwt.js
│       └── bcrypt.js
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx            # Router
        ├── context/
        │   └── AuthContext.jsx
        ├── hooks/
        │   └── useAuth.js
        └── pages/
            ├── Home.jsx       # Journal entry + live analysis
            └── Dashboard.jsx  # Entries list + insights
```

---

## API Endpoints

### Auth — `/api/auth`

| Method | Path | Description |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/login` | Login and set auth cookie |
| GET | `/me` | Get current authenticated user |
| POST | `/logout` | Clear auth cookie |

### Journal — `/api/journal` (authentication required)

| Method | Path | Description |
|---|---|---|
| POST | `/` | Create a journal entry (runs AI analysis) |
| GET | `/:userId` | Get all entries for a user |
| POST | `/analyze` | Analyze text with Gemini (no save) |
| GET | `/insights/:userId` | Get aggregated insights for a user |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key

### 1. Clone the repository

```bash
git clone <repo-url>
cd Ai-assisted-journal-system
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
MONGODB_URI=mongodb://localhost:27017/Ai_Journal
Secret=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend server:

```bash
npm run dev     # development (nodemon)
npm start       # production
```

The backend runs on `http://localhost:3000`.

### 3. Set up the frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend dev server:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173`.

---

## How It Works

1. **Write** a journal entry on the home page and select an ambience (forest, ocean, or mountain)
2. **Analyze** the entry — Gemini detects your emotion, extracts keywords, and writes a one-sentence summary
3. **Save** the entry to persist it with the AI analysis attached
4. **Dashboard** aggregates all your entries, showing your top emotion, favourite ambience, and recent keywords at a glance

### AI Analysis (Gemini)

Each entry is sent to `gemini-2.0-flash` with a structured prompt requesting a JSON response containing:

- `emotion` — one of: `happy`, `sad`, `anxious`, `calm`, `angry`, `excited`, `grateful`, `overwhelmed`, `hopeful`, `lonely`
- `keywords` — array of 3–5 important words from the entry
- `summary` — one sentence (max 20 words) describing the entry

---

## Data Models

### User

```
name      String   required
email     String   required, unique
password  String   required
```

### Journal Entry

```
userId    ObjectId   ref: User, required
ambience  String     enum: forest | ocean | mountain
text      String     required
emotion   String     populated by AI
keywords  [String]   populated by AI
summary   String     populated by AI
```
