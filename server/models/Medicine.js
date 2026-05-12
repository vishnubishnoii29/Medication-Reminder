const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Medicine must belong to a user']
  },
  name: {
    type: String,
    required: [true, 'A medicine must have a name'],
    trim: true,
    maxlength: [50, 'A medicine name must have less or equal then 50 characters']
  },
  dosage: {
    type: String,
    required: [true, 'Please specify the dosage (e.g., 500mg)']
  },
  type: {
    type: String,
    enum: ['tablet', 'capsule', 'syrup', 'injection', 'drops', 'other'],
    required: [true, 'Please specify medicine type']
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'custom', 'as_needed'],
    default: 'daily'
  },
  instruction: {
    type: String,
    enum: ['Before meal', 'After meal', 'With meal', 'Empty stomach', 'None'],
    default: 'None'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  inventory: {
    totalQuantity: { type: Number, default: 0 },
    currentQuantity: { type: Number, default: 0 },
    alertThreshold: { type: Number, default: 5 }
  },
  notes: String,
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexing for faster queries
medicineSchema.index({ user: 1, status: 1 });

const Medicine = mongoose.model('Medicine', medicineSchema);
module.exports = Medicine;
