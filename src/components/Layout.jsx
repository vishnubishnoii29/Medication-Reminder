import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Pill, Activity, Clock, MessageSquare, BarChart2, 
  Settings, LogOut, Menu, X, Bell, Moon, Sun, Search,
  Plus, MessageCircle, ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import Logo from './Logo';
import axios from 'axios';
import { API_BASE } from '../config/api';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    if (saved !== null) return saved === 'true';
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
  });
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [user, setUser] = useState({ name: 'User' });
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('user_notifications');
    if (saved) return JSON.parse(saved);
    return [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [medicines, setMedicines] = useState([]);

  const faqs = [
    { title: 'How to add a medicine?', link: '/medicines' },
    { title: 'How to enable dark mode?', link: '/settings' },
    { title: 'What is adherence rate?', link: '/analytics' },
    { title: 'How to use chatbot?', link: '/chatbot' }
  ];

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('user_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Real-time reminder alerts via Socket.io → add to notifications panel
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const socket = io(API_BASE, { auth: { token } });
    socket.on('reminder_alert', (data) => {
      setNotifications(prev => [
        {
          id: `alert-${Date.now()}`,
          text: `🔔 ${data.title}`,
          desc: data.message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false
        },
        ...prev
      ]);
    });
    return () => socket.close();
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  useEffect(() => {
    const fetchRemindersAndMeds = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        // Fetch Medicines
        const medsRes = await axios.get(`${API_BASE}/api/v1/medicines`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (medsRes.data.status === 'success') {
          setMedicines(medsRes.data.data);
        }

        // Fetch Reminders
        const remindersRes = await axios.get(`${API_BASE}/api/v1/reminders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (remindersRes.data.status === 'success') {
          const fetchedReminders = remindersRes.data.data;
          
          // Map reminders to notifications
          const reminderNotifications = fetchedReminders.map(rem => ({
            id: rem._id,
            text: `Time to take: ${rem.title}`,
            time: rem.time,
            read: false
          }));

          // Merge with existing notifications from localStorage (to preserve read status)
          const saved = JSON.parse(localStorage.getItem('user_notifications') || '[]');
          
          const merged = reminderNotifications.map(n => {
            const savedN = saved.find(s => s.id === n.id);
            return savedN ? { ...n, read: savedN.read } : n;
          });

          setNotifications(merged);
        }
      } catch (err) {
        console.error('Failed to fetch data in layout:', err);
      }
    };
    fetchRemindersAndMeds();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    
    // Search Medicines
    const filteredMeds = medicines.filter(med => 
      med.name.toLowerCase().includes(query)
    ).map(med => ({ title: med.name, type: 'Medicine', link: '/medicines' }));
    
    // Search FAQs
    const filteredFAQs = faqs.filter(faq => 
      faq.title.toLowerCase().includes(query)
    ).map(faq => ({ title: faq.title, type: 'Help', link: faq.link }));
    
    setSearchResults([...filteredMeds, ...filteredFAQs]);
  }, [searchQuery, medicines]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (savedUser.name) setUser(savedUser);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleSidebar = () => {
    const newValue = !sidebarOpen;
    setSidebarOpen(newValue);
    localStorage.setItem('sidebarOpen', newValue);
  };

  const navItems = [
    { icon: <Activity size={18} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Pill size={18} />, label: 'Medicines', path: '/medicines' },
    { icon: <Clock size={18} />, label: 'Reminders', path: '/reminders' },
    { icon: <BarChart2 size={18} />, label: 'Analytics', path: '/analytics', badge: 'AI' },
    { icon: <MessageSquare size={18} />, label: 'Chatbot', path: '/chatbot' },
  ];

  return (
    <div className={`min-h-screen flex overflow-hidden transition-colors duration-300 text-slate-800 dark:text-white relative`}>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 lg:relative ${sidebarOpen ? 'w-64' : 'w-24'} bg-white dark:bg-black text-slate-800 dark:text-white flex flex-col justify-between shadow-2xl shrink-0 overflow-hidden transition-all duration-300 border-r border-slate-100 dark:border-slate-800`}
      >
            <div>
              <div className={`flex flex-row items-center ${sidebarOpen ? 'gap-4 p-4' : 'gap-1 px-2 py-4'} border-b border-slate-100 dark:border-slate-800`}>
                <button onClick={toggleSidebar} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1 group flex justify-center items-center w-8 h-8 shrink-0">
                  <Menu size={20} />
                </button>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                  <Logo size="sm" iconOnly={!sidebarOpen} lightText />
                </div>
              </div>

              <nav className="p-4 space-y-1">
                {navItems.map((item, idx) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button 
                      key={idx} 
                      onClick={() => {
                        navigate(item.path);
                        if (isMobile) setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} p-3 rounded-xl font-medium text-sm transition-all ${
                        isActive 
                          ? 'bg-gradient-premium text-white shadow-lg shadow-primary/20' 
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
                      }`}
                      title={!sidebarOpen ? item.label : ''}
                    >
                      <div className={`flex items-center ${sidebarOpen ? 'gap-3' : 'gap-0'}`}>
                        {item.icon}
                        {sidebarOpen && <span className="ml-3">{item.label}</span>}
                      </div>
                      {sidebarOpen && item.badge && (
                        <span className="px-1.5 py-0.5 text-xs bg-cyan-500 text-white rounded-full font-bold">{item.badge}</span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className={`p-4 border-t border-slate-100 dark:border-slate-800 space-y-1 ${sidebarOpen ? '' : 'flex flex-col items-center'}`}>
              <button 
                onClick={() => { navigate('/settings'); if(isMobile) setSidebarOpen(false); }} 
                className={`w-full flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'} p-3 rounded-xl font-medium text-sm transition-colors ${location.pathname === '/settings' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                title={!sidebarOpen ? 'Settings' : ''}
              >
                <Settings size={18} /> {sidebarOpen && <span className="ml-3">Settings</span>}
              </button>
              <button 
                onClick={handleLogout}
                className={`w-full flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'} p-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 font-medium text-sm transition-colors`}
                title={!sidebarOpen ? 'Logout' : ''}
              >
                <LogOut size={18} /> {sidebarOpen && <span className="ml-3">Logout</span>}
              </button>
            </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto max-h-screen relative bg-white dark:bg-black">
        
        {/* Top Navbar */}
        <header className={`sticky top-0 z-40 bg-white/10 dark:bg-black/10 backdrop-blur-md border-b border-white/20 dark:border-slate-800/50 p-4 flex justify-between items-center transition-colors duration-300`}>
          <div className="flex items-center gap-4">

            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Search anything..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm w-64"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              
              {searchResults.length > 0 && (
                <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50">
                  {searchResults.map((result, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => { navigate(result.link); setSearchQuery(''); }} 
                      className="w-full flex items-center justify-between px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-left"
                    >
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white">{result.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{result.type}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/medicines')} className="hidden md:flex px-4 py-2 bg-gradient-premium text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all items-center gap-2 hover:-translate-y-0.5">
              <Plus size={16} /> Add Medicine
            </button>
            
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
            </button>

            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)} 
                className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 relative cursor-pointer transition-colors"
              >
                <Bell size={18} className="text-slate-600 dark:text-slate-400" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">Notifications</h4>
                    {notifications.some(n => !n.read) && (
                      <span onClick={markAllRead} className="text-xs text-primary font-semibold cursor-pointer hover:underline">Mark all read</span>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                        No notifications
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div key={notification.id} className={`px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-start gap-2 ${notification.read ? 'opacity-60' : 'bg-primary/5 dark:bg-primary/10'}`}>
                          <div className="flex-1">
                            <p className={`text-sm ${notification.read ? 'text-slate-600 dark:text-slate-400' : 'font-semibold text-slate-800 dark:text-white'}`}>{notification.text}</p>
                            {notification.desc && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{notification.desc}</p>}
                            {notification.time && <p className="text-xs text-slate-400 mt-0.5">{notification.time}</p>}
                          </div>
                          {!notification.read && (
                            <button 
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-primary font-semibold hover:underline shrink-0"
                            >
                              Read
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative border-l pl-4 border-slate-200 dark:border-slate-700">
              <button 
                onClick={() => setProfileMenuOpen(!profileMenuOpen)} 
                className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 p-1 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-premium flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
                  {user.name ? user.name[0] : 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold">{user.name || 'User'}</p>
                </div>
              </button>
              
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50">
                  <button onClick={() => { navigate('/settings'); setProfileMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-left">
                    <Settings size={16} /> Settings
                  </button>
                  <button onClick={() => { handleLogout(); setProfileMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full relative">
          {children}
        </main>

      </div>
      
      {/* Floating Chatbot Button - only show if not on chatbot page */}
      {location.pathname !== '/chatbot' && (
        <button 
          onClick={() => navigate('/chatbot')}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-premium text-white rounded-full flex items-center justify-center shadow-xl shadow-primary/30 hover:shadow-primary/40 transition-all hover:scale-110 group z-50"
        >
          <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default Layout;
