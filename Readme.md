# 🏋️ FitBuddy - AI-Powered Fitness Companion

A comprehensive fitness application that generates personalized workout and diet plans using AI. Built with React, Node.js, and Groq AI.

![FitBuddy](https://img.shields.io/badge/FitBuddy-v1.0.0-orange)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)

## ✨ Features

- 🔐 **Authentication** - Email/Password & Google OAuth
- 📊 **Smart Onboarding** - Multi-step wizard to collect user preferences
- 🤖 **AI Plan Generation** - Personalized workout & diet plans via Groq AI
- 📱 **Daily Tracker** - Track exercises, meals, and water intake
- 💬 **AI Chat** - Get fitness advice (placeholder with dummy data)
- 🌙 **Dark/Light Theme** - Beautiful dark-first design
- 📈 **Progress Tracking** - Visual progress indicators

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Groq API key (for AI features)
- Google OAuth credentials (optional, for Google login)

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd FitBuddy

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

**Backend (`server/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/fitbuddy
JWT_SECRET=your-super-secret-jwt-key-here
GROQ_API_KEY=gsk_your_groq_api_key_here
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 3. Run the Application

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173` to see the app!

## 🎨 Tech Stack

| Frontend | Backend | Database | AI |
|----------|---------|----------|-----|
| React 19 | Node.js | MongoDB | Groq SDK |
| Vite | Express 5 | Mongoose 8 | llama3-70b |
| Tailwind CSS v4 | JWT Auth | | |
| Framer Motion | bcryptjs | | |
| Redux Toolkit | | | |

## 📁 Project Structure

```
FitBuddy/
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store & slices
│   │   ├── services/      # API service layer
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Utility functions
│   └── ...
├── server/
│   ├── src/
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   └── services/      # Groq AI service
│   └── server.js
└── Readme.md
```

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/google` | Google OAuth |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/profile` | Get user profile |
| POST | `/api/profile` | Update profile |
| POST | `/api/plan/generate` | Generate AI plan |
| GET | `/api/plan/current` | Get active plan |
| POST | `/api/tracker/exercise` | Toggle exercise |
| POST | `/api/tracker/meal` | Toggle meal |
| POST | `/api/tracker/water` | Update water intake |

## 🎯 User Flow

1. **Landing Page** → Beautiful intro with features showcase
2. **Authentication** → Sign up or login (Google OAuth available)
3. **Onboarding** → 5-step wizard (Goal → Body Stats → Activity → Workout → Diet)
4. **Dashboard** → View generated workout/diet plan with daily tracking
5. **Profile** → Update preferences & regenerate plans

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

# 📋 Low-Level Design (LLD) Document

*Technical specification and architecture details below.*

---

# 🏋️ FitBuddy - System Architecture & LLD

## 1. Tech Stack Specification
*   **Client:** React (Vite), Tailwind CSS, Framer Motion (Animations), Redux Toolkit (State), React-Hook-Form (Complex forms), Lucide React (Icons).
*   **Server:** Node.js, Express.js.
*   **Database:** MongoDB (Mongoose ORM).
*   **AI Engine:** Groq SDK (Model: `llama3-70b-8192` or `mixtral-8x7b-32768` for JSON instruction following).
*   **Auth:** JSON Web Tokens (JWT) + Google OAuth (via Google Auth Library or Passport).

---

## 2. Database Schema Design (Mongoose)

We need 4 core collections to handle the user journey, plan generation, and tracking.

### A. User Collection
*Standard authentication details.*
```javascript
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Null if Google Auth
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  avatar: { type: String },
  currentPlanId: { type: Schema.Types.ObjectId, ref: 'Plan' }, // Quick access to active plan
  createdAt: { type: Date, default: Date.now }
});
```

### B. Profile Collection (The "Context")
*Separated to keep the User model light. Contains all inputs for the AI.*
```javascript
const ProfileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  height: { type: Number }, // in cm
  weight: { type: Number }, // in kg
  goal: { type: String, enum: ['cut', 'bulk', 'maintain', 'strength'] },
  activityLevel: { type: String }, // e.g., 'sedentary', 'active'
  workoutPreference: { type: String, enum: ['gym', 'home', 'calisthenics'] },
  dietaryPreference: { type: String, enum: ['veg', 'non-veg', 'vegan', 'keto'] },
  allergies: [String],
  injuries: [String], // Important for safety
  budget: { type: String }, // 'low', 'medium', 'high'
  targetBodyParts: [String], // e.g., ['chest', 'abs']
  equipmentAvailable: [String], // If home workout
  lastUpdated: { type: Date, default: Date.now }
});
```

### C. Plan Collection (The AI Output)
*Stores the generated structured data.*
```javascript
const PlanSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'archived'], default: 'active' },
  
  // AI Generated Data stored as JSON
  workoutPlan: [{
    day: String, // "Monday"
    focusArea: String, // "Chest & Triceps"
    exercises: [{
      name: String,
      sets: String,
      reps: String,
      notes: String, // "Focus on negative motion"
    }]
  }],
  
  dietPlan: [{
    mealType: String, // "Breakfast"
    options: [{
      name: String,
      calories: Number,
      protein: Number,
      ingredients: [String]
    }]
  }],
  
  macroGoals: {
    protein: Number,
    carbs: Number,
    fats: Number,
    dailyCalories: Number
  },
  
  createdAt: { type: Date, default: Date.now }
});
```

### D. DailyLog Collection (The Tracker)
*Tracks completion.*
```javascript
const DailyLogSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  plan: { type: Schema.Types.ObjectId, ref: 'Plan' },
  date: { type: Date, required: true }, // Normalized to midnight
  
  completedExercises: [{ type: String }], // Names of exercises checked off
  mealsConsumed: [{ type: String }], // Names of meals checked off
  
  waterIntake: { type: Number, default: 0 }, // in glasses
  mood: { type: String }, // Optional UX touch
});
```

---

## 3. API Endpoints Structure (Express)

### Auth Routes (`/api/auth`)
*   `POST /signup` - Register user.
*   `POST /login` - Login & return JWT.
*   `POST /google` - Handle Google OAuth token verification.

### Profile Routes (`/api/profile`)
*   `GET /` - Fetch current user's profile data.
*   `POST /update` - Create or update physical stats/preferences.

### AI Routes (`/api/ai`) - *The Core Logic*
*   `POST /generate`
    *   **Input:** User Profile Data.
    *   **Process:** Calls Groq API with a massive system prompt requiring JSON output. Saves result to `Plan` collection.
    *   **Output:** The Plan Object.
*   `POST /chat`
    *   **Input:** `{ message, currentPlanContext }`
    *   **Process:** Calls Groq (Streamed response recommended).
    *   **Context:** The AI is fed the user's *current* workout/diet plan in the prompt so it knows context (e.g., "Swap the eggs in my breakfast").

### Tracking Routes (`/api/track`)
*   `GET /:date` - Get logs for a specific day.
*   `POST /toggle` - Toggle an exercise or meal as "Done".

---

## 4. Frontend Architecture (React + Redux)

### Directory Structure
```text
src/
├── assets/          # Images, localized animations
├── components/
│   ├── UI/          # Reusable: Buttons, Cards, Inputs (Tailwind styled)
│   ├── Layout/      # Navbar, Sidebar, Footer
│   ├── Auth/        # Login/Signup Forms
│   ├── Onboarding/  # Multi-step Profile Form (Framer Motion steps)
│   ├── Dashboard/   # Daily View, WorkoutCard, DietCard
│   └── Chat/        # ChatInterface, MessageBubble
├── context/         # ThemeContext (if not in Redux)
├── pages/
│   ├── Landing.jsx
│   ├── Auth.jsx
│   ├── SetupProfile.jsx
│   ├── Dashboard.jsx
│   └── Analytics.jsx
├── redux/
│   ├── slices/
│   │   ├── authSlice.js
│   │   ├── planSlice.js
│   │   └── trackerSlice.js
│   └── store.js
└── services/        # API calls (Axios instances)
```

### Key UX/UI Features (Instructions for Copilot)
1.  **The "Gym" Theme:**
    *   **Colors:** Background: `#0f172a` (Slate 900), Surface: `#1e293b` (Slate 800), Primary: `#f59e0b` (Amber 500) or `#10b981` (Emerald 500).
    *   **Typography:** 'Inter' or 'Oswald' for headings (strong, sporty).
2.  **Animations:**
    *   Use `<AnimatePresence>` for the Onboarding form (slide-in/slide-out).
    *   Staggered fade-in for Workout lists on the dashboard.
3.  **Onboarding Flow:**
    *   Do not show a giant form. Show 1 question per screen with a smooth progress bar.

---

## 5. Groq AI Integration Strategy

We need to enforce **JSON Mode** with Groq to ensure the app doesn't break.