# FitBuddy - Project Technical Documentation & Overview

## Project Overview
FitBuddy is an AI-powered fitness and nutrition assistant designed to create personalized workout and meal plans. It leverages Large Language Models (LLMs) to provide tailored advice based on user age, goals, location, and physical condition.

## Core Technical Stack
- **Frontend**: React (Vite), Tailwind CSS, Redux Toolkit (State Management), Framer Motion (Animations), Lucide React (Icons).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Mongoose (ODM).
- **AI Integration**: Groq SDK (Llama models) for real-time plan generation and chatbot features.
- **Authentication**: JWT-based local auth and Google OAuth 2.0.

---

## 1. Challenge: Age-Specific Personalization
**Problem**: Generic fitness plans often fail for younger (children) or older (senior) users. Recommending heavy weightlifting to a child or high-impact cardio to a senior with joint issues can be ineffective or dangerous.
**Solution**: Implementation of a dynamic branching logic in the AI prompt generator.
**Technical Explanation**:
- The `groqService` evaluates the `age` field in the user profile.
- If `age < 10` (Child) or `age > 60` (Senior), specific instructions are injected into the LLM system prompt:
  - **Children**: Focus on fun activities, growth-oriented nutrition, and avoids supplements/heavy resistance.
  - **Seniors**: Focus on low-impact movement (Tai Chi, Yoga), joint mobility, and muscle preservation.
- This ensures the JSON response contains safe and relevant exercises.

## 2. Challenge: User Retention & Onboarding (Google Auth)
**Problem**: Users signing up via Google were sometimes bypassing the mandatory "Setup" form, leading to empty dashboards and poor engagement.
**Solution**: Conditional redirection logic in the authentication flow.
**Technical Explanation**:
- The `User` model includes a `profileComplete` boolean flag (defaulting to `false`).
- In both `Login.jsx` and `Signup.jsx`, the frontend checks this flag immediately after a successful JWT response.
- `navigate(user.profileComplete ? '/dashboard' : '/setup')` ensures that any new user (Google or Local) who hasn't filled their credentials is redirected to the AI setup wizard.

## 3. Challenge: Dashboard Responsiveness
**Problem**: UI latency of 2-3 seconds when marking tasks (diet/exercise) as complete.
**Solution**: Migration to **Optimistic UI Updates**.
**Technical Explanation**:
- Currently, the Redux `trackerSlice` handles updates by awaiting the backend response.
- **Technical Fix**: Implement `extraReducers` that update the local Redux state balance *instantly* when the action is dispatched (Pending state), with a rollback mechanism if the API call fails. This removes the perceived network latency for the user.

## 4. Challenge: Macro-Diet Accuracy
**Problem**: Discrepancy between the "Macro Goals" displayed at the top and the actual sum of the meals suggested in the daily diet.
**Solution**: Constraint-based LLM generation.
**Technical Explanation**:
- The system prompt in `groqService.js` now includes a strict "Aggregation Rule":
  - The AI is instructed to calculate `macroGoals` by summing the calories/protein/fat of exactly **one** option from each meal (Breakfast, Lunch, Dinner, Snack).
  - This ensures the dashboard's "Daily Progress" ring matches the food items listed below it.

## 5. Challenge: Regional/National Diet Constraints
**Problem**: Users in specific countries (e.g., India) were getting meal suggestions with ingredients local only to Western markets (e.g., specific meat cuts not common in India).
**Solution**: Context-aware prompts using the `country` attribute.
**Technical Explanation**:
- The user's country is captured during signup.
- The `groqService` adds a regional constraint: `"IMPORTANT: All food recommendations MUST use ingredients commonly available in [Country]. Use local food names."`
- This leverages the LLM's cross-cultural knowledge to suggest accessible ingredients.

## 6. Challenge: Interactive Body Visualization
**Problem**: Users need a visual way to see their progress and focus areas.
**Solution**: SVG-based 2D Visualization and planned 3D Model integration.
**Technical Explanation**:
- **Current**: `BodyVisualization2D.jsx` uses SVG path manipulation to highlight muscle groups based on user data.
- **Planned**: Integration of `@react-three/fiber` and `@react-three/drei` to load a 3D GLTF model. The model will utilize vertex coloring (Green for Strength, Red for Weakness) driven by the `profile.strengthParts` and `profile.weaknessParts` arrays.

## 7. Challenge: Context-Aware AI Chatbot
**Problem**: Generic chatbots lack the context of the user's specific fitness stats and goals.
**Solution**: Contextual session-based chat.
**Technical Explanation**:
- The chatbot endpoint receives the full user profile (weight, height, goal, current plan) alongside the chat history.
- The system prompt defines the bot as a "Gym Instructor" who knows the user's specific credentials, enabling highly personalized advice (e.g., "Since your goal is Bulking and you have a Knee Injury, try this instead...").

---

## Future Roadmap (Technical Tasks)
- **Email Bug Reporting**: Integration of `Nodemailer` on the backend to forward user feedback directly to the support team.
- **Workout Precision**: Adding mandatory `reps`, `sets`, and `restTime` fields to the `workoutPlan` JSON schema.
- **3D Model Overlay**: Mapping the `trackerSlice` data to the 3D body model for real-time "pump" or "fatigue" visualization.
