import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD — used for daily rate limiting
}, { timestamps: true });

// Index for fast lookup: user + date (for rate limit) and chronological order
chatMessageSchema.index({ user: 1, date: 1 });
chatMessageSchema.index({ user: 1, createdAt: 1 });

export default mongoose.model('ChatMessage', chatMessageSchema);
