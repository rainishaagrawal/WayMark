import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Lock, Mail, ArrowRight, Eye, EyeOff, X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot Password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [fpEmail, setFpEmail] = useState('');
  const [fpLoading, setFpLoading] = useState(false);
  const [fpSent, setFpSent] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!fpEmail) {
      toast.error('Please enter your email address');
      return;
    }
    setFpLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: fpEmail });
      setFpSent(true);
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setFpLoading(false);
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setFpEmail('');
    setFpSent(false);
    setFpLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background — misty mountain landscape */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Warm overlay to give that golden-hour misty feel */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#F5EDE0]/80 via-[#EDE4D3]/60 to-[#D6C9B0]/50" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-[28px] shadow-xl p-10 flex flex-col items-center">

          {/* Logo */}
          <div className="w-14 h-14 rounded-[18px] bg-[#F5F7F2] border border-[#E5E5E7]/60 flex items-center justify-center mb-5 shadow-sm">
            <Compass className="w-7 h-7 text-[#355E4B]" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight text-center">
            Welcome to <span className="text-[#355E4B]">VoyageAI</span>
          </h1>
          <p className="text-sm text-[#8B8B8B] mt-2 text-center leading-relaxed max-w-xs">
            Sign in to access your AI travel itineraries, memories & Travel DNA.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full mt-8 space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-[#8B8B8B] uppercase tracking-widest mb-2">
                Email Address
              </label>
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

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-[#8B8B8B] uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#ADADAD] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#E5E5E7] text-sm text-[#1A1A1A] placeholder-[#C4C4C4] pl-11 pr-12 py-3.5 rounded-2xl focus:outline-none focus:border-[#355E4B] transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ADADAD] hover:text-[#1A1A1A] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Forgot Password link */}
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-[#355E4B] hover:text-[#0F2B24] font-medium transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F2B24] hover:bg-[#0A1F1A] text-white font-semibold text-sm py-4 rounded-2xl transition-all flex items-center justify-center gap-2.5 mt-2 disabled:opacity-60 shadow-md"
            >
              <span>{loading ? 'Signing in...' : 'Sign In to Dashboard'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-xs text-[#8B8B8B] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#0F2B24] font-bold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* ===== Forgot Password Modal ===== */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeForgotModal}
          />

          {/* Modal Card */}
          <div className="relative z-10 w-full max-w-sm bg-white rounded-[24px] shadow-2xl p-8 animate-fade-in">
            {/* Close button */}
            <button
              onClick={closeForgotModal}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F7F2] hover:bg-[#E5E5E7] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-[#8B8B8B]" />
            </button>

            {!fpSent ? (
              <>
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-[#EAF5EA] flex items-center justify-center mb-5">
                  <Lock className="w-5 h-5 text-[#355E4B]" />
                </div>

                <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">Reset Password</h3>
                <p className="text-xs text-[#8B8B8B] mb-6 leading-relaxed">
                  Enter your account email and we'll send you a secure link to reset your password.
                </p>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#8B8B8B] uppercase tracking-widest mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#ADADAD] absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={fpEmail}
                        onChange={(e) => setFpEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-white border border-[#E5E5E7] text-sm text-[#1A1A1A] placeholder-[#C4C4C4] pl-11 pr-4 py-3.5 rounded-2xl focus:outline-none focus:border-[#355E4B] transition-colors"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={fpLoading}
                    className="w-full bg-[#0F2B24] hover:bg-[#0A1F1A] text-white font-semibold text-sm py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {fpLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>

                <button
                  onClick={closeForgotModal}
                  className="w-full text-center text-xs text-[#8B8B8B] hover:text-[#1A1A1A] mt-4 transition-colors"
                >
                  Back to Sign In
                </button>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="flex flex-col items-center text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-[#EAF5EA] flex items-center justify-center mb-5">
                    <CheckCircle className="w-8 h-8 text-[#355E4B]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Check Your Inbox</h3>
                  <p className="text-xs text-[#8B8B8B] leading-relaxed mb-2">
                    We've sent a password reset link to
                  </p>
                  <p className="text-sm font-semibold text-[#0F2B24] mb-6">{fpEmail}</p>
                  <p className="text-[11px] text-[#ADADAD]">
                    Didn't receive it? Check your spam folder or{' '}
                    <button
                      onClick={() => setFpSent(false)}
                      className="text-[#355E4B] font-medium hover:underline"
                    >
                      try again
                    </button>
                    .
                  </p>
                  <button
                    onClick={closeForgotModal}
                    className="w-full mt-6 bg-[#F5F7F2] hover:bg-[#E5E5E7] text-[#0F2B24] font-semibold text-sm py-3.5 rounded-2xl transition-all"
                  >
                    Back to Sign In
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
