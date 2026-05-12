const catchAsync = require('../utils/catchAsync');
const aiService = require('../services/aiService');
const Reminder = require('../models/Reminder');
const AdherenceLog = require('../models/AdherenceLog');
const Medicine = require('../models/Medicine');

exports.getDashboardStats = catchAsync(async (req, res) => {
  // Aggregate basic stats
  const totalReminders = await Reminder.countDocuments({ user: req.user.id });
  const activeReminders = await Reminder.countDocuments({ user: req.user.id, status: 'active' });

  // Calculate real adherence rate from AdherenceLog
  const takenCount = await AdherenceLog.countDocuments({ user: req.user.id, status: 'taken' });
  const missedCount = await AdherenceLog.countDocuments({ user: req.user.id, status: 'missed' });
  
  let adherenceRate = 0;
  if (takenCount + missedCount > 0) {
    adherenceRate = parseFloat(((takenCount / (takenCount + missedCount)) * 100).toFixed(1));
  }

  // Calculate real weekly trends for past 7 days
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentLogs = await AdherenceLog.find({ 
    user: req.user.id,
    date: { $gte: oneWeekAgo }
  });

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyTrends = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayName = days[d.getDay()];
    
    const dayLogs = recentLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.toDateString() === d.toDateString();
    });
    
    const taken = dayLogs.filter(l => l.status === 'taken').length;
    const total = dayLogs.length;
    
    weeklyTrends.push({
      name: dayName,
      percentage: total > 0 ? Math.round((taken / total) * 100) : 0
    });
  }

  // Calculate best and worst times
  const allLogs = await AdherenceLog.find({ user: req.user.id }).populate('reminder');
  const timeSlots = {};
  
  allLogs.forEach(log => {
    if (log.reminder && log.reminder.time) {
      const time = log.reminder.time;
      if (!timeSlots[time]) {
        timeSlots[time] = { taken: 0, total: 0 };
      }
      timeSlots[time].total += 1;
      if (log.status === 'taken') {
        timeSlots[time].taken += 1;
      }
    }
  });
  
  let bestTime = "08:00 AM";
  let worstTime = "02:00 PM";
  let maxRate = -1;
  let minRate = 2;
  
  Object.keys(timeSlots).forEach(time => {
    const slot = timeSlots[time];
    const rate = slot.taken / slot.total;
    if (rate > maxRate) {
      maxRate = rate;
      bestTime = time;
    }
    if (rate < minRate) {
      minRate = rate;
      worstTime = time;
    }
  });

  // Fetch recent activity
  const recentLogsForActivity = await AdherenceLog.find({ user: req.user.id })
    .sort({ date: -1 })
    .limit(5)
    .populate('reminder');

  const recentActivity = recentLogsForActivity.map(log => {
    const medName = log.reminder && log.reminder.medicine ? log.reminder.medicine.name : 'Medicine';
    return {
      text: `${log.status === 'taken' ? 'Took' : 'Missed'} ${medName}`,
      time: new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      color: log.status === 'taken' ? 'bg-emerald-500' : 'bg-red-500'
    };
  });

  // Calculate medicine distribution
  const userMeds = await Medicine.find({ user: req.user.id });
  const distribution = {};
  userMeds.forEach(med => {
    const type = med.type || 'Others';
    distribution[type] = (distribution[type] || 0) + 1;
  });
  
  const colors = ['#2563EB', '#7C3AED', '#06B6D4', '#F43F5E', '#10B981'];
  const medicineDistribution = Object.keys(distribution).map((key, idx) => ({
    name: key,
    value: distribution[key],
    color: colors[idx % colors.length]
  }));

  const stats = {
    adherence_rate: adherenceRate,
    missed_reminders: missedCount,
    weekly_trends: weeklyTrends,
    best_time: bestTime,
    worst_time: worstTime,
    total_reminders: totalReminders,
    active_reminders: activeReminders,
    recent_activity: recentActivity,
    medicine_distribution: medicineDistribution
  };

  res.status(200).json({
    status: 'success',
    data: stats
  });
});

exports.getAIPrediction = catchAsync(async (req, res) => {
  // Calculate real past adherence rates for past 3 weeks
  const pastRates = [];
  for (let i = 1; i <= 3; i++) {
    const start = new Date();
    start.setDate(start.getDate() - (i * 7));
    const end = new Date();
    end.setDate(end.getDate() - ((i - 1) * 7));
    
    const weekLogs = await AdherenceLog.find({
      user: req.user.id,
      date: { $gte: start, $lt: end }
    });
    
    const taken = weekLogs.filter(l => l.status === 'taken').length;
    const total = weekLogs.length;
    
    pastRates.push(total > 0 ? parseFloat((taken / total).toFixed(2)) : 0.9); // Default to 0.9 if no data
  }

  // Extract user's historical data to send to Python ML
  const userData = {
    userId: req.user.id,
    age: req.user.age || 35, // Use real age from User model (defaults to 35)
    past_adherence_rates: pastRates,
    active_medicines_count: await Reminder.countDocuments({ user: req.user.id, status: 'active' })
  };

  const prediction = await aiService.getPrediction(userData);

  res.status(200).json({
    status: 'success',
    data: prediction
  });
});
