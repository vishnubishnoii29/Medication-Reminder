import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, CheckCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../config/api';
import Logo from '../../components/Logo';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    
    // Simple strength check
    let strength = 0;
    if (val.length >= 6) strength += 1;
    if (val.match(/[a-z]/) && val.match(/[A-Z]/)) strength += 1;
    if (val.match(/[0-9]/)) strength += 1;
    if (val.match(/[^a-zA-Z0-9]/)) strength += 1;
    
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordStrength < 2) {
      setError('Password is too weak. Add uppercase letters, numbers, or symbols.');
      setLoading(false);
      return;
    }
    
    try {
      // FIX: replaced hardcoded localhost with API_BASE
      const res = await axios.post(`${API_BASE}/api/v1/auth/register`, { name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data));
      navigate('/dashboard');
    } catch (err) {
      // FIX: backend returns { message: '...' }, not { error: '...' }
      setError(err.response?.data?.message || err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-light overflow-hidden">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative bg-slate-50 dark:bg-black text-slate-900 dark:text-white overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-slate-800/20 blur-[100px]"></div>
        <div className="absolute inset-0 dark:bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px]"></div>

        {/* Logo */}
        <Link to="/" className="relative z-10">
          <Logo size="md" lightText />
        </Link>

        {/* Hero Content */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Join the Future of <span className="text-gradient">Healthcare</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
            Create an account to start your journey with AI-powered medication reminders and health insights.
          </p>

          {/* Floating Widget Mockup */}
          <div className="bg-white dark:bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-ai/20 flex items-center justify-center text-ai">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">AI Prediction</p>
              <p className="text-lg font-bold text-white">99.9% Accuracy Rate</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-slate-500">
          © 2026 MediMind, Inc. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-black relative">
        {/* Background Blobs for Mobile */}
        <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[80px] lg:hidden"></div>
        <div className="absolute bottom-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full bg-ai/10 blur-[80px] lg:hidden"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo for Mobile */}
          <Link to="/" className="flex lg:hidden mb-8 justify-center">
            <Logo size="md" />
          </Link>

          <div className="glass dark:bg-slate-900/50 dark:border-slate-800 p-6 sm:p-8 rounded-[2.5rem] shadow-xl border-white/60">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Create Account</h2>
              <p className="text-slate-500 text-sm">Get started with your free account today.</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-2.5 rounded-xl text-sm mb-4 flex items-center gap-2 border border-red-100">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Full Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 dark:bg-slate-800/50 dark:text-white"
                    placeholder="Name"
                    required
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 dark:bg-slate-800/50 dark:text-white"
                    placeholder="name@example.com"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full pl-11 pr-12 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 dark:bg-slate-800/50 dark:text-white"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                <div className="mt-1.5 flex gap-1 h-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div 
                      key={level}
                      className={`h-full flex-1 rounded-full transition-colors ${
                        passwordStrength >= level 
                          ? passwordStrength <= 2 
                            ? 'bg-amber-500' 
                            : 'bg-green-500' 
                          : 'bg-slate-200'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Confirm Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-11 pr-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 ${
                      confirmPassword && confirmPassword !== password ? 'border-red-300' : 'border-slate-200'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
                {/* FIX: live feedback when passwords don't match */}
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-xs text-red-500 mt-1 font-medium">Passwords do not match</p>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs py-1">
                <input type="checkbox" id="terms" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20" required />
                {/* FIX: class → className on both Links */}
                <label htmlFor="terms" className="text-slate-600">I agree to the <Link to="#" className="text-primary hover:text-blue-700 font-medium">Terms</Link> and <Link to="#" className="text-primary hover:text-blue-700 font-medium">Privacy Policy</Link></label>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-premium text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

              <p className="mt-8 text-sm text-slate-600 text-center">
                Already have an account?{' '}
                {/* FIX: class → className */}
                <Link to="/login" className="text-primary hover:text-blue-700 font-semibold transition-colors">Sign in</Link>
              </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
