# 🏋️ FitBuddy - Your AI-Powered Personal Fitness Coach

[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**FitBuddy** is a comprehensive, full-stack fitness application designed to democratize personal training through Artificial Intelligence. By leveraging the power of **Groq AI**, FitBuddy generates highly personalized workout and diet plans tailored to your specific goals, body type, and constraints.

Whether you're looking to bulk up, lose weight, or maintain your fitness, FitBuddy provides the tools, tracking, and insights you need to succeed.

---

##  Table of Contents

- [ Key Features](#-key-features)
- [ Tech Stack](#-tech-stack)
- [ Project Structure](#-project-structure)
- [ Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-setup)
- [ Screenshots](#-screenshots-placeholder)
- [ Future Roadmap](#-future-roadmap)
- [ Contributing](#-contributing)
- [ License](#-license)

---

##  Key Features

- ** Secure Authentication**: Robust user management using JWT with support for Email/Password and Google OAuth authentication.
- ** AI-Powered Personalization**: Integrated with Groq AI to generate custom diet and workout plans based on biometric data (age, weight, height, gender).
- ** Interactive Dashboard**: A visually stunning, dark-themed dashboard to visualize daily progress, macros, and workout completion.
- ** Daily Activity Tracking**:
  - **Workout Tracker**: Mark exercises as complete and track your sets/reps.
  - **Meal Tracker**: Log meals and monitor caloric/macro intake.
  - **Hydration Monitor**: Interactive water intake tracking.
- ** Body Visualization**: Visual representation of target muscle groups (strength vs. weakness areas).
- ** Responsive Design**: Fully responsive UI built with Tailwind CSS, ensuring a seamless experience on desktop, tablet, and mobile.
- ** High Performance**: Powered by Vite and React for lightning-fast interactions and smooth animations using Framer Motion.

---

##  Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS, PostCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT), Google Auth Library
- **AI Integration**: Groq SDK
- **Security**: Bcryptjs, CORS

---

##  Project Structure

```bash
FitBuddy/
 frontend/                # React Client Application
    src/
       components/      # Reusable UI components
       context/         # React Context API providers
       pages/           # Application route pages
       services/        # API service calls
       store/           # Redux store setup
       utils/           # Helper functions
    ...
 server/                  # Node.js Express Server
    src/
       config/          # DB and app configuration
       middleware/      # Auth and error middleware
       models/          # Mongoose schemas (User, Plan, Log)
       routes/          # API endpoints
       services/        # Business logic & AI integration
    ...
 Readme.md                # Project Documentation
```

---

##  Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** Instance (Local or Atlas)
- **Groq API Key** (for AI Personalization)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fitbuddy.git
   cd fitbuddy
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Setup

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/fitbuddy

# JWT Security
JWT_SECRET=your_super_secret_jwt_key

# AI Configuration (Groq)
GROQ_API_KEY=your_groq_api_key

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Running the Application

1. **Start the Backend Server**
   ```bash
   # Inside /server directory
   npm run rund    # Uses nodemon for development
   ```

2. **Start the Frontend Client**
   ```bash
   # Inside /frontend directory
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

---

##  Screenshots (Placeholder)

| Landing Page | Dashboard |
|:---:|:---:|
| ![Landing Page Placeholder](https://via.placeholder.com/400x200?text=Landing+Page) | ![Dashboard Placeholder](https://via.placeholder.com/400x200?text=Dashboard+View) |

---

##  Future Roadmap

- [ ] **Mobile App**: Native mobile application using React Native.
- [ ] **Social Features**: Share progress and compete with friends.
- [ ] **Integration**: Wearable device integration (Apple Health, Fitbit).
- [ ] **Advanced Analytics**: Long-term trend analysis for weight and strength.
- [ ] **Marketplace**: Connect with certified human trainers.

---

##  Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

##  License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with  by SKSHAM
</p>
