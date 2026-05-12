import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Clock, Plus, Filter, MoreVertical, Edit2, Trash2, 
  X, AlertTriangle, Volume2, Mail, Smartphone
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE } from '../config/api';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const token = localStorage.getItem('token');

  // Convert 24h time (from <input type="time">) to 12h AM/PM format for cron matching
  const to12h = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${String(hour).padStart(2, '0')}:${minutes} ${ampm}`;
  };

  // Convert 12h AM/PM to 24h for <input type="time">
  // Bug #11 fix: correct handling of 12 AM (midnight) and 12 PM (noon)
  const to24h = (time12h) => {
    if (!time12h) return '';
    const [time, modifier] = time12h.split(' ');
    if (!modifier) return time;
    let [hours, minutes] = time.split(':');
    if (modifier === 'AM') {
      // 12 AM = midnight = 00:xx
      if (hours === '12') hours = '00';
    } else {
      // 12 PM = noon = 12:xx (no change); all others: add 12
      if (hours !== '12') hours = String(parseInt(hours, 10) + 12);
    }
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  };

  // Fetch Reminders and Medicines
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [remindersRes, medicinesRes] = await Promise.all([
        axios.get(`${API_BASE}/api/v1/reminders`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE}/api/v1/medicines`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setReminders(remindersRes.data.data);
      setMedicines(medicinesRes.data.data);
    } catch (err) {
      setError('Failed to fetch data');
      // Fallback to mock data
      setReminders([
        { _id: '1', title: 'Morning Vitamin', time: '08:00 AM', frequency: 'daily', status: 'active', priority: 'medium', notificationMethod: 'browser', medicine: { name: 'Vitamin D3' } },
        { _id: '2', title: 'Afternoon Antibiotic', time: '02:00 PM', frequency: 'daily', status: 'active', priority: 'high', notificationMethod: 'email', medicine: { name: 'Amoxicillin' } },
      ]);
      setMedicines([
        { _id: '1', name: 'Vitamin D3' },
        { _id: '2', name: 'Amoxicillin' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onSubmit = async (data) => {
    setLoading(true);
    // Convert time from 24h input to 12h AM/PM string for cron matching
    const payload = { ...data, time: to12h(data.time) };
    try {
      if (editingReminder) {
        await axios.put(`${API_BASE}/api/v1/reminders/${editingReminder._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Reminder updated successfully!');
      } else {
        await axios.post(`${API_BASE}/api/v1/reminders`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Reminder created successfully!');
      }
      setModalOpen(false);
      reset();
      setEditingReminder(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Something went wrong');
      setError(err.response?.data?.message || err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setModalOpen(true);
    setValue('title', reminder.title);
    setValue('medicine', reminder.medicine?._id || reminder.medicine);
    setValue('time', to24h(reminder.time)); // convert back to 24h for <input type="time">
    setValue('frequency', reminder.frequency);
    setValue('notificationMethod', reminder.notificationMethod);
    setValue('priority', reminder.priority);
  };

  const handleDeleteClick = (id) => {
    setReminderToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${API_BASE}/api/v1/reminders/${reminderToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Reminder deleted successfully!');
      setDeleteConfirmOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to delete reminder');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (reminder) => {
    try {
      const newStatus = reminder.status === 'active' ? 'inactive' : 'active';
      // Bug #5 fix: use PATCH for partial update (only changing status field)
      await axios.patch(`${API_BASE}/api/v1/reminders/${reminder._id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Reminder ${newStatus === 'active' ? 'enabled' : 'disabled'}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="text-primary" size={32} /> Reminders & Notifications
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Smart scheduling with AI-optimized notification times.</p>
        </div>
        <button 
          onClick={() => { setModalOpen(true); setEditingReminder(null); reset(); }}
          className="px-6 py-3 bg-gradient-premium text-white rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center gap-2 hover:-translate-y-0.5"
        >
          <Plus size={20} /> Create Reminder
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Reminders', value: reminders.filter(r => r.status === 'active').length, icon: <Bell size={20} />, color: 'bg-primary' },
          { label: 'Scheduled Today', value: reminders.length, icon: <Clock size={20} />, color: 'bg-emerald-500' },
          { label: 'Missed (Past 24h)', value: '0', icon: <AlertTriangle size={20} />, color: 'bg-red-500' }
        ].map((stat, idx) => (
          <div key={idx} className="glass dark:bg-black dark:border-slate-800 p-6 rounded-2xl border-white/60 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.color} text-white flex items-center justify-center shadow-lg`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm flex items-center gap-2 border border-red-100 dark:border-red-800">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {/* Reminders List */}
      <div className="glass dark:bg-black dark:border-slate-800 p-6 rounded-2xl border-white/60 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Schedule</h2>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"><Filter size={16} /></button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-slate-500">Loading reminders...</div>
        ) : (
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div 
                key={reminder._id}
                className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between transition-all ${
                  reminder.status === 'inactive' ? 'bg-slate-50 dark:bg-black border-slate-100 dark:border-slate-700 opacity-60' : 'bg-white dark:bg-black border-slate-100 dark:border-slate-700 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    reminder.status === 'inactive' ? 'bg-slate-200 text-slate-400' : 'bg-primary/10 text-primary'
                  }`}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      {reminder.title}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        reminder.priority === 'high' ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>{reminder.priority}</span>
                    </h3>
                    <div className="text-slate-500 dark:text-slate-400 text-xs font-medium space-x-2">
                      <span className="text-primary font-bold">{reminder.time}</span>
                      <span>•</span>
                      <span>{reminder.frequency}</span>
                      <span>•</span>
                      <span>Med: {reminder.medicine?.name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4 md:mt-0 justify-end">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    {reminder.notificationMethod === 'browser' && <Smartphone size={16} />}
                    {reminder.notificationMethod === 'email' && <Mail size={16} />}
                    {reminder.notificationMethod === 'sms' && <Volume2 size={16} />}
                  </div>

                  <button 
                    onClick={() => toggleStatus(reminder)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      reminder.status === 'active' 
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                    }`}
                  >
                    {reminder.status === 'active' ? 'Active' : 'Disabled'}
                  </button>

                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(reminder)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400"><Edit2 size={16} /></button>
                    <button onClick={() => handleDeleteClick(reminder._id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass dark:bg-black dark:border-slate-800 p-6 sm:p-8 rounded-[2rem] shadow-2xl border-white/60 w-full max-w-xl relative z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {editingReminder ? 'Edit Reminder' : 'Create Reminder'}
                </h2>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Reminder Title</label>
                  <input 
                    type="text" 
                    {...register('title', { required: true })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 dark:bg-slate-800/50 dark:text-white"
                    placeholder="e.g., Morning Dose"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Select Medicine</label>
                  <select 
                    {...register('medicine', { required: true })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300"
                  >
                    <option value="">Select a medicine...</option>
                    {medicines.map(med => (
                      <option key={med._id} value={med._id}>{med.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Time</label>
                    <input 
                      type="time"
                      {...register('time', { required: 'Time is required' })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 dark:bg-slate-800/50 dark:text-white"
                    />
                    {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Frequency</label>
                    <select 
                      {...register('frequency')}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Notification Method</label>
                    <select 
                      {...register('notificationMethod')}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300"
                    >
                      <option value="browser">Browser Push</option>
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Priority</label>
                    <select 
                      {...register('priority')}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button 
                    type="button" 
                    onClick={() => setModalOpen(false)}
                    className="px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-premium text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      editingReminder ? 'Save Changes' : 'Create'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmOpen(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass dark:bg-black dark:border-slate-800 p-6 rounded-2xl shadow-xl border-white/60 w-full max-w-md relative z-10"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Are you sure?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">This will permanently delete this reminder.</p>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors text-sm disabled:opacity-70 flex items-center gap-1"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reminders;
