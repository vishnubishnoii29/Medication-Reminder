import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_BASE } from '../config/api';
import { Settings as SettingsIcon, User, Bell, Shield, Moon, Sun, 
  Smartphone, Globe, Volume2, Database, Key, LogOut, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    sound: true
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${API_BASE}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.status === 'success') {
          const userData = res.data.data;
          setName(userData.name);
          setEmail(userData.email);
          setNotifications(userData.settings?.notifications || { email: true, push: true, sms: false, sound: true });
          
          // Prefer local storage for dark mode to prevent flipping
          const localDark = localStorage.getItem('darkMode');
          if (localDark !== null) {
            setDarkMode(localDark === 'true');
          } else {
            setDarkMode(userData.settings?.theme === 'dark');
          }
        }
      } catch (err) {
        console.error('Failed to fetch user in settings:', err);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Moon size={18} /> },
    { id: 'devices', label: 'Connected Devices', icon: <Smartphone size={18} /> },
    { id: 'privacy', label: 'Privacy & Security', icon: <Shield size={18} /> },
    { id: 'data', label: 'Data Export', icon: <Database size={18} /> }
  ];

  const handleToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="text-primary" size={32} /> Settings & Preferences
        </h1>
        <p className="text-slate-500 font-medium mt-1">Manage your account, personalize your experience, and control your data.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64 space-y-2 shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id 
                  ? 'bg-gradient-premium text-white shadow-lg shadow-primary/20' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-slate-200">
            <button 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
              onClick={async () => {
                const token = localStorage.getItem('token');
                try {
                  await axios.post(`${API_BASE}/api/v1/auth/logout`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                } catch (_) { /* proceed even if server call fails */ }
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
              }}
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glass dark:bg-black dark:border-slate-800 p-8 rounded-3xl border-white/60 shadow-sm min-h-[500px]"
          >
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Profile Information</h2>
                
                <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-premium flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    U
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-semibold transition-colors mb-2">
                      Change Avatar
                    </button>
                    <p className="text-xs text-slate-500 font-medium">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 dark:bg-black dark:text-white" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 dark:bg-black dark:text-white" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">Phone Number</label>
                    <input type="tel" defaultValue="+1 (555) 000-0000" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50" placeholder="Coming soon..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">Timezone</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 text-slate-600">
                      <option>Pacific Time (US & Canada)</option>
                      <option>Eastern Time (US & Canada)</option>
                      <option>Greenwich Mean Time (GMT)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={async () => {
                      const token = localStorage.getItem('token');
                      try {
                        const res = await axios.patch(`${API_BASE}/api/v1/auth/updateMe`, {
                          name,
                          settings: {
                            notifications,
                            theme: darkMode ? 'dark' : 'light'
                          }
                        }, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        if (res.data.status === 'success') {
                          toast.success('Settings updated successfully!');
                          localStorage.setItem('user', JSON.stringify(res.data.data));
                        }
                      } catch (err) {
                        toast.error('Failed to update settings');
                      }
                    }} 
                    className="px-6 py-3 bg-gradient-premium text-white rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Notification Preferences</h2>
                
                <div className="space-y-4">
                  {[
                    { key: 'push', title: 'Push Notifications', desc: 'Receive alerts directly on your device', icon: <Bell size={20} className="text-blue-500" /> },
                    { key: 'email', title: 'Email Alerts', desc: 'Get daily summaries and missed dose warnings via email', icon: <Globe size={20} className="text-purple-500" /> },
                    { key: 'sms', title: 'SMS Reminders', desc: 'Receive critical medication reminders via text message', icon: <Smartphone size={20} className="text-emerald-500" /> },
                    { key: 'sound', title: 'Notification Sounds', desc: 'Play sounds for reminders and alerts', icon: <Volume2 size={20} className="text-amber-500" /> }
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black border border-slate-100 dark:border-slate-700 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-black border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-sm">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white">{item.title}</h4>
                          <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleToggle(item.key)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${notifications[item.key] ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${notifications[item.key] ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Appearance</h2>
                
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Theme Preference</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <button 
                      onClick={() => setDarkMode(false)}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${!darkMode ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300 bg-slate-50'}`}
                    >
                      <Sun size={24} className={!darkMode ? 'text-primary' : 'text-slate-400'} />
                      <span className="font-bold text-slate-700 text-sm">Light</span>
                    </button>
                    <button 
                      onClick={() => setDarkMode(true)}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${darkMode ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300 bg-slate-50'}`}
                    >
                      <Moon size={24} className={darkMode ? 'text-primary' : 'text-slate-400'} />
                      <span className="font-bold text-slate-700 text-sm">Dark</span>
                    </button>
                    <button className="p-4 rounded-2xl border-2 border-slate-200 hover:border-slate-300 bg-slate-50 transition-all flex flex-col items-center gap-3">
                      <Smartphone size={24} className="text-slate-400" />
                      <span className="font-bold text-slate-700 text-sm">System</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs placeholders */}
            {(activeTab === 'devices' || activeTab === 'privacy' || activeTab === 'data') && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                  {tabs.find(t => t.id === activeTab)?.icon}
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Advanced Features Coming Soon</h2>
                <p className="text-slate-500 font-medium max-w-md">This section is currently under development and will be available in the next major update.</p>
              </div>
            )}

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
