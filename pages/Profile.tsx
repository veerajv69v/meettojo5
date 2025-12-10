import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, Edit3, MapPin, Briefcase, Plus, X, ChevronLeft, CreditCard, User as UserIcon, Heart, Wallet, LogOut, Bell, Shield, HelpCircle, ChevronRight, GraduationCap, Wine, Cigarette, Baby, Star, Globe, BookOpen, Search, ArrowUp, Home, Ruler } from 'lucide-react';
import { mockUser, getCoinBalance } from '../services/supabaseService';
import { motion, AnimatePresence } from 'framer-motion';
import { AppRoute } from '../types';

// --- View Definitions ---
type ProfileView = 'overview' | 'edit' | 'settings';

interface ProfileProps {
  onNavigate: (route: AppRoute) => void;
}

// --- Data & Options ---
const INTERESTS_LIST = [
  'Travel', 'Photography', 'Music', 'Hiking', 'Foodie', 'Art', 'Gaming', 'Gym', 'Yoga', 'Reading', 'Movies', 'Coffee',
  'Cooking', 'Dancing', 'Pets', 'Fashion', 'Tech', 'Politics', 'Volunteering', 'Sports', 'Netflix', 'Outdoors'
];

const OPTIONS: Record<string, string[]> = {
  gender: ['Male', 'Female', 'Non-binary', 'Other'],
  interestedGender: ['Male', 'Female', 'Everyone'],
  exercise: ['Active', 'Sometimes', 'Almost never'],
  educationLevel: ['High School', 'Undergrad', 'Postgrad', 'PhD', 'Trade School'],
  drinking: ['Socially', 'Frequently', 'Never', 'Sober'],
  smoking: ['Socially', 'Regularly', 'Never', 'Trying to quit'],
  lookingFor: ['Relationship', 'Something Casual', 'Don\'t know yet', 'Marriage'],
  kids: ['Want someday', 'Don\'t want', 'Have & want more', 'Have & don\'t want more'],
  starSign: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
  politics: ['Liberal', 'Moderate', 'Conservative', 'Apolitical'],
  religion: ['Agnostic', 'Atheist', 'Christian', 'Muslim', 'Jewish', 'Hindu', 'Buddhist', 'Spiritual', 'Other'],
  languages: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Hindi', 'Arabic', 'Portuguese', 'Russian']
};

const FIELD_ICONS: Record<string, any> = {
  height: Ruler,
  exercise: UserIcon,
  educationLevel: GraduationCap,
  drinking: Wine,
  smoking: Cigarette,
  lookingFor: Search,
  kids: Baby,
  starSign: Star,
  politics: Globe,
  religion: BookOpen,
  languages: Globe,
  hometown: Home,
  work: Briefcase
};

// --- Helper Components ---
const SectionHeader = ({ title }: { title: string }) => (
  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-8 px-1">{title}</h3>
);

const Chip: React.FC<{ label: string; active?: boolean; onClick?: () => void }> = ({ label, active, onClick }) => (
  <button 
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition border active:scale-95 ${
      active 
        ? 'bg-pink-50 text-pink-600 border-pink-200 shadow-sm' 
        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
    }`}
  >
    {label}
  </button>
);

const ListOption = ({ icon: Icon, label, value, onClick }: { icon: any, label: string, value?: string | string[], onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 bg-white border-b border-gray-50 last:border-0 hover:bg-gray-50 transition active:bg-gray-100"
  >
    <div className="flex items-center gap-3 text-gray-700">
      <Icon className="w-5 h-5 text-gray-400" />
      <span className="font-medium text-sm">{label}</span>
    </div>
    <div className="flex items-center gap-2 text-gray-500 max-w-[50%]">
      <span className="text-sm truncate font-medium text-pink-600">
        {Array.isArray(value) ? (value.length > 0 ? value.join(', ') : 'Add') : (value || 'Add')}
      </span>
      <ChevronRight className="w-4 h-4 text-gray-300" />
    </div>
  </button>
);

// --- Main Profile Component ---
const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const [view, setView] = useState<ProfileView>('overview');
  const [user, setUser] = useState<User>(mockUser);

  // Fetch latest balance on mount
  useEffect(() => {
    getCoinBalance().then(balance => {
      setUser(prev => ({ ...prev, coins: balance }));
    });
  }, []);

  const handleUpdateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  // --- OVERVIEW SCREEN ---
  const OverviewScreen = () => (
    <div className="h-full bg-gray-50 overflow-y-auto pb-24 scrollbar-hide">
      {/* Header / Cover */}
      <div className="relative bg-white pb-6 rounded-b-[2.5rem] shadow-sm overflow-hidden z-0">
         <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={() => setView('settings')}
              className="p-2 bg-white/50 backdrop-blur-md rounded-full text-gray-900 hover:bg-white transition shadow-sm"
            >
               <Settings className="w-6 h-6" />
            </button>
         </div>

         <div className="flex flex-col items-center pt-12 px-6">
            <div className="relative mb-5 group">
               <div className="w-36 h-36 rounded-full border-[6px] border-white shadow-2xl overflow-hidden bg-gray-200 relative z-0">
                  {user.photos[0] ? (
                    <img src={user.photos[0]} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                       <UserIcon className="w-16 h-16" />
                    </div>
                  )}
               </div>
               <button 
                 onClick={() => setView('edit')}
                 className="absolute bottom-2 right-2 bg-pink-600 text-white p-3 rounded-full border-4 border-white shadow-lg hover:bg-pink-700 active:scale-90 transition z-10"
               >
                 <Edit3 className="w-4 h-4" />
               </button>
            </div>

            <h1 className="text-3xl font-black text-gray-900 text-center flex items-center gap-2 tracking-tight">
              {user.name}, {user.age}
              <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                <span className="font-bold text-[10px]">✓</span>
              </div>
            </h1>
            <p className="text-gray-500 font-medium flex items-center gap-1.5 mt-2 bg-gray-100 px-3 py-1 rounded-full text-xs">
              <MapPin className="w-3 h-3" /> {user.location || "No Location"}
            </p>
         </div>
      </div>

      <div className="px-5 mt-6 space-y-6 relative z-10">
        {/* Wallet */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
           <div className="flex items-center justify-between relative z-10">
             <div>
               <div className="flex items-center gap-2 mb-2 text-indigo-100">
                  <Wallet className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">My Balance</span>
               </div>
               <div className="text-4xl font-black flex items-baseline gap-1">
                 {user.coins} <span className="text-lg font-medium opacity-80">coins</span>
               </div>
             </div>
             <button 
               onClick={() => onNavigate(AppRoute.WALLET)}
               className="px-6 py-3 bg-white text-indigo-700 font-bold rounded-2xl text-sm shadow-sm active:scale-95 transition hover:bg-indigo-50"
             >
               Get Coins
             </button>
           </div>
        </div>

        {/* Profile Completion */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-gray-900">Profile Completion</h3>
             <span className="text-pink-600 font-bold">85%</span>
           </div>
           <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
             <div className="h-full bg-gradient-to-r from-pink-500 to-rose-500 w-[85%] rounded-full"></div>
           </div>
           <p className="text-xs text-gray-400 mt-3">Add more details to get more matches!</p>
        </div>

        {/* Details & About */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
           <div>
             <div className="flex items-center gap-2 mb-3">
               <UserIcon className="w-5 h-5 text-pink-500" />
               <h3 className="font-bold text-gray-900">About Me</h3>
             </div>
             <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
               {user.bio || "Tap 'Edit Profile' to write a bio."}
             </p>
           </div>
           
           <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
             <div>
               <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Work</span>
               <span className="text-sm font-medium text-gray-900 block truncate">{user.job || "-"}</span>
               <span className="text-xs text-gray-500 block truncate">{user.company}</span>
             </div>
             <div>
               <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Education</span>
               <span className="text-sm font-medium text-gray-900 block truncate">{user.educationLevel || "-"}</span>
               <span className="text-xs text-gray-500 block truncate">{user.school}</span>
             </div>
           </div>
        </div>

        {/* Interests */}
        <div className="flex flex-wrap gap-2 pb-6">
           {user.interests.map((tag) => (
             <span key={tag} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 shadow-sm">
               {tag}
             </span>
           ))}
        </div>
      </div>
    </div>
  );

  // --- EDIT SCREEN ---
  const EditScreen = () => {
    // Local state for the form
    const [formData, setFormData] = useState<User>({ ...user });
    const [activeModal, setActiveModal] = useState<{ field: keyof User | 'photos'; title: string; type: 'single' | 'multi' | 'input' | 'slider' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handlers
    const handleSave = () => {
      handleUpdateUser(formData);
      setView('overview');
    };

    // Photo Handlers
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && formData.photos.length < 6) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setFormData(prev => ({ ...prev, photos: [...prev.photos, reader.result as string] }));
          }
        };
        reader.readAsDataURL(file);
      }
      if (e.target) e.target.value = '';
    };

    const removePhoto = (index: number) => {
      setFormData(prev => {
        const newPhotos = [...prev.photos];
        newPhotos.splice(index, 1);
        return { ...prev, photos: newPhotos };
      });
    };

    const makeMainPhoto = (index: number) => {
      setFormData(prev => {
        const newPhotos = [...prev.photos];
        const [selected] = newPhotos.splice(index, 1);
        newPhotos.unshift(selected);
        return { ...prev, photos: newPhotos };
      });
    };

    // Generic Modal Selector
    const SelectionModal = () => {
      if (!activeModal) return null;

      const options = OPTIONS[activeModal.field as string] || [];
      const currentVal = formData[activeModal.field] as any;

      return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full sm:w-[400px] bg-white rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
             {/* Modal Header */}
             <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">{activeModal.title}</h3>
                <button onClick={() => setActiveModal(null)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X className="w-5 h-5" /></button>
             </div>

             {/* Modal Content */}
             <div className="p-4 overflow-y-auto min-h-[200px]">
                {activeModal.type === 'input' && (
                   <input 
                     type="text" 
                     className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-pink-500 focus:bg-white outline-none font-medium transition"
                     placeholder={`Enter ${activeModal.title}`}
                     value={currentVal || ''}
                     onChange={(e) => setFormData(prev => ({ ...prev, [activeModal.field]: e.target.value }))}
                     autoFocus
                   />
                )}

                {(activeModal.type === 'single' || activeModal.type === 'multi') && (
                  <div className="space-y-2">
                    {options.map(opt => {
                      const isSelected = activeModal.type === 'multi' 
                         ? (currentVal as string[])?.includes(opt)
                         : currentVal === opt;
                      
                      return (
                        <button
                          key={opt}
                          onClick={() => {
                            if (activeModal.type === 'multi') {
                              const arr = (currentVal as string[]) || [];
                              const newArr = arr.includes(opt) ? arr.filter(x => x !== opt) : [...arr, opt];
                              setFormData(prev => ({ ...prev, [activeModal.field]: newArr }));
                            } else {
                              setFormData(prev => ({ ...prev, [activeModal.field]: opt }));
                              setActiveModal(null);
                            }
                          }}
                          className={`w-full p-4 rounded-xl flex items-center justify-between text-left font-medium transition ${
                            isSelected ? 'bg-pink-50 text-pink-700 border border-pink-200' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {opt}
                          {isSelected && <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-white text-[10px]">✓</div>}
                        </button>
                      );
                    })}
                  </div>
                )}
             </div>
             
             {/* Modal Footer (only for inputs/multi) */}
             {(activeModal.type !== 'single') && (
               <div className="p-4 border-t border-gray-100">
                  <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-200">
                    Done
                  </button>
               </div>
             )}
          </div>
        </div>
      );
    };

    return (
      <div className="h-full bg-gray-100 flex flex-col relative">
        {activeModal && <SelectionModal />}

        {/* Sticky Header */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 shadow-sm z-30 sticky top-0">
           <button onClick={() => setView('overview')} className="text-gray-500 font-medium text-sm hover:text-gray-900">
             Cancel
           </button>
           <h2 className="font-bold text-lg text-gray-900">Edit Profile</h2>
           <button onClick={handleSave} className="text-pink-600 font-bold text-sm hover:text-pink-700">
             Save
           </button>
        </div>

        <div className="flex-1 overflow-y-auto">
           {/* Section 1: Photos */}
           <div className="bg-white p-4 mb-3 pb-6">
             <SectionHeader title="Profile Photos" />
             <p className="text-xs text-gray-400 mb-3">Drag to reorder (simulated with 'Make Main') or tap to delete.</p>
             <div className="grid grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`aspect-[2/3] relative rounded-xl overflow-hidden shadow-sm transition-all ${formData.photos[i] ? 'bg-white' : 'bg-gray-100 border-2 border-dashed border-gray-200 hover:border-pink-300'}`}>
                     {formData.photos[i] ? (
                       <div className="group relative w-full h-full">
                         <img src={formData.photos[i]} className="w-full h-full object-cover" alt="" />
                         
                         {/* Photo Actions Overlay */}
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                           <button onClick={() => removePhoto(i)} className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50"><X className="w-4 h-4" /></button>
                           {i !== 0 && (
                             <button onClick={() => makeMainPhoto(i)} className="bg-white text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">Make Main</button>
                           )}
                         </div>

                         {i === 0 && <div className="absolute top-2 left-2 bg-pink-600 text-white px-2 py-0.5 rounded text-[9px] font-bold tracking-wider shadow-sm">MAIN</div>}
                       </div>
                     ) : (
                       <button 
                         onClick={() => fileInputRef.current?.click()}
                         className="w-full h-full flex flex-col items-center justify-center text-gray-300 hover:text-pink-400 transition"
                       >
                         <Plus className="w-8 h-8" />
                       </button>
                     )}
                  </div>
                ))}
             </div>
             <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
           </div>

           {/* Section 2: Bio */}
           <div className="bg-white p-4 mb-3">
             <SectionHeader title="About Me" />
             <textarea 
               value={formData.bio}
               onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
               className="w-full h-28 p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm text-gray-800 placeholder-gray-400 resize-none focus:ring-2 ring-pink-500/10 transition"
               placeholder="Write something interesting about yourself..."
               maxLength={500}
             />
             <div className="text-right text-xs text-gray-400 mt-2">{formData.bio.length}/500</div>
           </div>

           {/* Section 3: My Basics */}
           <div className="bg-white px-4 py-2 mb-3">
             <SectionHeader title="My Basics" />
             <div className="divide-y divide-gray-50">
               <ListOption 
                 icon={Briefcase} 
                 label="Work" 
                 value={`${formData.job || ''} ${formData.company ? `at ${formData.company}` : ''}`} 
                 onClick={() => {
                   // Quick dirty implementation for double input via prompt for MVP, better with custom modal
                   const j = prompt("Job Title", formData.job);
                   if (j !== null) {
                     const c = prompt("Company", formData.company);
                     setFormData(prev => ({ ...prev, job: j, company: c || '' }));
                   }
                 }} 
               />
               <ListOption 
                 icon={GraduationCap} 
                 label="School" 
                 value={formData.school} 
                 onClick={() => setActiveModal({ field: 'school', title: 'School', type: 'input' })} 
               />
               <ListOption 
                 icon={GraduationCap} 
                 label="Education Level" 
                 value={formData.educationLevel} 
                 onClick={() => setActiveModal({ field: 'educationLevel', title: 'Education Level', type: 'single' })} 
               />
               <ListOption 
                 icon={MapPin} 
                 label="Location" 
                 value={formData.location} 
                 onClick={() => setActiveModal({ field: 'location', title: 'Current City', type: 'input' })} 
               />
               <ListOption 
                 icon={Home} 
                 label="Hometown" 
                 value={formData.hometown} 
                 onClick={() => setActiveModal({ field: 'hometown', title: 'Hometown', type: 'input' })} 
               />
               <ListOption 
                 icon={UserIcon} 
                 label="Gender" 
                 value={formData.gender} 
                 onClick={() => setActiveModal({ field: 'gender', title: 'Gender', type: 'single' })} 
               />
               <ListOption 
                 icon={Heart} 
                 label="Interested In" 
                 value={formData.interestedGender} 
                 onClick={() => setActiveModal({ field: 'interestedGender', title: 'Interested In', type: 'single' })} 
               />
             </div>
           </div>

           {/* Section 4: Interests */}
           <div className="bg-white p-4 mb-3">
             <SectionHeader title="My Interests" />
             <div className="flex flex-wrap gap-2 mb-4">
                {formData.interests.map((interest) => (
                  <Chip 
                    key={interest} 
                    label={interest} 
                    active={true}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, interests: prev.interests.filter(i => i !== interest) }));
                    }}
                  />
                ))}
             </div>
             <div className="pt-4 border-t border-gray-50">
               <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Add More</h4>
               <div className="flex flex-wrap gap-2">
                 {INTERESTS_LIST.filter(i => !formData.interests.includes(i)).map(interest => (
                   <Chip 
                      key={interest} 
                      label={`+ ${interest}`} 
                      onClick={() => setFormData(prev => ({ ...prev, interests: [...prev.interests, interest] }))}
                   />
                 ))}
               </div>
             </div>
           </div>

           {/* Section 5: More About Me */}
           <div className="bg-white px-4 py-2 mb-10">
             <SectionHeader title="More About Me" />
             <div className="divide-y divide-gray-50">
               <ListOption icon={Ruler} label="Height" value={formData.height} onClick={() => setActiveModal({ field: 'height', title: 'Height', type: 'input' })} />
               <ListOption icon={UserIcon} label="Exercise" value={formData.exercise} onClick={() => setActiveModal({ field: 'exercise', title: 'Exercise', type: 'single' })} />
               <ListOption icon={Wine} label="Drinking" value={formData.drinking} onClick={() => setActiveModal({ field: 'drinking', title: 'Drinking', type: 'single' })} />
               <ListOption icon={Cigarette} label="Smoking" value={formData.smoking} onClick={() => setActiveModal({ field: 'smoking', title: 'Smoking', type: 'single' })} />
               <ListOption icon={Baby} label="Kids" value={formData.kids} onClick={() => setActiveModal({ field: 'kids', title: 'Kids', type: 'single' })} />
               <ListOption icon={Star} label="Star Sign" value={formData.starSign} onClick={() => setActiveModal({ field: 'starSign', title: 'Star Sign', type: 'single' })} />
               <ListOption icon={Globe} label="Politics" value={formData.politics} onClick={() => setActiveModal({ field: 'politics', title: 'Politics', type: 'single' })} />
               <ListOption icon={BookOpen} label="Religion" value={formData.religion} onClick={() => setActiveModal({ field: 'religion', title: 'Religion', type: 'single' })} />
               <ListOption icon={Search} label="Looking For" value={formData.lookingFor} onClick={() => setActiveModal({ field: 'lookingFor', title: 'Looking For', type: 'single' })} />
               <ListOption icon={Globe} label="Languages" value={formData.languages} onClick={() => setActiveModal({ field: 'languages', title: 'Languages', type: 'multi' })} />
             </div>
           </div>

        </div>
      </div>
    );
  };

  // --- SETTINGS SCREEN (Preserved simple version) ---
  const SettingsScreen = () => (
      <div className="h-full bg-gray-50 flex flex-col">
        <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100 shadow-sm z-20">
           <button onClick={() => setView('overview')} className="p-2 -ml-2 hover:bg-gray-50 rounded-full">
             <ChevronLeft className="w-6 h-6 text-gray-600" />
           </button>
           <h2 className="font-bold text-lg">Settings</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <SectionHeader title="Account Settings" />
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
             {[{ icon: Bell, label: 'Notifications' }, { icon: Shield, label: 'Privacy' }, { icon: HelpCircle, label: 'Help' }].map((item, i) => (
               <div key={i} className="p-4 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3 text-gray-900 font-medium">
                     <item.icon className="w-5 h-5 text-gray-400" /> {item.label}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
               </div>
             ))}
          </div>
          <button className="w-full py-3 bg-white border border-gray-200 text-red-500 font-bold rounded-xl hover:bg-red-50">Log Out</button>
        </div>
      </div>
  );

  return (
    <div className="h-full bg-white relative">
      <AnimatePresence mode="wait">
        {view === 'overview' && <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full"><OverviewScreen /></motion.div>}
        {view === 'edit' && <motion.div key="edit" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="h-full absolute inset-0 bg-white z-20"><EditScreen /></motion.div>}
        {view === 'settings' && <motion.div key="settings" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="h-full absolute inset-0 bg-white z-20"><SettingsScreen /></motion.div>}
      </AnimatePresence>
    </div>
  );
};

export default Profile;