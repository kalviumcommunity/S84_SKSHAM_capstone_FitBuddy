import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Upload, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import PageWrapper from '../components/layout/PageWrapper';
import { convertYouTubeToEmbed } from '../services/imageKit';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Exercises = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;

  return (
    <PageWrapper>
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 flex-wrap gap-4">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="p-2 hover:bg-surface-light rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-[var(--text-main)]" />
          </button>
          <h1 className="text-xl font-bold ml-2 text-[var(--text-main)]">
            Exercises
          </h1>
        </div>
        
        {isAdmin && (
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm shadow-sm"
          >
            <Upload className="w-4 h-4" />
            Add Exercise
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col h-[calc(100vh-80px)] md:h-auto overflow-hidden p-4">
        <UserExerciseViewer />
      </div>
    </PageWrapper>
  );
};

// User component to view/swipe exercises
const UserExerciseViewer = () => {
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await api.get('/exercises');
        setExercises(res.data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
        toast.error('Failed to load exercises');
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      // Swipe left (next)
      if (currentIndex < exercises.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    } else if (info.offset.x > swipeThreshold) {
      // Swipe right (prev)
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-20">Loading exercises...</div>;
  }

  if (exercises.length === 0) {
    return <div className="text-gray-400 text-center mt-20">No exercises added yet.</div>;
  }

  const currentExercise = exercises[currentIndex];

  return (
    <div className="relative w-full max-w-sm mx-auto h-[600px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95, x: 200 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95, x: -200 }}
          transition={{ duration: 0.3 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="absolute w-full h-full bg-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Media container */}
          <div className="relative h-2/3 bg-black flex items-center justify-center overflow-hidden">
            {currentExercise.videoUrl ? (
              <iframe
                width="100%"
                height="100%"
                src={convertYouTubeToEmbed(currentExercise.videoUrl)}
                title={currentExercise.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : currentExercise.imageUrl ? (
              <img 
                src={currentExercise.imageUrl}
                alt={currentExercise.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-500 flex flex-col items-center">
                <Video className="w-12 h-12 mb-2 opacity-50" />
                No media available
              </div>
            )}
            
            {/* Index indicator */}
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium border border-white/10 backdrop-blur-sm">
              {currentIndex + 1} / {exercises.length}
            </div>
          </div>

          {/* Details container */}
          <div className="flex-1 p-6 bg-gradient-to-t from-gray-900 to-gray-800 overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-2">{currentExercise.title}</h2>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {currentExercise.description}
            </p>
          </div>
          
          {/* Swipe indicator */}
          <div className="absolute top-1/2 -translate-y-1/2 right-2 text-white/50 animate-bounce cursor-pointer flex flex-col gap-1 items-center pb-8 z-10 pointer-events-none">
             {currentIndex < exercises.length - 1 && (
               <span className="text-[10px] bg-black/40 px-2 py-1 rounded-full backdrop-blur-md">Swipe &larr;</span>
             )}
          </div>
          
          <div className="absolute top-1/2 -translate-y-1/2 left-2 text-white/50 animate-bounce cursor-pointer flex flex-col gap-1 items-center pb-8 z-10 pointer-events-none">
             {currentIndex > 0 && (
               <span className="text-[10px] bg-black/40 px-2 py-1 rounded-full backdrop-blur-md">&rarr; Swipe</span>
             )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Exercises;