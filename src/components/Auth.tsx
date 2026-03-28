import React, { useState } from 'react';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../firebase';
import { useTheme } from '../ThemeContext';
import { TRANSLATIONS } from '../constants';
import { LogIn, UserPlus, Mail, Lock, Chrome, AlertCircle, Bus, MapPin, Navigation } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Auth({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const { language } = useTheme();
  const t = TRANSLATIONS[language];
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onAuthSuccess();
    } catch (error: any) {
      console.error("Google Login Error:", error);
      setError(error.message || "Failed to login with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onAuthSuccess();
    } catch (error: any) {
      console.error("Auth Error:", error);
      
      // Map Firebase error codes to user-friendly messages
      let friendlyMessage = "Authentication failed. Please try again.";
      
      switch (error.code) {
        case 'auth/invalid-credential':
          friendlyMessage = isLogin 
            ? "Invalid email or password. Please check your credentials or sign up if you don't have an account."
            : "Invalid credentials provided.";
          break;
        case 'auth/user-not-found':
          friendlyMessage = "No account found with this email. Please sign up first.";
          break;
        case 'auth/wrong-password':
          friendlyMessage = "Incorrect password. Please try again.";
          break;
        case 'auth/email-already-in-use':
          friendlyMessage = "An account already exists with this email. Please log in instead.";
          break;
        case 'auth/weak-password':
          friendlyMessage = "Password should be at least 6 characters.";
          break;
        case 'auth/invalid-email':
          friendlyMessage = "Please enter a valid email address.";
          break;
        case 'auth/operation-not-allowed':
          friendlyMessage = "Email/Password login is currently disabled. Please use Google login or enable it in the Firebase Console.";
          break;
        case 'auth/network-request-failed':
          friendlyMessage = "Network error. Please check your internet connection.";
          break;
        case 'auth/too-many-requests':
          friendlyMessage = "Too many failed attempts. Please try again later.";
          break;
      }
      
      setError(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500">
      {/* Background with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-40 scale-105 transition-opacity duration-500"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2000")' }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-zinc-50 via-zinc-50/80 to-blue-100/20 dark:from-zinc-950 dark:via-zinc-950/80 dark:to-blue-900/20 transition-colors duration-500" />

      {/* Content */}
      <div className="relative z-20 w-full flex flex-col lg:flex-row">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center p-12 xl:p-24 w-1/2 text-zinc-900 dark:text-white transition-colors duration-500">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Navigation size={28} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter">Yathra</h1>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl font-bold leading-tight mb-6"
          >
            Your Smart Companion <br />
            <span className="text-blue-500">for Kerala Commutes.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-zinc-600 dark:text-zinc-400 max-w-lg mb-12"
          >
            Real-time bus tracking, interactive maps, and multi-language support. 
            Join thousands of commuters making their journey easier every day.
          </motion.p>

          <div className="grid grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-zinc-200 dark:border-white/10 p-6 rounded-2xl"
            >
              <Bus className="text-blue-600 dark:text-blue-500 mb-4" size={32} />
              <h3 className="font-bold text-lg mb-1">Live Routes</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-500">Accurate KSRTC and private bus timings.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-zinc-200 dark:border-white/10 p-6 rounded-2xl"
            >
              <MapPin className="text-blue-600 dark:text-blue-500 mb-4" size={32} />
              <h3 className="font-bold text-lg mb-1">Smart Maps</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-500">Interactive navigation with stop alerts.</p>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-12">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-8 lg:p-10"
          >
            <div className="text-center mb-8 lg:hidden">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Navigation className="text-blue-600" size={32} />
                <h1 className="text-3xl font-black tracking-tighter dark:text-white">Yathra</h1>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                {isLogin ? t.login : t.signup}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400">{t.welcome}</p>
            </div>

            <div className="flex gap-2 mb-8 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
              <button
                onClick={() => setIsLogin(true)}
                className={cn(
                  "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all",
                  isLogin ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                )}
              >
                {t.login}
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={cn(
                  "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all",
                  !isLogin ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                )}
              >
                {t.signup}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 text-red-600 dark:text-red-400 text-sm"
                >
                  <AlertCircle className="shrink-0 w-5 h-5" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                    {isLogin ? t.login : t.signup}
                  </>
                )}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                <span className="px-4 bg-white dark:bg-zinc-900 text-zinc-400">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-[0.98]"
            >
              <Chrome className="w-6 h-6 text-blue-600" />
              <span>Google Account</span>
            </button>
            
            <p className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-500">
              By continuing, you agree to Yathra's Terms of Service and Privacy Policy.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
