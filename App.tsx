import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import { AppRoute } from './types';
import Discover from './pages/Discover';
import Chat from './pages/Chat';
import Wallet from './pages/Wallet';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import People from './pages/People';
import LikedYou from './pages/LikedYou';
import { Heart } from 'lucide-react';

const Splash = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="h-full flex items-center justify-center bg-white">
      <div className="animate-bounce flex flex-col items-center">
        <div className="w-24 h-24 bg-pink-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-pink-300 rotate-6 mb-6">
           <Heart className="w-12 h-12 text-white fill-current" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Meettojo</h1>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.DISCOVER);

  if (loading) {
    return <Splash onFinish={() => setLoading(false)} />;
  }

  if (!isAuthenticated) {
    return <Auth onComplete={() => setIsAuthenticated(true)} />;
  }

  const renderScreen = () => {
    switch (currentRoute) {
      case AppRoute.PROFILE: return <Profile onNavigate={setCurrentRoute} />;
      case AppRoute.DISCOVER: return <Discover />;
      case AppRoute.PEOPLE: return <People />;
      case AppRoute.LIKED_YOU: return <LikedYou />;
      case AppRoute.MATCHES: return <Chat />; // Chat list page
      case AppRoute.WALLET: return <Wallet />;
      default: return <Discover />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <main className="flex-1 overflow-hidden relative">
        {renderScreen()}
      </main>
      <NavBar 
        currentRoute={currentRoute} 
        onNavigate={setCurrentRoute} 
      />
    </div>
  );
};

export default App;