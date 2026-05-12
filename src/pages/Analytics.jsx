import { useState, useEffect } from 'react';

import { 
  Brain, CheckCircle, Clock, Activity, Shield, Zap
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import { API_BASE } from '../config/api';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Bug #22 fix: read token inside the effect so it's always fresh
      const token = localStorage.getItem('token');

      try {
        const [analyticsRes, predictRes] = await Promise.all([
          axios.get(`${API_BASE}/api/v1/analytics`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.post(`${API_BASE}/api/v1/analytics/predict`, {}, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setData(analyticsRes.data.data);
        setPrediction(predictRes.data.data.prediction);
      } catch {

        // Fallback data
        setData({
          adherence_rate: 85.0,
          weekly_trends: [
            { name: 'Mon', percentage: 90 },
            { name: 'Tue', percentage: 80 },
            { name: 'Wed', percentage: 95 },
            { name: 'Thu', percentage: 70 },
            { name: 'Fri', percentage: 85 },
            { name: 'Sat', percentage: 100 },
            { name: 'Sun', percentage: 90 }
          ],
          best_time: "08:00 AM",
          worst_time: "09:00 PM"
        });
        setPrediction({
          missed_dose_probability: 0.25,
          risk_level: "Low",
          confidence: 0.75,
          recommendation: "Maintain your current schedule."
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Brain className="text-ai" size={32} /> AI Insights & Analytics
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Predictive analysis and behavioral trends powered by machine learning.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass dark:bg-slate-900/50 dark:border-slate-800 p-6 rounded-2xl border-white/60 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-xl"></div>
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg">
              <Activity size={20} />
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Adherence Rate</h3>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{data?.adherence_rate}%</p>
        </div>

        <div className="glass dark:bg-slate-900/50 dark:border-slate-800 p-6 rounded-2xl border-white/60 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-ai/10 rounded-full blur-xl"></div>
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-ai text-white flex items-center justify-center shadow-lg">
              <Brain size={20} />
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Missed Dose Risk</h3>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{prediction?.risk_level}</p>
        </div>

        <div className="glass dark:bg-slate-900/50 dark:border-slate-800 p-6 rounded-2xl border-white/60 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-400/10 rounded-full blur-xl"></div>
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 text-white flex items-center justify-center shadow-lg">
              <Clock size={20} />
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Best Response Time</h3>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{data?.best_time}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Adherence Chart */}
        <div className="lg:col-span-8 glass dark:bg-slate-900/50 dark:border-slate-800 p-6 rounded-2xl border-white/60 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Weekly Adherence Trends</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Daily completion percentage</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.weekly_trends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAdherence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="percentage" stroke="#7C3AED" strokeWidth={2} fillOpacity={1} fill="url(#colorAdherence)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Prediction Panel */}
        <div className="lg:col-span-4 glass dark:bg-slate-900/50 dark:border-slate-800 p-6 rounded-2xl border-white/60 shadow-sm relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-ai to-cyan-400 opacity-20 blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-ai/10 flex items-center justify-center text-ai border border-ai/20">
              <Brain size={18} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Prediction</h3>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 mb-6 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Missed Dose Probability</span>
              <span className={`text-xs font-bold flex items-center gap-1 ${
                prediction?.risk_level === 'Low' ? 'text-emerald-500' : 'text-amber-500'
              }`}>
                <CheckCircle size={12}/>{prediction?.risk_level} Risk
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-800 dark:text-white">
              {prediction ? Math.round(prediction.missed_dose_probability * 100) : 0}%
            </div>
            <div className="mt-2 flex gap-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${prediction?.risk_level === 'Low' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                style={{ width: `${(prediction?.missed_dose_probability || 0) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
                <Zap size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">Recommendation</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{prediction?.recommendation}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Shield size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">Confidence Score</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Model confidence: {(prediction?.confidence || 0) * 100}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Behavioral Insights */}
      <div className="glass dark:bg-slate-900/50 dark:border-slate-800 p-6 rounded-2xl border-white/60 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Behavioral Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">Most Consistent Time</p>
            <p className="text-lg font-bold text-emerald-600 mt-1">{data?.best_time}</p>
            <p className="text-xs text-slate-400 mt-0.5">You have a 98% success rate at this time.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">High Risk Time</p>
            <p className="text-lg font-bold text-red-600 mt-1">{data?.worst_time}</p>
            <p className="text-xs text-slate-400 mt-0.5">You are more likely to miss doses after this time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
