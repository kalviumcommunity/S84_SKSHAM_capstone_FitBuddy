# 💪 FitBuddy - Your AI-Powered Fitness & Nutrition Assistant

<div align="center">

# FitBuddy

**Transform Your Fitness Journey with Personalized AI-Driven Plans**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Contributing](#-contributing) • [Support](#-support)

</div>

---

## 📋 Table of Contents

- [About FitBuddy](#about-fitbuddy)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Installation Guide](#-installation)
- [Usage Guide](#-usage)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Troubleshooting](#-troubleshooting)
- [Bug Reporting](#-bug-reporting)
- [Feature Suggestions](#-feature-suggestions)
- [Contributing Guidelines](#-contributing-guidelines)
- [FAQ](#-faq)
- [Support & Contact](#-support--contact)
- [License](#-license)

---

## About FitBuddy

**FitBuddy** is an intelligent fitness and nutrition companion that creates **personalized workout and meal plans** tailored to your unique needs. Powered by advanced AI (Groq LLMs), FitBuddy considers your age, fitness goals, location, physical conditions, and dietary preferences to generate customized fitness regimens.

Whether you're just starting your fitness journey, recovering from an injury, or looking to optimize your performance, FitBuddy adapts to your needs with intelligent, data-driven recommendations.

### Key Highlights
- 🤖 **AI-Powered Plans**: Personalized fitness & nutrition strategies
- 🌍 **Location-Aware**: Regional diet recommendations based on ingredient availability
- 👥 **Inclusive Design**: Special considerations for children and seniors
- 💬 **Smart Chatbot**: Interactive fitness advisor with contextual awareness
- 📊 **Progress Tracking**: Real-time dashboard with visual tracking
- 🔐 **Secure Authentication**: JWT + Google OAuth 2.0 integration

---

## ✨ Features

### 🎯 Core Features

#### 1. **Personalized Fitness Plans**
- AI-generated workout routines based on your goals
- Age-specific recommendations (safe for all ages)
- Exercise variations for different fitness levels
- Customizable duration and intensity

#### 2. **Smart Nutrition Planning**
- Macro-balanced meal suggestions
- Calorie optimization for your goals
- Regional food recommendations
- Dietary restriction support

#### 3. **Progress Tracking Dashboard**
- Visual body composition tracking
- Macro nutrient progress monitoring
- Daily exercise log and completion tracking
- Weight and body metrics visualization

#### 4. **Interactive AI Chatbot**
- Real-time fitness advice
- Context-aware responses (knows your profile)
- Form correction suggestions
- Motivation and support

#### 5. **Body Visualization**
- 2D body visualization highlighting focus areas
- Muscle group strength/weakness indicators
- Progress mapping on visual models

#### 6. **User Authentication**
- Secure JWT-based login
- Google OAuth 2.0 integration
- Profile completion flow for new users

### 🚀 Advanced Features

- **Optimized Dashboard**: Near-instant UI updates with Redux optimization
- **Multi-language Support**: Dietary guidance in local contexts
- **Mobile Responsive**: Works seamlessly on all devices
- **Dark Mode**: Eye-friendly interface option

---

## 📸 Screenshots

Add screenshots in this section to visually showcase FitBuddy's features.

### Landing Page
![Landing Page](./docs/screenshots/landing-page.png)
*Description: Hero section with call-to-action buttons*

### Authentication
![Login Screen](./docs/screenshots/login-screen.png)
*Figure 1: Secure login with Google OAuth integration*

![Signup Screen](./docs/screenshots/signup-screen.png)
*Figure 2: New user registration form*

### Onboarding
![Setup Wizard](./docs/screenshots/setup-wizard.png)
*Figure 3: AI setup form collecting fitness profile details*

### Dashboard
![Main Dashboard](./docs/screenshots/dashboard.png)
*Figure 4: Overview with progress rings and daily goals*

### Features in Action
![Fitness Plan](./docs/screenshots/fitness-plan.png)
*Figure 5: AI-generated personalized workout plan*

![Nutrition Plan](./docs/screenshots/nutrition-plan.png)
*Figure 6: Macro-balanced meal suggestions with local ingredients*

![Chatbot Interface](./docs/screenshots/chatbot.png)
*Figure 7: Context-aware AI fitness advisor*

![Body Visualization](./docs/screenshots/body-visualization.png)
*Figure 8: 2D body model showing strength and weakness areas*

### Mobile View
![Mobile View](./docs/screenshots/mobile-dashboard.png)
*Figure 9: Responsive design on mobile devices*

> **Note**: To add screenshots, place image files in `docs/screenshots/` directory and reference them as shown above. Supported formats: `.png`, `.jpg`, `.jpeg`, `.gif`

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18.2+ with Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Authentication**: Google OAuth 2.0, JWT
- **Notifications**: React Hot Toast
- **Markdown**: React Markdown
- **Routing**: React Router v6

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, Google OAuth 2.0
- **AI Integration**: Groq SDK (Llama models)
- **Email Service**: EmailJS (for notifications)
- **Image Management**: ImageKit

### Infrastructure
- **Deployment**: Render.yaml configuration
- **Version Control**: Git/GitHub

---

## 🚀 Installation

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/fitbuddy.git
cd fitbuddy
```

### Step 2: Environment Setup

Create `.env` files in both frontend and backend directories:

#### Backend `.env` file (`server/.env`)

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitbuddy?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Groq AI Configuration
GROQ_API_KEY=your_groq_api_key_here

# Email Service (EmailJS)
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
EMAILJS_PRIVATE_KEY=your_emailjs_private_key
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id/

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

#### Frontend `.env` file (`frontend/.env`)

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# ImageKit
VITE_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id/

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CHATBOT=true
```

### Step 3: Install Dependencies

#### Backend Setup

```bash
cd server
npm install
```

#### Frontend Setup

```bash
cd ../frontend
npm install
```

### Step 4: Database Setup

If using MongoDB Atlas:
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Add your connection string to the backend `.env` file
3. Database collections will be created automatically by Mongoose

For local MongoDB:
```bash
# Start MongoDB service (Windows)
mongod

# Or using MongoDB compass for GUI management
```

### Step 5: Start the Application

#### Terminal 1 - Start Backend Server

```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

#### Terminal 2 - Start Frontend Development Server

```bash
cd frontend
npm run dev
# Frontend starts on http://localhost:5173
```

### Step 6: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📖 Usage Guide

### Getting Started as a New User

#### 1. **Sign Up / Login**
- Click "Get Started" or navigate to the login page
- Use email/password or Google OAuth
- First-time users are redirected to Setup Wizard

#### 2. **Complete Your Profile (Setup Wizard)**
The setup wizard collects essential information:
- **Personal Info**: Age, height, weight, gender
- **Fitness Goal**: Bulking, Cutting, Maintenance, or Rehabilitation
- **Location**: Country/Region for diet customization
- **Medical Conditions**: Any injuries or constraints
- **Dietary Preferences**: Vegetarian, vegan, allergies, etc.

*Screenshot: [Setup Wizard](./docs/screenshots/setup-wizard.png)*

#### 3. **Access Your Dashboard**
After setup, you'll see:
- **Daily Macro Goals**: Visual progress rings
- **Today's Exercises**: Suggested workout routine
- **Today's Meals**: Personalized nutrition plan
- **Progress Metrics**: Weight, body composition trends

#### 4. **Generate AI Plans**
Navigate to Plans section to:
- Create new fitness plans
- Generate meal plans
- Customize plan duration and intensity
- Save favorite plans

#### 5. **Track Progress**
- Mark exercises as complete
- Log meals consumed
- Update weight measurements
- View historical progress charts

#### 6. **Use AI Chatbot**
- Click the chat icon (bottom-right)
- Ask fitness-related questions
- Get personalized advice based on your profile
- Receive form correction suggestions

### Detailed Feature Walkthrough

#### Feature 1: AI Fitness Plan Generation
```
Dashboard → Plans → Generate New Workout
↓
Select Duration: 4-week, 8-week, 12-week
↓
Choose Intensity: Beginner, Intermediate, Advanced
↓
AI generates customized plan with:
  - Daily exercises with descriptions
  - Sets, reps, and rest periods
  - Progressive overload suggestions
```

#### Feature 2: Personalized Meal Plans
```
Dashboard → Plans → Generate Nutrition Plan
↓
AI considers:
  - Your macro goals (Protein, Carbs, Fats)
  - Regional ingredient availability
  - Dietary restrictions
  - Current weight and goals
↓
Receive meal suggestions with:
  - Recipes with instructions
  - Calorie breakdowns
  - Macro ratios
  - Local food names and alternatives
```

#### Feature 3: Progress Tracking
```
Dashboard → Tracker
↓
Log Today's Activity:
  - Mark exercises as complete
  - Log meals and portions
  - Update body metrics
↓
View in Real-time:
  - Macro progress circles
  - Daily calorie intake
  - Exercise completion rate
```

---

## 📁 Project Structure

```
FitBuddy/
│
├── frontend/                      # React Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/             # Login, Signup components
│   │   │   ├── Dashboard/        # Dashboard layout and sections
│   │   │   ├── Layout/           # Navigation, Sidebar, Footer
│   │   │   ├── UI/               # Reusable UI components
│   │   │   ├── ChatWidget.jsx    # AI Chatbot interface
│   │   │   └── BodyVisualization2D.jsx  # Body model visualization
│   │   ├── pages/                # Page components
│   │   ├── services/             # API calls and external services
│   │   ├── store/                # Redux store configuration
│   │   │   └── slices/           # Redux slices (auth, plan, profile, tracker)
│   │   ├── utils/                # Utility functions and constants
│   │   ├── context/              # React Context (Theme, etc.)
│   │   ├── App.jsx               # Main App component
│   │   └── main.jsx              # Entry point
│   ├── public/                    # Static assets
│   ├── package.json              # Frontend dependencies
│   ├── vite.config.js            # Vite configuration
│   └── tailwind.config.js        # Tailwind CSS configuration
│
├── server/                        # Backend Application
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js             # MongoDB connection
│   │   ├── models/               # Mongoose schemas
│   │   │   ├── User.js           # User model
│   │   │   ├── Profile.js        # User profile model
│   │   │   ├── Plan.js           # Fitness plan model
│   │   │   ├── Exercise.js       # Exercise data model
│   │   │   ├── DailyLog.js       # Daily tracking logs
│   │   │   └── ChatMessage.js    # Chat history
│   │   ├── routes/               # API endpoints
│   │   │   ├── auth.js           # Authentication routes
│   │   │   ├── plan.js           # Plan management routes
│   │   │   ├── exercise.js       # Exercise routes
│   │   │   ├── profile.js        # Profile routes
│   │   │   ├── tracker.js        # Tracking routes
│   │   │   ├── chat.js           # Chatbot routes
│   │   │   └── feedback.js       # Feedback/bug reporting
│   │   ├── middleware/
│   │   │   └── auth.js           # JWT authentication middleware
│   │   ├── services/
│   │   │   └── groqService.js    # Groq AI integration
│   │   └── server.js             # Express app setup
│   ├── package.json              # Backend dependencies
│   └── uploads/                  # User uploads directory
│
├── docs/                         # Documentation
│   ├── images/                   # Logo and images
│   └── screenshots/              # Feature screenshots
│
├── README.md                     # This file
├── TECHNICAL_OVERVIEW.md         # Technical documentation
└── render.yaml                   # Deployment configuration

```

---

## ⚙️ Configuration

### Frontend Configuration

#### Vite Config (`frontend/vite.config.js`)
- Hot module replacement for development
- Optimized build output
- Environment variable handling

#### Tailwind CSS (`frontend/tailwind.config.js`)
- Custom theme colors and spacing
- Responsive design breakpoints
- Utility class extensions

#### Redux Store (`frontend/src/store/store.js`)
- **authSlice**: User authentication state
- **profileSlice**: User profile and goals
- **planSlice**: Generated fitness and meal plans
- **trackerSlice**: Daily progress tracking

### Backend Configuration

#### Server Setup (`server/server.js`)
- Express middleware configuration
- CORS settings for frontend communication
- Route registration
- Error handling

#### Database Models
- **User**: Authentication and account data
- **Profile**: Fitness profile and goals
- **Plan**: Generated workout and meal plans
- **DailyLog**: Daily activity tracking
- **ChatMessage**: Chat history with AI

#### Groq AI Integration (`server/src/services/groqService.js`)
- Llama model selection
- Prompt engineering for fitness context
- Age-specific plan generation
- Regional diet customization

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. **MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
- Ensure MongoDB is running: `mongod`
- Verify connection string in `.env`
- Check MongoDB Atlas credentials
- Whitelist your IP address in MongoDB Atlas

#### 2. **Google OAuth Not Working**
```
Error: OAuth configuration is missing
```

**Solution:**
- Verify `VITE_GOOGLE_CLIENT_ID` in frontend `.env`
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in backend `.env`
- Check authorized redirect URIs in Google Console
- Ensure redirect URL matches: `http://localhost:5173`

#### 3. **API Connection Refused**
```
Error: Cannot reach backend at http://localhost:5000
```

**Solution:**
- Check if backend is running: `npm run dev` in server folder
- Verify `VITE_API_URL` in frontend `.env`
- Check firewall settings
- Ensure backend PORT matches (default: 5000)

#### 4. **CORS Error**
```
Error: Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
- Update `FRONTEND_URL` in backend `.env`
- Restart backend server
- Check backend CORS middleware configuration

#### 5. **Uploads Not Working**
```
Error: Failed to upload image
```

**Solution:**
- Create `server/uploads/` directory
- Check write permissions
- Verify ImageKit credentials (if using cloud upload)
- Check file size limits

#### 6. **AI Generate Plan Returns Error**
```
Error: Failed to generate plan with AI
```

**Solution:**
- Verify `GROQ_API_KEY` in backend `.env`
- Check Groq API rate limits
- Ensure user profile is complete
- Check backend logs for detailed error

### Debug Mode

Enable detailed logging:

**Backend** - Add to `server/.env`:
```env
DEBUG=fitbuddy:*
LOG_LEVEL=debug
```

**Frontend** - Add to `frontend/.env`:
```env
VITE_DEBUG=true
```

### Checking Logs

Backend logs:
```bash
# Check Node process logs
tail -f logs/app.log

# Or use PM2 (if installed)
pm2 logs fitbuddy-server
```

---

## 🐛 Bug Reporting

We appreciate your help in improving FitBuddy! Please follow these guidelines when reporting bugs.

### How to Report a Bug

#### Option 1: GitHub Issues (Recommended)

1. **Navigate to Issues**: Go to [FitBuddy Issues Page](https://github.com/yourusername/fitbuddy/issues)

2. **Click "New Issue"** and select "Bug Report"

3. **Use This Template**:

```markdown
## Bug Title
[Brief, descriptive title of the bug]

## Environment
- **OS**: [Windows / Mac / Linux]
- **Browser**: [Chrome / Firefox / Safari / Edge]
- **Browser Version**: [e.g., 121.0]
- **App Version**: [e.g., 1.0.0]
- **Frontend Environment**: [Development / Production]

## Steps to Reproduce
1. [First step]
2. [Second step]
3. [Etc.]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happened]

## Screenshots
[Add screenshots here - see section below]

## Error Messages
```
[Paste full error message/stack trace]
```

## Additional Context
[Any additional information that might help]

## Impact
- [ ] Critical (App crashes / data loss)
- [ ] High (Major feature broken)
- [ ] Medium (Feature partially broken)
- [ ] Low (Minor UI issue / typo)
```

#### Option 2: In-App Bug Reporting (Coming Soon)

*When implemented, you'll see a "Report Issue" button in the app.*

1. Click the **Report Issue** button
2. Select "Bug"
3. Describe the problem
4. Automatic screenshot attachment
5. Submit (automatically sent to team)

#### Option 3: Email Direct Report

Send detailed bug reports to: **support@fitbuddy.com**

Include in subject: `[BUG REPORT] - Brief description`

### Bug Report Quality Checklist

Before submitting, ensure:
- [ ] Issue title is clear and descriptive
- [ ] Steps to reproduce are detailed
- [ ] Screenshots/screencast included if applicable
- [ ] Error messages/logs included
- [ ] Affected user (all users/specific scenario)
- [ ] Verified bug exists in latest version
- [ ] No duplicate issue already exists

### How We Handle Reports

1. **Review**: Team analyzes within 24 hours
2. **Triage**: Assigned priority and milestone
3. **Investigation**: Reproduction and root cause analysis
4. **Fix**: Code changes and testing
5. **Release**: Published in next version
6. **Notification**: Issue reporter notified

### Screenshot Guide for Bugs

When adding screenshots to bug reports:

1. **Use Alt + Print Screen** to capture active window
2. **Highlight Issue**: Use arrows/circles to show problem
3. **Include Console**: Open DevTools (F12) and screenshot console errors
4. **Network Tab**: For API issues, capture network requests
5. **File Size**: Keep under 2MB per image

---

## 💡 Feature Suggestions

We love hearing ideas to make FitBuddy better! Share your feature suggestions here.

### How to Suggest a Feature

#### Option 1: GitHub Discussions (Recommended)

1. **Go to Discussions**: [FitBuddy Discussions](https://github.com/yourusername/fitbuddy/discussions)

2. **Click "New Discussion"**

3. **Use This Template**:

```markdown
## Feature Title
[Clear, concise name for the feature]

## Problem Statement
What problem does this feature solve?
- Current challenge users face
- Why it's important

## Proposed Solution
Describe how this feature should work:
- User flow/steps
- Expected outcomes
- Where it appears in the app

## Example Use Case
Provide a real-world scenario:

"Currently, when I [do X], I have to [do Y]. 
If [feature name] existed, I could [accomplish Z] more efficiently."

## Mockup/Wireframe
[Optional: Add sketches or screenshots showing your vision]

## Implementation Priority
- [ ] Nice to have
- [ ] Important
- [ ] Critical

## Additional Context
- Affected user base
- Related features
- Other suggestions
```

#### Option 2: In-App Suggestion (Coming Soon)

1. Click **Suggest Feature** button in app
2. Choose category
3. Describe idea
4. Optional: Attach mockup
5. Submit

#### Option 3: Email Suggestions

Send ideas to: **ideas@fitbuddy.com**

Subject: `[FEATURE REQUEST] - Concise title`

### Feature Suggestion Evaluation Criteria

Suggestions are rated based on:
- ✅ **User Impact**: How many users benefit?
- ✅ **Problem Clarity**: Is the problem well-defined?
- ✅ **Feasibility**: Technical complexity and resources
- ✅ **Alignment**: Fits FitBuddy's roadmap?
- ✅ **Completeness**: Well-thought-out and detailed?

### Active Feature Requests

Popular requested features (you can upvote):
- [ ] 3D body model with interactive highlights
- [ ] Social challenges with friends
- [ ] Wearable device integration (Fitbit, Apple Watch)
- [ ] Offline mode for gym usage
- [ ] Video form guide library
- [ ] Progress comparison (before/after photos)
- [ ] API access for developers

### Feature Roadmap

Planned features for upcoming releases:

- **v1.1** (Q1 2026): 3D Body Visualization, Advanced Analytics
- **v1.2** (Q2 2026): Social Features, Leaderboards
- **v1.3** (Q3 2026): Wearable Integration, Offline Mode
- **v2.0** (Q4 2026): Mobile App, Advanced AI Coaching

---

## 👥 Contributing Guidelines

Interested in contributing to FitBuddy? We welcome contributions!

### Types of Contributions

We accept contributions for:
- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🧪 Tests
- 🌐 Translations

### Getting Started

1. **Fork the Repository**
   ```bash
   Click "Fork" button on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/yourusername/fitbuddy.git
   cd fitbuddy
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

4. **Make Your Changes**
   - Follow code style guidelines
   - Write clear, descriptive commit messages
   - Test thoroughly

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature" 
   # or 
   git commit -m "fix: resolve issue with X"
   ```

   **Commit message format**:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting
   - `refactor:` for code restructuring
   - `test:` for test additions
   - `perf:` for performance improvements

6. **Push to Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Go to [FitBuddy Repository](https://github.com/yourusername/fitbuddy)
   - Click "New Pull Request"
   - Select your branch
   - Fill out PR template with details

### Pull Request Template

```markdown
## Description
[Brief description of changes]

## Related Issue
Fixes #[issue number]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Changes Made
- [Change 1]
- [Change 2]
- [Change 3]

## Testing Done
- [ ] Unit tests added
- [ ] Manual testing completed
- [ ] No breaking changes

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] Code follows project style
- [ ] Tests are passing
- [ ] Documentation updated
- [ ] No new warnings added
- [ ] Ready for production
```

### Code Style Guidelines

**JavaScript/React**:
```javascript
// Use camelCase for variables and functions
const userProfile = {};

// Use PascalCase for components
const UserCard = () => {};

// Use const over let/var
const value = 42;

// Use arrow functions
const handleClick = () => {};

// Clear, descriptive names
const calculateTotalCalories = (meals) => {};
```

**Formatting**:
- 2-space indentation
- 80-100 character line length
- Semicolons required
- Trailing commas in objects/arrays

### Testing Requirements

Before submitting:

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd ../server
npm test

# ESLint
npm run lint
```

### Documentation Standards

- Add JSDoc comments to functions
- Update README for new features
- Include inline comments for complex logic
- Update TECHNICAL_OVERVIEW.md if needed

### Review Process

1. **Automated Checks**: Tests and linting must pass
2. **Code Review**: Maintainers review code
3. **Feedback**: May request changes
4. **Approval**: PR is approved
5. **Merge**: Changes merged to main

---

## ❓ FAQ

### General Questions

**Q: Is FitBuddy free?**
> A: FitBuddy is currently in beta and free to use. Pricing plans may be introduced in the future with premium features.

**Q: What data does FitBuddy collect?**
> A: We collect fitness profile data (age, weight, goals) and activity logs to provide personalized recommendations. See our Privacy Policy for details.

**Q: How is my data secured?**
> A: All data is encrypted in transit (HTTPS) and at rest. Passwords are hashed with bcrypt. JWT tokens are secure.

**Q: Can I export my data?**
> A: Yes! Go to Settings → Export Data to download your profile and activity logs.

### Technical Questions

**Q: Why is my plan not generating?**
> A: Ensure your profile is complete. Check browser console for errors. Verify Groq API key on backend.

**Q: Can I use FitBuddy offline?**
> A: Currently, FitBuddy requires internet connection. Offline mode is planned for v1.3.

**Q: What happens to my data if I delete my account?**
> A: All personal data is deleted within 30 days. Activity logs are anonymized and retained for analytics if you consent.

**Q: Can I use FitBuddy with my smartwatch?**
> A: Wearable integration (Fitbit, Apple Watch) is planned for v1.3.

### Account & Billing

**Q: How do I reset my password?**
> A: Click "Forgot Password" on login page and follow email instructions.

**Q: Can I change my email address?**
> A: Yes, go to Settings → Account → Change Email.

**Q: What payment methods do you accept?**
> A: Credit cards (Visa, Mastercard), PayPal, and Google Pay. (Coming with premium features)

### Features & Usage

**Q: Can I modify AI-generated plans?**
> A: Yes! You can edit exercises, meals, and durations before starting.

**Q: How often should I update my profile?**
> A: Update every 4-6 weeks for accurate plan generation. Especially update weight and achieved goals.

**Q: Can I follow multiple plans simultaneously?**
> A: Yes! You can have up to 3 active plans with the free tier.

**Q: Does FitBuddy work for rehabilitation after injury?**
> A: Yes! Mention your injury during profile setup for safe, adapted exercises.

---

## 📞 Support & Contact

### Getting Help

#### Documentation
- 📚 [Full Documentation](./docs/)
- 🔧 [Technical Overview](./TECHNICAL_OVERVIEW.md)
- 🎓 [Video Tutorials](#) (Coming Soon)

#### Community
- 💬 [GitHub Discussions](https://github.com/yourusername/fitbuddy/discussions)
- 🐦 [Twitter](https://twitter.com/fitbuddy)
- 📧 [Email Newsletter](https://fitbuddy.com/newsletter)

#### Direct Support

**Email**: support@fitbuddy.com
- Response time: 24-48 hours
- Severity-based prioritization

**Discord Community** (Coming Soon)
- Real-time support from community
- Feature discussions
- User showcase

### Report a Security Issue

For security vulnerabilities, please **do not** open a public issue.

Email: security@fitbuddy.com
- Include: Description, affected component, reproduction steps
- Response time: 24 hours
- Acknowledgment in release notes (with permission)

### Feature Requests & Feedback

- 💡 [Suggest Features](https://github.com/yourusername/fitbuddy/discussions)
- 📝 [Send Feedback](mailto:feedback@fitbuddy.com)
- 🗳️ [Vote on Features](#)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

### MIT License Summary
- ✅ Free to use for personal and commercial projects
- ✅ Modify and redistribute
- ✅ Include in proprietary software
- ❌ Hold liable for damages
- ❌ Remove license/copyright

---

## 🙏 Acknowledgments

### Contributors
Special thanks to all contributors who have helped improve FitBuddy!

### Technologies
- [Groq](https://console.groq.com/) - AI Models
- [MongoDB](https://www.mongodb.com/) - Database
- [React](https://react.dev/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling

### Inspiration
- Fitness enthusiasts and personal trainers
- Open-source community
- User feedback and suggestions

---

## 📊 Project Statistics

- **Contributors**: [Count]
- **Stars**: ⭐
- **Forks**: 🍴
- **Open Issues**: 🐛
- **Pull Requests**: 📤

---

## 🚀 Quick Links

| Resource | Link |
|----------|------|
| **Live Demo** | [fitbuddy.app](https://fitbuddy.app) |
| **GitHub** | [Repository](https://github.com/yourusername/fitbuddy) |
| **Bug Reports** | [Issues](https://github.com/yourusername/fitbuddy/issues) |
| **Feature Ideas** | [Discussions](https://github.com/yourusername/fitbuddy/discussions) |
| **Documentation** | [Docs](./docs/) |
| **Email Support** | support@fitbuddy.com |

---

<div align="center">

### Made with ❤️ by the FitBuddy Team

**Start your fitness transformation today! 💪**

[⬆ Back to Top](#fitbuddy---your-ai-powered-fitness--nutrition-assistant)

</div>

---

## Last Updated
**Last Modified**: April 1, 2026
**Version**: 1.0.0

---

## Roadmap Status

- [x] Project Setup
- [x] Core Features (v1.0)
- [ ] Bug Fixes & Improvements (v1.0.1)
- [ ] 3D Visualization (v1.1)
- [ ] Social Features (v1.2)
- [ ] Mobile App (v2.0)

---
