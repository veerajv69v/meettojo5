import React, { useEffect, useState } from 'react';
import { fetchPotentialMatches } from '../services/supabaseService';
import { User } from '../types';
import { Heart, Lock } from 'lucide-react';

const LikedYou: React.FC = () => {
  const [fans, setFans] = useState<User[]>([]);
  const [isPremium, setIsPremium] = useState(false); // Simulating free user

  useEffect(() => {
    // Reusing fetchPotentialMatches to simulate "Fans"
    fetchPotentialMatches().then(users => setFans(users.slice(0, 6)));
  }, []);

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Liked You</h1>
        <p className="text-gray-500 text-sm mt-1">See who already likes you</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
         {!isPremium && (
            <div className="mb-6 p-4 bg-gradient-to-r from-pink-500 to-orange-400 rounded-2xl text-white shadow-lg">
               <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-white/20 rounded-full">
                   <Heart className="w-6 h-6 fill-current" />
                 </div>
                 <h3 className="font-bold text-lg">See who likes you</h3>
               </div>
               <p className="text-sm opacity-90 mb-4">Upgrade to Premium to unblur photos and match instantly.</p>
               <button onClick={() => setIsPremium(true)} className="w-full py-3 bg-white text-pink-600 font-bold rounded-xl text-sm shadow-sm">
                 Upgrade Now
               </button>
            </div>
         )}

         <div className="grid grid-cols-2 gap-4">
           {fans.map((fan) => (
             <div key={fan.id} className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-gray-100 shadow-md">
                <img 
                  src={fan.photos[0]} 
                  className={`w-full h-full object-cover ${!isPremium ? 'blur-md' : ''} transition duration-500`} 
                  alt="" 
                />
                
                {/* Overlay for match potential */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                <div className="absolute bottom-3 left-3 text-white">
                  {isPremium ? (
                     <span className="font-bold text-lg">{fan.name}, {fan.age}</span>
                  ) : (
                     <div className="flex items-center gap-2">
                       <Lock className="w-4 h-4" />
                       <span className="font-bold">Upgrade to see</span>
                     </div>
                  )}
                </div>

                {/* Heart Icon Badge */}
                <div className="absolute top-2 right-2 bg-pink-500 p-1.5 rounded-full border-2 border-white shadow-sm">
                   <Heart className="w-3 h-3 text-white fill-current" />
                </div>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
};

export default LikedYou;