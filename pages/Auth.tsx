import React, { useState } from 'react';
import { Heart, Mail, Lock, ArrowRight, ArrowLeft, Phone, User as UserIcon, AlertCircle, Loader2, Check } from 'lucide-react';

interface AuthProps {
  onComplete: () => void;
}

const Auth: React.FC<AuthProps> = ({ onComplete }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState(1); // 1: Creds, 2: Personal, 3: Preferences
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [gender, setGender] = useState('');
  const [interestedGender, setInterestedGender] = useState('');
  const [bio, setBio] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onComplete();
    }, 1000);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === 1) {
      if (!validateEmail(email)) {
        setError("Please enter a valid email address.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
    }

    if (step === 2) {
      if (!firstName.trim() || !lastName.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (phone.length < 10) {
        setError("Please enter a valid phone number.");
        return;
      }
    }

    setStep(step + 1);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!gender) {
      setError("Please select your gender.");
      return;
    }
    if (!interestedGender) {
      setError("Please select who you are interested in.");
      return;
    }
    if (bio.length < 10) {
      setError("Please write a bit more about yourself (min 10 chars).");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onComplete();
    }, 1500);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setStep(1);
    setError(null);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-white text-gray-900 overflow-y-auto relative">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="w-20 h-20 bg-pink-500 rounded-3xl flex items-center justify-center shadow-xl shadow-pink-200 mb-6 rotate-3">
             <Heart className="w-10 h-10 text-white fill-current" />
           </div>
           <h1 className="text-3xl font-black tracking-tight text-gray-900">Meettojo</h1>
           <p className="text-gray-500 mt-2 font-medium">Find your perfect match</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* --- LOGIN VIEW --- */}
        {!isSignUp && (
          <form onSubmit={handleSignIn} className="space-y-4 animate-in fade-in duration-300">
             <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 flex items-center gap-3 focus-within:ring-2 ring-pink-500/20 focus-within:border-pink-500/50 transition duration-300 group">
                  <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="bg-transparent w-full outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 flex items-center gap-3 focus-within:ring-2 ring-pink-500/20 focus-within:border-pink-500/50 transition duration-300 group">
                  <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                  <input 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="bg-transparent w-full outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400"
                  />
                </div>
             </div>

             <button 
               type="submit" 
               disabled={loading}
               className="w-full bg-pink-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-200 active:scale-[0.98] transition hover:bg-pink-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
             >
               {loading && <Loader2 className="w-5 h-5 animate-spin" />}
               {loading ? 'Signing In...' : 'Sign In'}
             </button>

             <div className="text-center pt-6">
               <span className="text-gray-500 text-sm">New to Meettojo? </span>
               <button type="button" onClick={toggleMode} className="text-pink-600 font-bold text-sm hover:underline">Sign Up</button>
             </div>
          </form>
        )}

        {/* --- SIGN UP FLOW --- */}
        {isSignUp && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            {/* Step Indicators */}
            <div className="flex gap-2 mb-8 justify-center">
               {[1, 2, 3].map(i => (
                 <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step >= i ? 'bg-pink-500' : 'bg-gray-100'}`} />
               ))}
            </div>

            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Account Details</h2>
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 flex items-center gap-3 focus-within:ring-2 ring-pink-500/20 focus-within:border-pink-500/50 transition">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <input type="email" placeholder="Email (Gmail)" value={email} onChange={e => setEmail(e.target.value)} className="bg-transparent w-full outline-none text-sm font-medium" />
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 flex items-center gap-3 focus-within:ring-2 ring-pink-500/20 focus-within:border-pink-500/50 transition">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <input type="password" placeholder="Create Password" value={password} onChange={e => setPassword(e.target.value)} className="bg-transparent w-full outline-none text-sm font-medium" />
                </div>
                <button type="submit" className="w-full bg-pink-600 text-white font-bold py-4 rounded-xl mt-6 shadow-lg shadow-pink-200">Next Step</button>
                <button type="button" onClick={toggleMode} className="w-full text-gray-500 font-medium py-3 mt-2 hover:text-gray-900">Back to Login</button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                 <h2 className="text-xl font-bold mb-4 text-gray-900">Personal Info</h2>
                 <div className="flex gap-3">
                   <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 flex-1 focus-within:ring-2 ring-pink-500/20 focus-within:border-pink-500/50 transition">
                     <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} className="bg-transparent w-full outline-none text-sm font-medium" />
                   </div>
                   <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 flex-1 focus-within:ring-2 ring-pink-500/20 focus-within:border-pink-500/50 transition">
                     <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} className="bg-transparent w-full outline-none text-sm font-medium" />
                   </div>
                 </div>
                 <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 flex items-center gap-3 focus-within:ring-2 ring-pink-500/20 focus-within:border-pink-500/50 transition">
                   <Phone className="w-5 h-5 text-gray-400" />
                   <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="bg-transparent w-full outline-none text-sm font-medium" />
                 </div>
                 <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setStep(1)} className="p-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition"><ArrowLeft className="w-5 h-5" /></button>
                    <button type="submit" className="flex-1 bg-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-200">Next Step</button>
                 </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleFinalSubmit} className="space-y-5">
                 <h2 className="text-xl font-bold mb-2 text-gray-900">About You</h2>
                 
                 {/* Gender Selection */}
                 <div>
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">I am a</label>
                   <div className="flex gap-2 mt-2">
                     {['Male', 'Female', 'Other'].map(g => (
                       <button 
                        type="button" 
                        key={g} 
                        onClick={() => setGender(g)} 
                        className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all duration-200 ${gender === g ? 'bg-pink-600 text-white border-pink-600 shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                       >
                         {g}
                       </button>
                     ))}
                   </div>
                 </div>

                 {/* Interested In */}
                 <div>
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Interested in</label>
                   <div className="flex gap-2 mt-2">
                     {['Male', 'Female', 'Everyone'].map(g => (
                       <button 
                        type="button" 
                        key={g} 
                        onClick={() => setInterestedGender(g)} 
                        className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all duration-200 ${interestedGender === g ? 'bg-pink-600 text-white border-pink-600 shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                       >
                         {g}
                       </button>
                     ))}
                   </div>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1 mb-2 block">About Me</label>
                    <textarea 
                      placeholder="I love hiking and coffee..."
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      className="w-full h-28 bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none text-sm font-medium resize-none focus:ring-2 ring-pink-500/20 focus:border-pink-500/50 transition placeholder:text-gray-400"
                    />
                 </div>

                 <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setStep(2)} className="p-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition"><ArrowLeft className="w-5 h-5" /></button>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="flex-1 bg-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-200 flex items-center justify-center gap-2"
                    >
                      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                      Complete Profile
                    </button>
                 </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Auth;