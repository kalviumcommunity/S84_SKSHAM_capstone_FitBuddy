import express from 'express';
import Exercise from '../models/Exercise.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Helper function to extract YouTube video ID
function getYouTubeVideoId(url) {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : '';
}

// @route   POST /api/exercises
// @desc    Add a new exercise (Admin only)
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    // Debug logging
    console.log('User creating exercise:', {
      userId: req.user.id,
      email: req.user.email,
      adminEmail: process.env.ADMIN_EMAIL
    });

    // Check if user is admin (case-insensitive)
    if (!req.user.email || req.user.email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) {
      console.warn(`Access denied for ${req.user.email} - admin email is ${process.env.ADMIN_EMAIL}`);
      return res.status(403).json({ 
        message: 'Access denied. Admin only.',
        userEmail: req.user.email,
        requiredEmail: process.env.ADMIN_EMAIL
      });
    }

    const { title, description, imageUrl, videoUrl } = req.body;
    
    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // Validate image URL format if provided
    if (imageUrl && !/^https?:\/\/.+/.test(imageUrl)) {
      return res.status(400).json({ message: 'Image URL must be a valid HTTP(S) URL' });
    }

    // Validate YouTube URL format if provided
    if (videoUrl && !/(youtube\.com|youtu\.be)/.test(videoUrl)) {
      return res.status(400).json({ message: 'Video URL must be a valid YouTube link' });
    }

    const newExercise = new Exercise({
      title,
      description,
      imageUrl: imageUrl || '',
      videoUrl: videoUrl || '',
      createdBy: req.user.id
    });

    const exercise = await newExercise.save();
    res.status(201).json(exercise);
  } catch (err) {
    console.error('Error creating exercise:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   GET /api/exercises
// @desc    Get all exercises
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const exercises = await Exercise.find().sort({ createdAt: -1 });
    res.json(exercises);
  } catch (err) {
    console.error('Error fetching exercises:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

export default router;