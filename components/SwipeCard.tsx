import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { User } from '../types';
import { MapPin, Briefcase, GraduationCap, Info } from 'lucide-react';

interface SwipeCardProps {
  user: User;
  onSwipe: (direction: 'left' | 'right') => void;
  active: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ user, onSwipe, active }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-50, -150], [0, 1]);
  
  const [showInfo, setShowInfo] = useState(false);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
  };

  if (!active) return null;

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 w-full h-full p-4"
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl bg-white">
        {/* Photo */}
        <div className="absolute inset-0 bg-gray-200">
           <img 
            src={user.photos[0]} 
            alt={user.name}
            className="w-full h-full object-cover"
            draggable={false}
           />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

        {/* Action Indicators */}
        <motion.div 
          style={{ opacity: likeOpacity }}
          className="absolute top-8 left-8 border-4 border-green-500 rounded-lg px-4 py-2 rotate-[-15deg]"
        >
          <span className="text-green-500 font-bold text-4xl uppercase tracking-widest">Like</span>
        </motion.div>

        <motion.div 
          style={{ opacity: nopeOpacity }}
          className="absolute top-8 right-8 border-4 border-red-500 rounded-lg px-4 py-2 rotate-[15deg]"
        >
          <span className="text-red-500 font-bold text-4xl uppercase tracking-widest">Nope</span>
        </motion.div>

        {/* Info Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-auto">
          <div className="flex items-end justify-between mb-2">
            <div>
              <h2 className="text-3xl font-bold flex items-baseline gap-2">
                {user.name} <span className="text-2xl font-normal">{user.age}</span>
              </h2>
              <div className="flex items-center text-sm font-medium opacity-90 mt-1">
                 <Briefcase className="w-4 h-4 mr-1" />
                 {user.job}
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo); }}
              className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition"
            >
              <Info className="w-6 h-6 text-white" />
            </button>
          </div>

          {showInfo && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="space-y-3 pt-4 border-t border-white/20"
            >
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                {user.location}
              </div>
              <p className="text-sm opacity-90 leading-relaxed">
                {user.bio}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {user.interests.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;
