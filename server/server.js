import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import profileRoutes from './src/routes/profile.js';
import planRoutes from './src/routes/plan.js';
import trackerRoutes from './src/routes/tracker.js';
import feedbackRoutes from './src/routes/feedback.js';
import chatRoutes from './src/routes/chat.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json({ limit: '5mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/plan', planRoutes);
app.use('/api/tracker', trackerRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/',(req,res)=>{
  res.send("You are on wrong route Broo!!!!!!!!!!!!!!");
  
})

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
