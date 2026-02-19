import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bug, Lightbulb, Send } from 'lucide-react';
import { Button } from './ui';
import toast from 'react-hot-toast';
import { feedbackAPI } from '../services/api';

export default function FeedbackModal({ isOpen, onClose }) {
  const [tab, setTab] = useState('bug'); // 'bug' | 'feature'
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setSending(true);
    try {
      if (tab === 'bug') {
        await feedbackAPI.reportBug({ subject, description });
        toast.success('Bug report sent! Thank you.');
      } else {
        await feedbackAPI.suggestFeature({ subject, description });
        toast.success('Feature suggestion sent! Thank you.');
      }
      setSubject('');
      setDescription('');
      onClose();
    } catch {
      toast.error('Failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface border border-surface-border rounded-2xl w-full max-w-md shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-surface-border">
              <h2 className="font-heading font-bold text-lg text-[var(--text-main)] uppercase tracking-wide">
                Feedback
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-dim hover:text-[var(--text-main)] hover:bg-surface-light transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-surface-border">
              <button
                onClick={() => setTab('bug')}
                className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                  tab === 'bug'
                    ? 'text-red-400 border-b-2 border-red-400'
                    : 'text-dim hover:text-muted'
                }`}
              >
                <Bug className="w-4 h-4" /> Report Bug
              </button>
              <button
                onClick={() => setTab('feature')}
                className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                  tab === 'feature'
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-dim hover:text-muted'
                }`}
              >
                <Lightbulb className="w-4 h-4" /> Suggest Feature
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1.5">Subject</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder={tab === 'bug' ? 'Brief bug description' : 'Feature idea title'}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1.5">Description</label>
                <textarea
                  className="input-field min-h-[120px] resize-none"
                  placeholder={tab === 'bug' ? 'Steps to reproduce, what you expected...' : 'Describe the feature you\'d like...'}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" fullWidth loading={sending}>
                <Send className="w-4 h-4" />
                {tab === 'bug' ? 'Submit Bug Report' : 'Submit Suggestion'}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
