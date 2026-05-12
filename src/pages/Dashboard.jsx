import { useState, useEffect } from 'react';

import { 
  Brain, Pill, Activity, Clock, 
  CheckCircle, AlertTriangle, MoreVertical
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import axios from 'axios';
import { API_BASE } from '../config/api';

// Mock Data for fallback and charts
const weeklyAdherenceData = [
  { name: 'Mon', percentage: 100 },
  { name: 'Tue', percentage: 75 },
  { name: 'Wed', percentage: 100 },
  { name: 'Thu', percentage: 50 },
  { name: 'Fri', percentage: 100 },
  { name: 'Sat', percentage: 100 },
  { name: 'Sun', percentage: 90 },
];

const medicineDistribution = [
  { name: 'Vitamins', value: 40, color: '#2563EB' },
  { name: 'Antibiotics', value: 30, color: '#7C3AED' },
  { name: 'Supplements', value: 20, color: '#06B6D4' },
  { name: 'Others', value: 10, color: '#F43F5E' },
];

const Dashboard = () => {
  const [user, setUser] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    return savedUser.name ? savedUser : { name: 'User' };
  });
  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState([]);
  const [stats, setStats] = useState(null);
  const [prediction, setPrediction] = useState(null);

  // Bug #15 fix: dynamic time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      try {
        // 1. Fetch User Profile
        const userRes = await axios.get(`${API_BASE}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (mounted && userRes.data.status === 'success') setUser(userRes.data.data);

        // 2. Fetch Medicines
        const medsRes = await axios.get(`${API_BASE}/api/v1/medicines`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (mounted && medsRes.data.status === 'success') setMedicines(medsRes.data.data);

        // 3. Fetch Stats
        const statsRes = await axios.get(`${API_BASE}/api/v1/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (mounted && statsRes.data.status === 'success') setStats(statsRes.data.data);

        // 4. Fetch Prediction
        const predictRes = await axios.post(`${API_BASE}/api/v1/analytics/predict`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (mounted && predictRes.data.status === 'success') setPrediction(predictRes.data.data.prediction);

      } catch (err) {
        if (mounted) {
          console.error('Failed to fetch dashboard data:', err);
          // Fallback to mock medicines if fetch fails
          setMedicines([
            { _id: '1', name: 'Vitamin D3', dosage: '2000 IU', reminderTimes: ['08:00 AM'], status: 'taken', type: 'Supplement', instruction: 'After meal' },
            { _id: '2', name: 'Amoxicillin', dosage: '500 mg', reminderTimes: ['02:00 PM'], status: 'pending', type: 'Antibiotic', instruction: 'Before meal' },
          ]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="rounded-3xl p-6 relative overflow-hidden bg-gradient-premium opacity-90 text-white shadow-xl shadow-primary/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 max-w-2xl">
          <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm mb-4 inline-block">SYSTEM STATUS: ACTIVE</span>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-2">{getGreeting()}, {user.name}!</h2>
          <p className="text-white/80 font-medium max-w-lg text-sm md:text-base">
            Your AI health assistant has analyzed your data. You have a <span className="font-bold text-cyan-200">{stats?.adherence_rate ? `${stats.adherence_rate}%` : '--'}</span> adherence rate this week. Keep it up!
          </p>
        </div>
        {/* Abstract Graphic */}
        <div className="absolute right-8 bottom-0 top-0 hidden lg:flex items-center">
          <div className="w-32 h-32 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 transform rotate-12 flex items-center justify-center text-white shadow-2xl">
            <Brain size={48} />
          </div>
          <div className="w-16 h-16 rounded-2xl bg-cyan-400/20 backdrop-blur-sm border border-cyan-200/20 transform -rotate-12 -translate-x-6 translate-y-10 flex items-center justify-center text-cyan-200 shadow-2xl">
            <Activity size={24} />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Medicines', value: stats?.total_reminders ?? medicines.length ?? '--', icon: <Pill size={20} />, color: 'bg-primary' },
          { label: 'Active Reminders', value: stats?.active_reminders ?? '--', icon: <CheckCircle size={20} />, color: 'bg-emerald-500' },
          { label: 'Missed Doses', value: stats?.missed_reminders ?? '--', icon: <AlertTriangle size={20} />, color: 'bg-red-500' },
          { label: 'Adherence Rate', value: stats?.adherence_rate ? `${stats.adherence_rate}%` : '--', icon: <Activity size={20} />, color: 'bg-cyan-500' }
        ].map((stat, idx) => (
          <div 
            key={idx}
            className="glass p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1 dark:bg-black dark:border-slate-800 border-white/60"
          >
            <div className="flex justify-between items-center mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <span className="text-slate-400 dark:text-slate-500 hover:text-primary"><MoreVertical size={16} /></span>
            </div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid: Schedule & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Today's Schedule */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass p-6 rounded-2xl dark:bg-black dark:border-slate-800 border-white/60 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Today's Schedule</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Swipe or click to manage doses</p>
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="py-10 text-center text-slate-500">Loading schedule...</div>
              ) : medicines.length === 0 ? (
                <div className="py-10 text-center text-slate-500">No medicines scheduled for today.</div>
              ) : medicines.map((med) => (
                <div 
                  key={med._id || med.id} 
                  className={`p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between border transition-all ${
                    med.status === 'taken' 
                      ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30 opacity-70' 
                      : med.status === 'missed'
                      ? 'bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30'
                      : 'bg-white dark:bg-black border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      med.status === 'taken' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50' : 
                      med.status === 'missed' ? 'bg-red-100 text-red-600 dark:bg-red-900/50' : 
                      'bg-primary/10 text-primary dark:bg-primary/20'
                    }`}>
                      <Pill size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        {med.name}
                        {med.status === 'taken' && <span className="text-emerald-500 text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/>Taken</span>}
                        {med.status === 'missed' && <span className="text-red-500 text-xs font-bold flex items-center gap-1"><AlertTriangle size={12}/>Missed</span>}
                      </h4>
                      <div className="text-slate-500 dark:text-slate-400 text-xs font-medium space-x-2">
                        <span>{med.dosage || med.dose}</span>
                        <span>•</span>
                        <span>{med.instruction}</span>
                        <span>•</span>
                        <span className="text-primary dark:text-cyan-400 font-bold">{med.reminderTimes?.[0] || med.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics: Weekly Adherence */}
          <div className="glass p-6 rounded-2xl dark:bg-black dark:border-slate-800 border-white/60 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Weekly Adherence</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Real-time tracking of completion</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.weekly_trends || weeklyAdherenceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAdherence" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '12px'
                    }} 
                  />
                  <Area type="monotone" dataKey="percentage" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorAdherence)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: AI Insights & Small Charts */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Insights Panel */}
          <div className="glass p-6 rounded-2xl dark:bg-black dark:border-slate-800 border-white/60 shadow-sm relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-ai to-cyan-400 opacity-20 blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-ai/10 flex items-center justify-center text-ai border border-ai/20">
                <Brain size={18} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Prediction</h3>
            </div>
            
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 p-4 rounded-xl border dark:border-slate-700 mb-4 shadow-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Missed Dose Risk</span>
                <span className={`text-xs font-bold flex items-center gap-1 ${
                  prediction?.risk_level === 'Low' ? 'text-emerald-500' : 'text-amber-500'
                }`}>
                  {prediction?.risk_level === 'Low' ? <CheckCircle size={12}/> : <AlertTriangle size={12}/>}
                  {prediction?.risk_level || 'Low'}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">
                {prediction ? Math.round(prediction.missed_dose_probability * 100) : 12}%
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                {prediction?.recommendation || 'Based on behavior trends over last 30 days.'}
              </p>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Suggested Best Time', val: stats?.best_time || '08:00 AM', icon: <Clock size={14}/> },
                { label: 'Worst Time', val: stats?.worst_time || '02:00 PM', icon: <AlertTriangle size={14}/> }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs border-b dark:border-slate-700/50 pb-2">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">{item.icon} {item.label}</span>
                  <span className="font-bold text-slate-800 dark:text-white">{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Medicine Distribution (Pie Chart) */}
          <div className="glass p-6 rounded-2xl dark:bg-black dark:border-slate-800 border-white/60 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Meds Distribution</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.medicine_distribution || medicineDistribution}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {(stats?.medicine_distribution || medicineDistribution).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {(stats?.medicine_distribution || medicineDistribution).map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="glass p-6 rounded-2xl dark:bg-black dark:border-slate-800 border-white/60 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-4 text-xs font-medium relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
              {(stats?.recent_activity || [
                { text: 'Took Vitamin D3', time: '08:05 AM', color: 'bg-emerald-500' },
                { text: 'Missed Lisinopril', time: '08:00 AM', color: 'bg-red-500' },
                { text: 'Added Amoxicillin', time: 'Yesterday', color: 'bg-primary' },
              ]).map((act, idx) => (
                <div key={idx} className="flex items-center justify-between pl-6 relative">
                  <div className={`absolute left-0 w-4 h-4 ${act.color} border-2 border-white dark:border-slate-900 rounded-full`}></div>
                  <span className="text-slate-700 dark:text-slate-300">{act.text}</span>
                  <span className="text-slate-400">{act.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
