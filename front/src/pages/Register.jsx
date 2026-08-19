import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency, ALL_CURRENCIES } from '../context/CurrencyContext';
import {
  Compass, User, Lock, Mail, ArrowRight, ArrowLeft, Camera,
  Check, Sparkles, DollarSign, Utensils, Users as UsersIcon, Search
} from 'lucide-react';
import toast from 'react-hot-toast';

const INTEREST_OPTIONS = [
  'Culture', 'Adventure', 'Gastronomy', 'Relaxation', 'Nature',
  'Nightlife', 'History', 'Photography', 'Shopping', 'Wellness',
];

export default function Register() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { register } = useAuth();
  const { setDefaultCurrency } = useCurrency();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [travelBio, setTravelBio] = useState('');
  const [interests, setInterests] = useState([]);
  const [budgetPreference, setBudgetPreference] = useState('MODERATE');
  const [travelStyle, setTravelStyle] = useState('SOLO');
  const [foodPreference, setFoodPreference] = useState('ANYTHING');
  const [defaultCurrency, setDefaultCurrencyState] = useState('USD');
  const [currencySearch, setCurrencySearch] = useState('');

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setStep(2);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const toggleInterest = (interest) => {
    setInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]));
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      await register({
        name: fullName,
        email,
        password,
        travelBio,
        travelInterests: interests,
        budgetPreference,
        travelStyle,
        foodPreference,
        avatarFile,
      });
      // Save chosen currency to context + localStorage
      setDefaultCurrency(defaultCurrency);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-10 overflow-x-hidden">
      {/* Background — misty mountain landscape */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Warm overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#F5EDE0]/80 via-[#EDE4D3]/60 to-[#D6C9B0]/50" />

      {/* Form Card */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="bg-white rounded-[28px] shadow-xl p-8 sm:p-10 flex flex-col items-center animate-fade-in">
          {/* Header */}
          <div className="w-14 h-14 rounded-[18px] bg-[#F5F7F2] border border-[#E5E5E7]/60 flex items-center justify-center mb-5 shadow-sm">
            <img src="/waymark-logo.png" alt="WayMark Logo" className="w-9 h-9 object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight text-center">
            {step === 1 ? 'Create your Account' : 'Travel Style & Preferences'}
          </h2>
          <p className="text-sm text-[#8B8B8B] mt-2 text-center max-w-sm leading-relaxed">
            {step === 1
              ? 'Join WayMark to plan your trips with intelligent memory-driven insights.'
              : 'This helps our AI tailor recommendations just for you. You can change this anytime.'}
          </p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-5 w-full">
            <div className={`h-1.5 w-12 rounded-full transition-all ${step >= 1 ? 'bg-[#355E4B]' : 'bg-[#E5E5E7]'}`} />
            <div className={`h-1.5 w-12 rounded-full transition-all ${step >= 2 ? 'bg-[#355E4B]' : 'bg-[#E5E5E7]'}`} />
          </div>
          <p className="text-[10px] font-bold text-[#8B8B8B] uppercase tracking-widest mt-2 text-center mb-8">
            Step {step} of 2
          </p>

          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="w-full space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-[#8B8B8B] uppercase tracking-widest mb-2">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#ADADAD] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Vance"
                    className="w-full bg-white border border-[#E5E5E7] text-sm text-[#1A1A1A] placeholder-[#C4C4C4] pl-11 pr-4 py-3.5 rounded-2xl focus:outline-none focus:border-[#355E4B] transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8B8B8B] uppercase tracking-widest mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#ADADAD] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white border border-[#E5E5E7] text-sm text-[#1A1A1A] placeholder-[#C4C4C4] pl-11 pr-4 py-3.5 rounded-2xl focus:outline-none focus:border-[#355E4B] transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8B8B8B] uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#ADADAD] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-white border border-[#E5E5E7] text-sm text-[#1A1A1A] placeholder-[#C4C4C4] pl-11 pr-4 py-3.5 rounded-2xl focus:outline-none focus:border-[#355E4B] transition-colors"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0F2B24] hover:bg-[#0A1F1A] text-white font-semibold text-sm py-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 mt-4"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="w-full space-y-6">
              {/* Avatar upload */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-24 h-24 rounded-full bg-[#F5F7F2] border-2 border-[#E5E5E7] border-dashed flex items-center justify-center overflow-hidden hover:border-[#355E4B] transition-all group"
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-[#ADADAD]" />
                  )}
                  <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-6 h-6 text-[#1A1A1A]" />
                  </div>
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                <p className="text-xs text-[#8B8B8B] mt-3">Upload a profile photo (optional)</p>
              </div>

              {/* Travel bio */}
              <div>
                <label className="block text-[10px] font-bold text-[#8B8B8B] uppercase tracking-widest mb-2">Your Travel Bio</label>
                <textarea
                  value={travelBio}
                  onChange={(e) => setTravelBio(e.target.value)}
                  placeholder="e.g. Passionate explorer who loves hidden cultural gems and street food..."
                  className="w-full bg-white border border-[#E5E5E7] text-sm text-[#1A1A1A] placeholder-[#C4C4C4] p-4 rounded-2xl h-24 focus:outline-none focus:border-[#355E4B] transition-all resize-none"
                  maxLength={500}
                />
              </div>

              {/* Interests */}
              <div>
                <label className="block text-[10px] font-bold text-[#8B8B8B] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#355E4B]" /> Points of Interest
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        interests.includes(interest)
                          ? 'bg-[#EAF5EA] text-[#355E4B] border-[#355E4B]/40'
                          : 'bg-white border-[#E5E5E7] text-[#8B8B8B] hover:border-[#355E4B]/50 hover:text-[#1A1A1A]'
                      }`}
                    >
                      {interests.includes(interest) && <Check className="w-3 h-3 inline mr-1" />}
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferences row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#8B8B8B] uppercase tracking-widest mb-2 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" /> Budget
                  </label>
                  <select
                    value={budgetPreference}
                    onChange={(e) => setBudgetPreference(e.target.value)}
                    className="w-full bg-white border border-[#E5E5E7] text-sm text-[#1A1A1A] p-3 rounded-xl focus:outline-none focus:border-[#355E4B]"
                  >
                    <option value="BUDGET">Budget</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="LUXURY">Luxury</option>
                    <option value="ULTRA_LUXURY">Ultra Luxury</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#8B8B8B] uppercase tracking-widest mb-2 flex items-center gap-1">
                    <UsersIcon className="w-3 h-3" /> Style
                  </label>
                  <select
                    value={travelStyle}
                    onChange={(e) => setTravelStyle(e.target.value)}
                    className="w-full bg-white border border-[#E5E5E7] text-sm text-[#1A1A1A] p-3 rounded-xl focus:outline-none focus:border-[#355E4B]"
                  >
                    <option value="SOLO">Solo</option>
                    <option value="COUPLE">Couple</option>
                    <option value="FAMILY">Family</option>
                    <option value="FRIENDS">Friends</option>
                    <option value="BUSINESS">Business</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#8B8B8B] uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Utensils className="w-3 h-3" /> Food
                  </label>
                  <select
                    value={foodPreference}
                    onChange={(e) => setFoodPreference(e.target.value)}
                    className="w-full bg-white border border-[#E5E5E7] text-sm text-[#1A1A1A] p-3 rounded-xl focus:outline-none focus:border-[#355E4B]"
                  >
                    <option value="ANYTHING">Anything</option>
                    <option value="VEGETARIAN">Vegetarian</option>
                    <option value="VEGAN">Vegan</option>
                    <option value="HALAL">Halal</option>
                    <option value="KOSHER">Kosher</option>
                  </select>
                </div>
              </div>

              {/* Default Currency */}
              <div>
                <label className="block text-[10px] font-bold text-[#8B8B8B] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#355E4B]" />
                  Default Currency
                </label>

                {/* Selected preview chip */}
                {(() => {
                  const sel = ALL_CURRENCIES.find((c) => c.code === defaultCurrency);
                  return sel ? (
                    <div className="flex items-center gap-3 mb-3 p-3 bg-[#F5F7F2] rounded-xl border border-[#355E4B]/10">
                      <span className="text-xl">{sel.flag}</span>
                      <span className="text-[#1A1A1A] text-sm font-bold">{sel.symbol} {sel.code}</span>
                      <span className="text-[#8B8B8B] text-xs">{sel.name}</span>
                    </div>
                  ) : null;
                })()}

                {/* Search box */}
                <div className="flex items-center gap-2 bg-white border border-[#E5E5E7] rounded-xl px-4 py-1 mb-2 focus-within:border-[#355E4B] transition-colors">
                  <Search className="w-4 h-4 text-[#ADADAD] shrink-0" />
                  <input
                    value={currencySearch}
                    onChange={(e) => setCurrencySearch(e.target.value)}
                    placeholder="Search currency..."
                    className="bg-transparent text-[#1A1A1A] text-sm py-2.5 focus:outline-none flex-1 placeholder:text-[#C4C4C4]"
                  />
                </div>

                {/* Currency list */}
                <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1 rounded-xl bg-white border border-[#E5E5E7] p-2">
                  {ALL_CURRENCIES.filter(
                    (c) =>
                      c.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
                      c.name.toLowerCase().includes(currencySearch.toLowerCase())
                  ).map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => { setDefaultCurrencyState(c.code); setCurrencySearch(''); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                        defaultCurrency === c.code
                          ? 'bg-[#EAF5EA] text-[#355E4B]'
                          : 'text-[#8B8B8B] hover:bg-[#F5F7F2] hover:text-[#1A1A1A]'
                      }`}
                    >
                      <span className="text-lg">{c.flag}</span>
                      <span className="text-sm font-semibold">{c.code}</span>
                      <span className="text-xs opacity-70 flex-1">{c.name}</span>
                      <span className="text-sm font-bold">{c.symbol}</span>
                      {defaultCurrency === c.code && <Check className="w-4 h-4 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center gap-1.5 bg-[#F5F7F2] text-[#1A1A1A] text-sm font-semibold px-5 py-4 rounded-2xl hover:bg-[#E5E5E7] transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={loading}
                  className="flex-1 bg-[#0F2B24] hover:bg-[#0A1F1A] text-white font-semibold text-sm py-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <span>{loading ? 'Creating Account...' : 'Get Started'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 text-center border-t border-[#E5E5E7] w-full pt-6">
            <p className="text-xs text-[#8B8B8B]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#0F2B24] hover:underline font-bold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
