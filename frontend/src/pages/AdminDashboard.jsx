import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Upload } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import PageWrapper from '../components/layout/PageWrapper';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error('Title and description are required');
      return;
    }

    if (!imageUrl && !videoUrl) {
      toast.error('Please add at least an image or a video');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/exercises', {
        title,
        description,
        imageUrl,
        videoUrl
      });
      console.log('Exercise created:', response.data);
      toast.success('Exercise added successfully!');
      setTimeout(() => {
        navigate('/exercises');
      }, 500);
    } catch (error) {
      console.error('Exercise creation error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to add exercise';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="flex items-center p-3 md:p-6 md:pb-2">
        <h1 className="text-lg md:text-2xl font-bold font-heading text-[var(--text-main)] drop-shadow-sm">
          Admin Dashboard
        </h1>
      </div>

      <div className="flex-1 flex flex-col p-2 md:p-6 max-w-2xl mx-auto w-full pb-24 md:pb-10">
        <div className="bg-surface rounded-2xl p-3 md:p-6 shadow-sm border border-surface-border">
          <h2 className="text-base md:text-xl font-semibold mb-3 md:mb-6 flex items-center gap-2 text-[var(--text-main)]">
            <Upload className="w-4 md:w-5 h-4 md:h-5 text-accent" />
            Add New Exercise
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5">
            <div>
              <label className="block text-dim mb-1 text-xs md:text-sm font-medium">Exercise Title</label>
              <input 
                type="text" 
                className="w-full bg-surface-light border border-surface-border rounded-lg md:rounded-xl p-2 md:p-3 text-sm md:text-base text-[var(--text-main)] focus:outline-none focus:border-accent transition-colors"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Push Ups"
                required
              />
            </div>
            
            <div>
              <label className="block text-dim mb-1 text-xs md:text-sm font-medium">Short Description</label>
              <textarea 
                className="w-full bg-surface-light border border-surface-border rounded-lg md:rounded-xl p-2 md:p-3 text-sm md:text-base text-[var(--text-main)] h-16 md:h-28 resize-none focus:outline-none focus:border-accent transition-colors"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="How to perform..."
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-2 md:gap-4">
              <div>
                <label className="block text-dim mb-1 text-xs md:text-sm font-medium">Cover Image URL (Optional)</label>
                <input
                  id="imageUrlInput"
                  type="url"
                  placeholder="e.g. https://ik.imagekit.io/yourname/exercise.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-surface-light border border-surface-border rounded-lg md:rounded-xl p-2 md:p-3 text-xs md:text-sm text-[var(--text-main)] focus:outline-none focus:border-accent transition-colors"
                />
                <p className="mt-1 text-xs text-dim hidden md:block">Upload to ImageKit, Imgur, or any image hosting and paste URL here</p>
                {imageUrl && (
                  <div className="mt-1 text-xs text-green-400">
                    ✓ Image URL accepted
                  </div>
                )}
              </div>

              <div>
                <label className="block text-dim mb-1 text-xs md:text-sm font-medium">YouTube Video URL (Optional)</label>
                <input
                  id="videoUrlInput"
                  type="url"
                  placeholder="e.g. https://youtu.be/dQw4w9WgXcQ"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full bg-surface-light border border-surface-border rounded-lg md:rounded-xl p-2 md:p-3 text-xs md:text-sm text-[var(--text-main)] focus:outline-none focus:border-accent transition-colors"
                />
                {videoUrl && (
                  <div className="mt-1 text-xs text-green-400">
                    ✓ YouTube link accepted
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover text-white rounded-lg md:rounded-xl py-2 md:py-3.5 text-sm md:text-base font-bold transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-accent/25 mt-3 md:mt-6"
            >
              {loading ? 'Creating...' : 'Add Exercise'}
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AdminDashboard;