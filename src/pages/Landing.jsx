import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Pill, Activity, Clock, MessageSquare, BarChart, 
  Smartphone, Shield, Zap, CheckCircle, Menu, X, 
  Bell, ChevronRight, Heart, Target, TrendingUp, Brain
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-white/30 dark:bg-black/30 backdrop-blur-md border-slate-200/50 dark:border-slate-800 py-3' : 'bg-transparent border-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="cursor-pointer">
            <Logo size="md" />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium">How it Works</a>
            <a href="#ai-core" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium">AI Core</a>
            <div className="flex items-center gap-4 ml-4">
              <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-primary font-medium transition-colors">Log in</Link>
              <Link to="/register" className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 relative group overflow-hidden">
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-premium opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass absolute top-full left-0 w-full py-4 px-4 flex flex-col gap-2 border-t border-slate-200/50 shadow-xl"
        >
          {['Features', 'How it Works', 'AI Core'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(/ /g, '-')}`} 
              className="text-slate-600 font-medium p-3 rounded-lg hover:bg-slate-50"
              onClick={closeMenu}
            >
              {item}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-3 border-t border-slate-100 mt-2">
            <Link to="/login" className="p-3 text-slate-600 font-medium text-center rounded-lg hover:bg-slate-50" onClick={closeMenu}>Log in</Link>
            <Link to="/register" className="p-3 rounded-xl bg-gradient-premium text-white font-medium text-center shadow-lg" onClick={closeMenu}>Get Started Free</Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 flex items-center">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border-primary/20 text-primary font-medium text-sm mb-6 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Smart Medication Tracker
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
              Smart Reminders <br/>
              For <span className="text-gradient">Missed-Dose</span> <br/>
              AI Prediction
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-lg">
              Easily manage your medication list, get smart reminders tailored to your routine, and use intelligent predictions to help you stay consistent and take every dose on time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="px-8 py-4 rounded-full bg-primary text-white font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 flex items-center justify-center gap-2">
                Get Started <ChevronRight size={20} />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            
            <div className="glass dark:bg-black/30 dark:border-slate-800 rounded-[2.5rem] p-4 lg:p-6 w-full max-w-md shadow-2xl border-white/40 relative">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg">Good Morning</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-500 dark:text-slate-400 text-sm">Adherence Score:</span>
                    <span className="text-emerald-500 font-bold text-sm">92%</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/80 dark:bg-black backdrop-blur-sm flex items-center justify-center relative border border-white/60 dark:border-slate-700 shadow-sm">
                  <Bell size={20} className="text-slate-600 dark:text-slate-300" />
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
                </div>
              </div>

              <div className="bg-gradient-premium rounded-2xl p-5 text-white mb-6 shadow-xl relative overflow-hidden border border-white/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Pill size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">AI Adherence Alert</h4>
                    <p className="text-white/80 text-xs leading-relaxed">We predict a higher risk of missing your 02:00 PM Amoxicillin dose today based on your past weekend patterns. We'll send an extra ping.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Today's Schedule</h4>
                {[
                  { name: 'Vitamin D3', dose: '2000 IU', time: '08:00 AM', status: 'taken' },
                  { name: 'Amoxicillin', dose: '500 mg', time: '02:00 PM', status: 'upcoming' }
                ].map((med, idx) => (
                  <div key={idx} className="relative pl-6">
                    {/* Timeline line */}
                    {idx === 0 && <div className="absolute left-[9px] top-[24px] bottom-[-24px] w-0.5 bg-slate-200"></div>}
                    
                    {/* Timeline Dot */}
                    <div className="absolute left-0 top-[12px] w-[20px] h-[20px] rounded-full border-2 border-white dark:border-slate-800 shadow-sm flex items-center justify-center bg-white dark:bg-black">
                      <div className={`w-2.5 h-2.5 rounded-full ${med.status === 'taken' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                    </div>
                    
                    <div className={`p-4 rounded-2xl flex items-center justify-between transition-all bg-white/80 dark:bg-black border border-white/60 dark:border-slate-700 shadow-sm hover:shadow-md ${med.status === 'taken' ? 'opacity-75' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${med.status === 'taken' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                          {med.status === 'taken' ? <CheckCircle size={16} /> : <Clock size={16} />}
                        </div>
                        <div>
                          <h5 className="font-semibold text-sm text-slate-800 dark:text-white">{med.name}</h5>
                          <p className="text-slate-500 dark:text-slate-400 text-xs">{med.dose}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${med.status === 'taken' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{med.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


const Features = () => {
  const features = [
    { icon: <Clock size={24}/>, title: 'Smart Scheduling', desc: 'AI analyzes your lifestyle to suggest the best times for medication.' },
    { icon: <Brain size={24}/>, title: 'Missed Dose Prediction', desc: 'Predictive algorithms identify when you are likely to forget a dose.' },
    { icon: <Smartphone size={24}/>, title: 'Multi-device Sync', desc: 'Get notifications seamlessly across your phone, tablet, and smartwatch.' },
    { icon: <Pill size={24}/>, title: 'Inventory Tracker', desc: 'Keep track of pill counts and get automatic reminders when it is time to refill.' },
    { icon: <BarChart size={24}/>, title: 'Detailed Analytics', desc: 'Visualize your adherence trends and generate reports to share with your doctor.' },
    { icon: <Heart size={24}/>, title: 'Family Care', desc: 'Manage medication schedules for your children or elderly parents from one account.' }
  ];

  return (
    <section id="features" className="py-24 bg-blue-50/40 dark:bg-transparent backdrop-blur-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">Core Features</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Smarter way to manage your health</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div key={idx} className="glass dark:bg-black/30 dark:border-slate-800 hover:-translate-y-2 transition-all duration-300 rounded-3xl p-8 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                {feat.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{feat.title}</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { number: '01', title: 'Create Account', desc: 'Sign up and set up your secure health profile.' },
    { number: '02', title: 'Add Medications', desc: 'Input your prescriptions, dosages, and frequency.' },
    { number: '03', title: 'AI Optimization', desc: 'Our AI creates the optimal schedule based on your habits.' },
    { number: '04', title: 'Get Reminders', desc: 'Receive smart notifications on any of your devices.' },
    { number: '05', title: 'Track Adherence', desc: 'View your consistency score and predict missed doses.' },
    { number: '06', title: 'Stay Stocked', desc: 'Get automatic alerts when it is time to refill.' }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white/20 dark:bg-transparent backdrop-blur-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">Process</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">How MediMind Works</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="glass dark:bg-black/30 dark:border-slate-800 hover:-translate-y-2 transition-all duration-300 rounded-3xl p-8 group cursor-pointer relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full mb-3 inline-block">{step.number}</span>
                <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{step.title}</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AICore = () => {
  return (
    <section id="ai-core" className="py-24 bg-blue-50/40 dark:bg-transparent backdrop-blur-sm relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">AI Intelligence</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Powered by Advanced Machine Learning</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              MediMind uses state-of-the-art machine learning models to predict missed doses before they happen. By analyzing your behavior patterns, we can intervene at the right moment.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-1">Predictive Adherence Modeling</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Identifies your unique behavior patterns to warn you before you forget a dose.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 border border-blue-100">
                  <Target size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-1">Personalized Intervention</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Sends reminders at the exact moment you are most likely to respond.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 border border-purple-100">
                  <Brain size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-1">Continuous Learning</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">The system gets smarter every day by learning from your daily interactions.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="relative flex justify-center">
            <div className="w-72 h-72 rounded-full bg-gradient-premium opacity-20 blur-3xl absolute"></div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass dark:bg-black/30 dark:border-slate-800 rounded-[2.5rem] p-6 w-full max-w-md shadow-2xl border-white/40 relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-800 dark:text-white">AI Prediction Engine</h4>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">Active</span>
              </div>
              
              <div className="h-48 bg-slate-50/50 dark:bg-black rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary relative"
                >
                  <Brain size={48} />
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping"></div>
                </motion.div>
              </div>
              
              <p className="text-xs text-slate-500 mt-4 text-center">Analyzing historical adherence data to predict future behavior.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};


const CTA = () => {
  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Take Control of Your Health?</h2>
        <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
          Start tracking your medications, predicting missed doses, and managing your health with AI today.
        </p>
        <Link to="/register" className="px-8 py-4 rounded-full bg-white text-slate-900 font-semibold text-lg hover:bg-slate-100 transition-all shadow-lg flex items-center justify-center gap-2 inline-flex hover:-translate-y-1">
          Get Started <ChevronRight size={20} />
        </Link>
      </motion.div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-950 pt-20 pb-10 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Logo size="sm" lightText />
            <p className="mt-4 text-sm text-slate-500 leading-relaxed">
              Smart medication reminders and AI-powered missed-dose prediction to keep you on track.
            </p>
          </div>
          
          {/* Product Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">Process</a></li>
              <li><a href="#ai-core" className="hover:text-white transition-colors">AI Intelligence</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 text-center text-sm">
          <p>© 2026 MediMind, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default function Landing() {
  React.useEffect(() => {
    // Prevent browser from restoring scroll position on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen selection:bg-primary/20 selection:text-primary bg-white dark:bg-black relative overflow-hidden text-slate-800 dark:text-white">
      {/* Global ambient blobs visible across all sections */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] rounded-full bg-blue-300/40 blur-[120px] animate-blob"></div>
        <div className="absolute top-[30%] right-[-5%] w-[45%] h-[45%] rounded-full bg-sky-400/30 blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[10%] left-[20%] w-[45%] h-[45%] rounded-full bg-indigo-300/35 blur-[120px] animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <AICore />
      <CTA />
      <Footer />
    </div>
  );
}
