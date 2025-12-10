import React, { useState, useEffect } from 'react';
import { User, Message } from '../types';
import { ArrowLeft, Send, Gift, MoreVertical, Search, Ban, Flag, CheckCircle2, AlertCircle } from 'lucide-react';
import { deductCoins, getCoinBalance } from '../services/supabaseService';

const MOCK_MATCHES: User[] = [
  { id: '1', name: 'Sarah', photos: ['https://picsum.photos/100/100?random=10'], age: 24, gender: 'Female', bio: '', interests: [], location: '', job: '', coins: 0 },
  { id: '2', name: 'Emily', photos: ['https://picsum.photos/100/100?random=11'], age: 22, gender: 'Female', bio: '', interests: [], location: '', job: '', coins: 0 },
  { id: '3', name: 'Jessica', photos: ['https://picsum.photos/100/100?random=12'], age: 26, gender: 'Female', bio: '', interests: [], location: '', job: '', coins: 0 },
];

const MOCK_MESSAGES: Message[] = [
  { id: 'm1', senderId: '1', text: 'Hey! How are you?', timestamp: Date.now() - 100000 },
  { id: 'm2', senderId: 'current', text: 'I am good, just working on a Flutter app 😄', timestamp: Date.now() - 50000 },
];

const Chat: React.FC = () => {
  const [selectedMatch, setSelectedMatch] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  
  // Menu State
  const [menuOpen, setMenuOpen] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [showLowBalance, setShowLowBalance] = useState(false);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'current',
      text: inputText,
      timestamp: Date.now()
    };
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const handleGift = async () => {
    const COST = 20;
    const success = await deductCoins(COST, `Sent gift to ${selectedMatch?.name}`);
    
    if (success) {
      const giftMsg: Message = {
        id: Date.now().toString(),
        senderId: 'current',
        text: 'Sent a Rose 🌹',
        timestamp: Date.now(),
        isGift: true
      };
      setMessages([...messages, giftMsg]);
    } else {
      setShowLowBalance(true);
      setTimeout(() => setShowLowBalance(false), 3000);
    }
  };

  const handleBlock = () => {
    setMenuOpen(false);
    setActionFeedback("User Blocked");
    setTimeout(() => {
        setActionFeedback(null);
        setSelectedMatch(null);
    }, 1500);
  };

  const handleReport = () => {
    setMenuOpen(false);
    setActionFeedback("User Reported");
    setTimeout(() => {
        setActionFeedback(null);
    }, 2000);
  };

  if (selectedMatch) {
    return (
      <div className="h-full flex flex-col bg-white z-50 fixed inset-0">
        {/* Chat Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white relative z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedMatch(null)} className="p-2 -ml-2 hover:bg-gray-50 rounded-full">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="relative">
               <img src={selectedMatch.photos[0]} className="w-10 h-10 rounded-full object-cover" alt="" />
               <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{selectedMatch.name}</h3>
              <p className="text-xs text-green-600">Online</p>
            </div>
          </div>
          
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-full relative z-30">
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Menu Dropdown */}
          {menuOpen && (
            <>
               <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)}></div>
               <div className="absolute top-14 right-4 bg-white shadow-2xl rounded-xl border border-gray-100 py-2 w-48 animate-in slide-in-from-top-2 duration-200 z-30">
                  <button 
                   onClick={handleBlock}
                   className="w-full text-left px-4 py-3 hover:bg-gray-50 text-red-600 font-medium text-sm flex items-center gap-3"
                  >
                    <Ban className="w-4 h-4" /> Block User
                  </button>
                  <button 
                   onClick={handleReport}
                   className="w-full text-left px-4 py-3 hover:bg-gray-50 text-orange-600 font-medium text-sm flex items-center gap-3 border-t border-gray-50"
                  >
                    <Flag className="w-4 h-4" /> Report
                  </button>
               </div>
            </>
          )}
        </div>

        {/* Feedback Toast */}
        {actionFeedback && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-sm font-bold">{actionFeedback}</span>
            </div>
        )}

        {/* Low Balance Alert */}
        {showLowBalance && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4 whitespace-nowrap">
                <AlertCircle className="w-5 h-5 text-white" />
                <span className="text-sm font-bold">Low balance! Recharge Wallet.</span>
            </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50" onClick={() => setMenuOpen(false)}>
           {messages.map((msg) => {
             const isMe = msg.senderId === 'current';
             return (
               <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                   isMe 
                    ? msg.isGift ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-pink-600 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                 }`}>
                    {msg.isGift && <span className="text-xl block mb-1">🎁</span>}
                    <p className="text-sm">{msg.text}</p>
                    <span className={`text-[10px] block text-right mt-1 ${isMe ? 'text-pink-100' : 'text-gray-400'}`}>
                      10:30 AM
                    </span>
                 </div>
               </div>
             );
           })}
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 relative z-10">
           <button onClick={handleGift} className="p-3 bg-yellow-50 text-yellow-600 rounded-full hover:bg-yellow-100 transition flex flex-col items-center">
             <Gift className="w-5 h-5" />
           </button>
           <input 
             type="text" 
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             placeholder="Type a message..."
             className="flex-1 bg-gray-100 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-pink-500/20"
             onKeyPress={(e) => e.key === 'Enter' && handleSend()}
           />
           <button 
             onClick={handleSend}
             className={`p-3 rounded-full transition ${inputText ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-400'}`}
           >
             <Send className="w-5 h-5" />
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 pb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Messages</h1>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search matches" 
            className="w-full bg-gray-100 rounded-xl py-3 pl-10 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-pink-200 transition"
          />
        </div>
      </div>
      
      {/* New Matches Scroll */}
      <div className="pt-4 pb-2 border-b border-gray-100">
         <h2 className="px-6 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">New Matches</h2>
         <div className="flex gap-4 overflow-x-auto px-6 pb-4 no-scrollbar">
            {MOCK_MATCHES.map(match => (
              <div key={match.id} className="flex flex-col items-center flex-shrink-0 cursor-pointer" onClick={() => setSelectedMatch(match)}>
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 to-yellow-500">
                   <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                     <img src={match.photos[0]} className="w-full h-full object-cover" alt="" />
                   </div>
                </div>
                <span className="text-xs font-bold mt-1">{match.name}</span>
              </div>
            ))}
         </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto">
         {MOCK_MATCHES.map((match) => (
           <div 
            key={match.id} 
            onClick={() => setSelectedMatch(match)}
            className="flex items-center gap-4 p-4 px-6 hover:bg-gray-50 cursor-pointer border-b border-gray-50"
           >
             <div className="relative">
                <img src={match.photos[0]} className="w-14 h-14 rounded-full object-cover" alt="" />
                {match.id === '1' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
             </div>
             <div className="flex-1 min-w-0">
               <div className="flex justify-between items-baseline mb-1">
                 <h3 className="font-bold text-gray-900 truncate">{match.name}</h3>
                 <span className="text-xs text-gray-400">2m ago</span>
               </div>
               <p className="text-sm text-gray-500 truncate">Hey! loved your profile photos...</p>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default Chat;