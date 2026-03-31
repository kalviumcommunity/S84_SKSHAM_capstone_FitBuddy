import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty
        return /^https?:\/\/.+/.test(v); // Must be valid URL
      },
      message: 'Image URL must be a valid HTTP(S) URL'
    }
  },
  videoUrl: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty
        // YouTube URL validation
        return /(youtube\.com|youtu\.be)/.test(v);
      },
      message: 'Video URL must be a valid YouTube link'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Exercise = mongoose.model('Exercise', exerciseSchema);
export default Exercise;