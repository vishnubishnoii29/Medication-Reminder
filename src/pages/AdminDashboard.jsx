
import { 
  ShieldCheck, Users, Activity, Brain, Server, AlertCircle, 
  CheckCircle, Info
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const adminData = [
  { name: 'Mon', users: 4000, alerts: 240 },
  { name: 'Tue', users: 3000, alerts: 139 },
  { name: 'Wed', users: 2000, alerts: 980 },
  { name: 'Thu', users: 2780, alerts: 390 },
  { name: 'Fri', users: 1890, alerts: 480 },
  { name: 'Sat', users: 2390, alerts: 380 },
  { name: 'Sun', users: 3490, alerts: 430 },
];

const AdminDashboard = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="text-red-500" size={32} /> Admin Control Center
          </h1>
          <p className="text-slate-500 font-medium mt-1">Platform monitoring, user management, and system health.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-bold text-slate-700">All Systems Operational</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Active Users', value: '12,450', icon: <Users size={20} />, color: 'bg-primary', trend: '+12% this week' },
          { label: 'AI Predictions Made', value: '842K', icon: <Brain size={20} />, color: 'bg-ai', trend: '+5% today' },
          { label: 'Avg. Adherence', value: '88.4%', icon: <Activity size={20} />, color: 'bg-emerald-500', trend: 'Stable' },
          { label: 'System Load', value: '24%', icon: <Server size={20} />, color: 'bg-amber-500', trend: 'Normal' }
        ].map((stat, idx) => (
          <div key={idx} className="glass p-6 rounded-2xl border-white/60 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-16 h-16 ${stat.color} opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform`}></div>
            <div className="flex justify-between items-center mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.color} text-white flex items-center justify-center shadow-lg`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-sm font-medium text-slate-500">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            <p className="text-xs font-bold text-emerald-500 mt-2">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl border-white/60 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Platform Traffic & Alerts</h3>
            <select className="text-sm px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={adminData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="users" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="alerts" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorAlerts)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Logs */}
        <div className="glass p-6 rounded-2xl border-white/60 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Recent Logs</h3>
            <button className="text-primary text-sm font-bold">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
            {[
              { text: 'Database backup completed', type: 'success', time: '2m ago' },
              { text: 'High CPU usage detected on Node 3', type: 'warning', time: '15m ago' },
              { text: 'New model V2 deployed to production', type: 'info', time: '1h ago' },
              { text: 'Failed login attempt (IP: 192.168.1.5)', type: 'error', time: '2h ago' },
              { text: 'Cron job #4512 executed', type: 'success', time: '3h ago' },
            ].map((log, idx) => (
              <div key={idx} className="flex gap-3 text-sm border-b border-slate-100 pb-3">
                <div className="mt-0.5">
                  {log.type === 'success' && <CheckCircle size={16} className="text-emerald-500" />}
                  {log.type === 'warning' && <AlertCircle size={16} className="text-amber-500" />}
                  {log.type === 'info' && <Info size={16} className="text-blue-500" />}
                  {log.type === 'error' && <AlertCircle size={16} className="text-red-500" />}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{log.text}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
