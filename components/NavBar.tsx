import React from 'react';
import { User, Flame, Map, Heart, MessageCircle } from 'lucide-react';
import { AppRoute } from '../types';

interface NavBarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentRoute, onNavigate }) => {
  const navItems = [
    { id: AppRoute.PROFILE, icon: User, label: 'Profile' },
    { id: AppRoute.DISCOVER, icon: Flame, label: 'Discover' },
    { id: AppRoute.PEOPLE, icon: Map, label: 'People' },
    { id: AppRoute.LIKED_YOU, icon: Heart, label: 'Liked You' },
    { id: AppRoute.MATCHES, icon: MessageCircle, label: 'Chat' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-1 flex justify-around items-center z-50 max-w-md mx-auto shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] pb-safe">
      {navItems.map((item) => {
        const isActive = currentRoute === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 w-16 py-2 rounded-xl active:scale-95`}
          >
            <div className={`relative transition-all duration-300 ${isActive ? '-translate-y-0.5' : ''}`}>
               <item.icon 
                className={`w-6 h-6 transition-colors duration-300 ${isActive ? 'text-pink-600 fill-pink-600' : 'text-gray-400'}`} 
                strokeWidth={isActive ? 2 : 2} 
               />
               {isActive && (
                 <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-pink-600 rounded-full"></span>
               )}
            </div>
            <span className={`text-[10px] font-bold transition-colors duration-300 ${isActive ? 'text-pink-600' : 'text-gray-400'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default NavBar;