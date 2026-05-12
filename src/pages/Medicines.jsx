import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill, Search, Plus, Filter, Edit2, Trash2, 
  X, Clock, Calendar, AlertTriangle, Brain,
  ChevronDown
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE } from '../config/api';

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm();

  const token = localStorage.getItem('token');

  // Fetch Medicines
  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/v1/medicines`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedicines(res.data.data);
    } catch (err) {
      setError('Failed to fetch medicines');
      // Fallback to mock data for demo
      setMedicines([
        { _id: '1', name: 'Vitamin D3', dosage: '2000 IU', type: 'tablet', frequency: 'daily', reminderTimes: ['08:00 AM'], instruction: 'After meal', priority: 'medium', status: 'active' },
        { _id: '2', name: 'Amoxicillin', dosage: '500 mg', type: 'capsule', frequency: 'daily', reminderTimes: ['02:00 PM'], instruction: 'Before meal', priority: 'high', status: 'active' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (editingMedicine) {
        await axios.put(`${API_BASE}/api/v1/medicines/${editingMedicine._id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Medicine updated successfully!');
      } else {
        await axios.post(`${API_BASE}/api/v1/medicines`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Medicine added successfully!');
      }
      setModalOpen(false);
      reset();
      setEditingMedicine(null);
      fetchMedicines();
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Something went wrong');
      setError(err.response?.data?.message || err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setModalOpen(true);
    // Set form values
    setValue('name', medicine.name);
    setValue('dosage', medicine.dosage);
    setValue('type', medicine.type);
    setValue('frequency', medicine.frequency);
    setValue('instruction', medicine.instruction);
    setValue('priority', medicine.priority);
    setValue('notes', medicine.notes);
    // Bug #10 fix: also restore inventory fields
    setValue('inventory.totalQuantity', medicine.inventory?.totalQuantity ?? 0);
    setValue('inventory.currentQuantity', medicine.inventory?.currentQuantity ?? 0);
    setValue('inventory.alertThreshold', medicine.inventory?.alertThreshold ?? 5);
  };

  const handleDeleteClick = (id) => {
    setMedicineToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${API_BASE}/api/v1/medicines/${medicineToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Medicine deleted successfully!');
      setDeleteConfirmOpen(false);
      fetchMedicines();
    } catch (err) {
      toast.error('Failed to delete medicine');
      setError('Failed to delete medicine');
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || med.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Pill className="text-primary" size={32} /> Medicine Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Add, edit, and track your medications with AI assistance.</p>
        </div>
        <button 
          onClick={() => { setModalOpen(true); setEditingMedicine(null); reset(); }}
          className="px-6 py-3 bg-gradient-premium text-white rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center gap-2 hover:-translate-y-0.5"
        >
          <Plus size={20} /> Add Medicine
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <input 
            type="text" 
            placeholder="Search medicines..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 dark:bg-black"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-medium"
          >
            <option value="all">All Types</option>
            <option value="tablet">Tablets</option>
            <option value="capsule">Capsules</option>
            <option value="syrup">Syrup</option>
            <option value="injection">Injections</option>
            <option value="drops">Drops</option>
            <option value="other">Other</option>
          </select>
          <button className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm flex items-center gap-2 border border-red-100 dark:border-red-800">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {/* Medicines List/Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading medicines...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedicines.map((med) => (
            <div 
              key={med._id}
              className="glass dark:bg-black dark:border-slate-800 p-6 rounded-2xl border-white/60 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
            >
              {/* Priority Tag */}
              <div className={`absolute top-0 right-0 w-2 h-full ${
                med.priority === 'high' ? 'bg-red-500' : 
                med.priority === 'medium' ? 'bg-amber-500' : 
                'bg-emerald-500'
              }`}></div>

              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    med.priority === 'high' ? 'bg-red-100 text-red-600' : 
                    med.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    <Pill size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg">{med.name}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{med.dosage} • {med.type}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(med)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400"><Edit2 size={16} /></button>
                  <button onClick={() => handleDeleteClick(med._id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400"><Trash2 size={16} /></button>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-slate-400" />
                  <span>Frequency: {med.frequency}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-slate-400" />
                  <span>Instructions: {med.instruction}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain size={16} className="text-ai" />
                  <span className="text-ai font-semibold">AI Prediction: Low risk of missing</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                  med.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {med.status.toUpperCase()}
                </span>
                <button className="text-primary text-sm font-semibold hover:text-blue-700 transition-colors flex items-center gap-1">
                  View Details <ChevronDown size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
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
              className="glass dark:bg-black dark:border-slate-800 p-6 sm:p-8 rounded-[2rem] shadow-2xl border-white/60 w-full max-w-2xl relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
                </h2>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Medicine Name</label>
                    <input 
                      type="text" 
                      {...register('name', { required: true })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 dark:bg-slate-800/50 dark:text-white"
                      placeholder="e.g., Amoxicillin"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Dosage</label>
                    <input 
                      type="text" 
                      {...register('dosage', { required: true })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 dark:bg-slate-800/50 dark:text-white"
                      placeholder="e.g., 500 mg"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Type</label>
                    <select 
                      {...register('type')}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300"
                    >
                      <option value="tablet">Tablet</option>
                      <option value="capsule">Capsule</option>
                      <option value="syrup">Syrup</option>
                      <option value="injection">Injection</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Frequency</label>
                    <select 
                      {...register('frequency')}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Instruction</label>
                    <select 
                      {...register('instruction')}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300"
                    >
                      <option value="Before meal">Before meal</option>
                      <option value="After meal">After meal</option>
                      <option value="With meal">With meal</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Priority</label>
                  <div className="flex gap-4">
                    {['low', 'medium', 'high'].map((p) => (
                      <label key={p} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" value={p} {...register('priority')} className="w-4 h-4 text-primary focus:ring-primary/20" />
                        <span className={`capitalize text-sm font-medium ${
                          p === 'high' ? 'text-red-600' : p === 'medium' ? 'text-amber-600' : 'text-emerald-600'
                        }`}>{p}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Notes (Optional)</label>
                  <textarea 
                    {...register('notes')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 dark:bg-slate-800/50 dark:text-white h-24"
                    placeholder="Add any specific instructions or notes..."
                  ></textarea>
                </div>

                {/* Bug #10 fix: Inventory fields */}
                <div className="grid md:grid-cols-3 gap-5">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Total Quantity</label>
                    <input type="number" min="0" {...register('inventory.totalQuantity')} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 dark:bg-slate-800/50 dark:text-white" placeholder="e.g., 30" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Current Quantity</label>
                    <input type="number" min="0" {...register('inventory.currentQuantity')} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 dark:bg-slate-800/50 dark:text-white" placeholder="e.g., 24" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Alert Threshold</label>
                    <input type="number" min="0" {...register('inventory.alertThreshold')} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white/50 dark:bg-slate-800/50 dark:text-white" placeholder="e.g., 5" />
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
                      editingMedicine ? 'Save Changes' : 'Add Medicine'
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
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">This action cannot be undone. This will permanently delete the medication from your records.</p>
              
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

export default Medicines;
