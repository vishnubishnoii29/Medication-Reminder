import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../config/api';
import Logo from '../../components/Logo';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await axios.post(`${API_BASE}/api/v1/auth/forgotpassword`, { email });
      setSuccess(res.data.message || 'Reset link sent! Check your email.');
    } catch (err) {
      // FIX: backend returns { message: '...' }, not { error: '...' }
      setError(err.response?.data?.message || err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-light overflow-hidden">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/30 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-ai/30 blur-[100px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]"></div>

        <div className="flex items-center gap-2 relative z-10">
          <Logo size="md" lightText />
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Account <span className="text-gradient">Recovery</span>
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            Don't worry! It happens. Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="relative z-10 text-sm text-slate-500">
          © 2026 MediMind, Inc. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-light relative">
        <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[80px] lg:hidden"></div>
        <div className="absolute bottom-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full bg-ai/10 blur-[80px] lg:hidden"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2 lg:hidden mb-8 justify-center">
            <Logo size="md" />
          </div>

          <div className="glass p-8 sm:p-10 rounded-[2.5rem] shadow-xl border-white/60">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Forgot Password?</h2>
              <p className="text-slate-500">No worries, we'll send you reset instructions.</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 flex items-center gap-2 border border-red-100">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm mb-6 flex items-center gap-2 border border-green-100">
                <CheckCircle size={16} />
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50"
                    placeholder="name@example.com"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-premium text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Send Reset Link <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-600">
                Remember your password?{' '}
                {/* FIX: class → className */}
                <Link to="/login" className="text-primary hover:text-blue-700 font-semibold transition-colors">Sign in</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
