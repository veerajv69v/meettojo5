import React, { useState, useEffect } from 'react';
import SwipeCard from '../components/SwipeCard';
import { fetchPotentialMatches } from '../services/supabaseService';
import { User } from '../types';
import { X, Heart, Star, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Discover: React.FC = () => {
  const [profiles, setProfiles] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    const users = await fetchPotentialMatches();
    setProfiles(users);
    setLoading(false);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    // Remove the top card (last index)
    setProfiles((current) => current.slice(0, -1));
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
         <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
         </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="px-6 py-4 flex justify-between items-center bg-white shadow-sm z-10">
        <h1 className="text-2xl font-bold text-pink-600 font-serif">Meettojo</h1>
        <div className="p-2 bg-gray-100 rounded-full">
            <span className="text-xs font-bold text-gray-600 px-2">Coins: 150</span>
        </div>
      </div>

      {/* Card Stack */}
      <div className="flex-1 relative p-4 flex flex-col justify-center max-h-[75vh]">
         {profiles.length > 0 ? (
            <div className="relative w-full h-full max-h-[600px]">
              <AnimatePresence>
                {profiles.map((profile, index) => (
                  <SwipeCard
                    key={profile.id}
                    user={profile}
                    onSwipe={handleSwipe}
                    active={index === profiles.length - 1}
                  />
                ))}
              </AnimatePresence>
            </div>
         ) : (
           <div className="flex flex-col items-center justify-center h-full text-center p-8">
             <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-4">
               <RotateCcw className="w-10 h-10 text-pink-500" />
             </div>
             <h3 className="text-xl font-bold text-gray-800 mb-2">No more profiles</h3>
             <p className="text-gray-500 mb-6">Check back later or expand your discovery settings.</p>
             <button onClick={loadProfiles} className="px-8 py-3 bg-pink-600 text-white rounded-full font-bold shadow-lg">
               Refresh
             </button>
           </div>
         )}
      </div>

      {/* Control Buttons (Visual only, linked to drag logic via Ref in a real app) */}
      <div className="px-8 pb-20 pt-4 flex justify-center items-center gap-6">
         <button className="w-14 h-14 bg-white rounded-full shadow-lg text-yellow-500 flex items-center justify-center hover:scale-110 transition border border-yellow-100">
           <RotateCcw className="w-6 h-6" />
         </button>
         <button className="w-16 h-16 bg-white rounded-full shadow-xl text-red-500 flex items-center justify-center hover:scale-110 transition border border-red-100">
           <X className="w-8 h-8" />
         </button>
         <button className="w-16 h-16 bg-white rounded-full shadow-xl text-green-500 flex items-center justify-center hover:scale-110 transition border border-green-100">
           <Heart className="w-8 h-8 fill-current" />
         </button>
         <button className="w-14 h-14 bg-white rounded-full shadow-lg text-purple-500 flex items-center justify-center hover:scale-110 transition border border-purple-100">
           <Star className="w-6 h-6" />
         </button>
      </div>
    </div>
  );
};

export default Discover;
