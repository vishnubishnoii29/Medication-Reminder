require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Medicine = require('../models/Medicine');
const Reminder = require('../models/Reminder');
const AdherenceLog = require('../models/AdherenceLog');
const ChatSession = require('../models/ChatSession');

const DB = process.env.MONGO_URI || 'mongodb://localhost:27017/medimind';

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(DB);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional, set CLEAR_DB=true to enable)
    if (process.env.CLEAR_DB === 'true') {
      await User.deleteMany({});
      await Medicine.deleteMany({});
      await Reminder.deleteMany({});
      await AdherenceLog.deleteMany({});
      await ChatSession.deleteMany({});
      console.log('🧹 Cleared existing data');
    }

    // Define seed users - 2 users only
    const usersData = [
      {
        name: 'Vishnu',
        email: 'vishnu1@gmail.com',
        password: 'Vishnu@123',
        age: 32,
        role: 'user'
      },
      {
        name: 'Pragya',
        email: 'prag@gmail.com',
        password: 'Prag@123',
        age: 28,
        role: 'user'
      }
    ];

    // Create users
    const users = await User.create(usersData);
    console.log(`✅ Created ${users.length} users`);

    // Define medicines for each user with more medicines per user
    const medicinesDataPerUser = [
      // Vishnu (32) - Comprehensive health profile
      [
        {
          name: 'Metformin',
          dosage: '500mg',
          type: 'tablet',
          frequency: 'daily',
          instruction: 'After meal',
          priority: 'high',
          notes: 'Diabetes management',
          inventory: { totalQuantity: 120, currentQuantity: 95, alertThreshold: 20 }
        },
        {
          name: 'Lisinopril',
          dosage: '10mg',
          type: 'tablet',
          frequency: 'daily',
          instruction: 'Before meal',
          priority: 'high',
          notes: 'Blood pressure control',
          inventory: { totalQuantity: 90, currentQuantity: 72, alertThreshold: 15 }
        },
        {
          name: 'Atorvastatin',
          dosage: '20mg',
          type: 'tablet',
          frequency: 'daily',
          instruction: 'With meal',
          priority: 'high',
          notes: 'Cholesterol management',
          inventory: { totalQuantity: 60, currentQuantity: 45, alertThreshold: 10 }
        },
        {
          name: 'Vitamin D3',
          dosage: '2000 IU',
          type: 'capsule',
          frequency: 'daily',
          instruction: 'With meal',
          priority: 'medium',
          notes: 'Bone health and immunity',
          inventory: { totalQuantity: 90, currentQuantity: 80, alertThreshold: 15 }
        },
        {
          name: 'Aspirin',
          dosage: '75mg',
          type: 'tablet',
          frequency: 'daily',
          instruction: 'After meal',
          priority: 'medium',
          notes: 'Heart disease prevention',
          inventory: { totalQuantity: 90, currentQuantity: 70, alertThreshold: 15 }
        },
        {
          name: 'Omeprazole',
          dosage: '20mg',
          type: 'capsule',
          frequency: 'daily',
          instruction: 'Before meal',
          priority: 'medium',
          notes: 'Acid reflux management',
          inventory: { totalQuantity: 60, currentQuantity: 50, alertThreshold: 10 }
        },
        {
          name: 'Cetirizine',
          dosage: '10mg',
          type: 'tablet',
          frequency: 'daily',
          instruction: 'With meal',
          priority: 'low',
          notes: 'Allergy management',
          inventory: { totalQuantity: 30, currentQuantity: 25, alertThreshold: 5 }
        },
        {
          name: 'Melatonin',
          dosage: '5mg',
          type: 'tablet',
          frequency: 'daily',
          instruction: 'Empty stomach',
          priority: 'low',
          notes: 'Sleep enhancement',
          inventory: { totalQuantity: 60, currentQuantity: 40, alertThreshold: 10 }
        }
      ],
      // Pragya (28) - Different health profile
      [
        {
          name: 'Levothyroxine',
          dosage: '75mcg',
          type: 'tablet',
          frequency: 'daily',
          instruction: 'Empty stomach',
          priority: 'high',
          notes: 'Thyroid hormone replacement',
          inventory: { totalQuantity: 90, currentQuantity: 75, alertThreshold: 15 }
        },
        {
          name: 'Iron Supplement',
          dosage: '325mg',
          type: 'tablet',
          frequency: 'daily',
          instruction: 'Empty stomach',
          priority: 'high',
          notes: 'Anemia treatment',
          inventory: { totalQuantity: 90, currentQuantity: 60, alertThreshold: 15 }
        },
        {
          name: 'Folic Acid',
          dosage: '1mg',
          type: 'tablet',
          frequency: 'daily',
          instruction: 'With meal',
          priority: 'high',
          notes: 'Cell health and nutrition',
          inventory: { totalQuantity: 90, currentQuantity: 80, alertThreshold: 15 }
        },
        {
          name: 'Calcium Supplement',
          dosage: '500mg',
          type: 'tablet',
          frequency: 'daily',
          instruction: 'With meal',
          priority: 'medium',
          notes: 'Bone strength',
          inventory: { totalQuantity: 120, currentQuantity: 100, alertThreshold: 20 }
        },
        {
          name: 'Lorazepam',
          dosage: '1mg',
          type: 'tablet',
          frequency: 'as_needed',
          instruction: 'With meal',
          priority: 'medium',
          notes: 'Anxiety management',
          inventory: { totalQuantity: 30, currentQuantity: 20, alertThreshold: 5 }
        },
        {
          name: 'Ibuprofen',
          dosage: '400mg',
          type: 'tablet',
          frequency: 'as_needed',
          instruction: 'After meal',
          priority: 'medium',
          notes: 'Pain and inflammation',
          inventory: { totalQuantity: 50, currentQuantity: 35, alertThreshold: 10 }
        },
        {
          name: 'Vitamin B12',
          dosage: '1000mcg',
          type: 'capsule',
          frequency: 'daily',
          instruction: 'With meal',
          priority: 'medium',
          notes: 'Energy and nerve function',
          inventory: { totalQuantity: 60, currentQuantity: 45, alertThreshold: 10 }
        },
        {
          name: 'Multivitamin',
          dosage: '1 tablet',
          type: 'tablet',
          frequency: 'daily',
          instruction: 'With meal',
          priority: 'low',
          notes: 'General health maintenance',
          inventory: { totalQuantity: 90, currentQuantity: 70, alertThreshold: 15 }
        }
      ]
    ];

    // Create medicines and reminders
    let reminderCount = 0;
    let adherenceLogsCount = 0;
    const medicinesMap = new Map();

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const medicinesData = medicinesDataPerUser[i];

      // Create medicines for this user
      const medicines = await Promise.all(
        medicinesData.map(med => {
          med.user = user._id;
          return Medicine.create(med);
        })
      );

      medicinesMap.set(user._id.toString(), medicines);
      console.log(`✅ Created ${medicines.length} medicines for ${user.name}`);

      // Create reminders for each medicine with multiple times per day
      const reminderTimes = ['08:00 AM', '12:00 PM', '01:00 PM', '04:00 PM', '06:30 PM', '09:00 PM'];
      const notificationMethods = ['browser', 'email'];

      for (const medicine of medicines) {
        // Create 1-3 reminders per medicine based on frequency
        let reminderCountPerMedicine = 1;
        if (medicine.frequency === 'daily') {
          reminderCountPerMedicine = Math.ceil(Math.random() * 2) + 1; // 1-3 reminders
        }

        for (let j = 0; j < reminderCountPerMedicine; j++) {
          const reminder = await Reminder.create({
            user: user._id,
            medicine: medicine._id,
            title: `${medicine.name} - ${medicine.dosage}`,
            time: reminderTimes[j % reminderTimes.length],
            frequency: medicine.frequency === 'as_needed' ? 'daily' : medicine.frequency,
            notificationMethod: notificationMethods[j % notificationMethods.length],
            priority: medicine.priority,
            status: 'active'
          });

          reminderCount++;

          // Create adherence logs for past 60 days (more data!)
          const today = new Date();
          const adherenceLogs = [];

          for (let dayOffset = 59; dayOffset >= 0; dayOffset--) {
            const logDate = new Date(today);
            logDate.setDate(logDate.getDate() - dayOffset);

            // Generate realistic adherence pattern with variations
            // High priority medicines have higher adherence (90-95%)
            // Medium priority: 85-92%
            // Low priority: 80-88%
            let adherenceThreshold = 0.85;
            if (medicine.priority === 'high') {
              adherenceThreshold = 0.91;
            } else if (medicine.priority === 'medium') {
              adherenceThreshold = 0.88;
            }

            const isTaken = Math.random() < adherenceThreshold;

            adherenceLogs.push({
              user: user._id,
              reminder: reminder._id,
              date: logDate,
              status: isTaken ? 'taken' : 'missed'
            });
          }

          await AdherenceLog.create(adherenceLogs);
          adherenceLogsCount += adherenceLogs.length;
        }
      }
    }

    console.log(`✅ Created ${reminderCount} reminders with adherence history`);
    console.log(`✅ Created ${adherenceLogsCount} adherence log entries`);

    // Create sample chat sessions with more messages
    const chatSessions = await Promise.all(
      users.map(user => {
        return ChatSession.create({
          user: user._id,
          title: 'Health & Medication Discussion',
          messages: [
            {
              text: 'Hello! How can I help you manage your medications today?',
              sender: 'ai'
            },
            {
              text: 'I often forget to take my pills. Can you help me setup reminders?',
              sender: 'user'
            },
            {
              text: 'Of course! I can help you set up reminders at optimal times based on your medication schedule. I see you have several medicines. When do you usually wake up and go to bed?',
              sender: 'ai'
            },
            {
              text: 'I wake up at 7 AM and usually go to bed around 10 PM.',
              sender: 'user'
            },
            {
              text: 'Perfect! Based on your schedule, I recommend: Morning dose at 8 AM, Afternoon at 1 PM, and Evening at 6:30 PM. This gives you consistent 5-6 hour intervals. I\'ll also predict when you might miss a dose based on your past patterns.',
              sender: 'ai'
            },
            {
              text: 'That sounds great! Can you also tell me about drug interactions?',
              sender: 'user'
            },
            {
              text: 'I can provide basic information. Some of your medicines should be taken with food while others need an empty stomach. Always consult your doctor for detailed interaction information. Would you like tips on remembering to take them?',
              sender: 'ai'
            },
            {
              text: 'Yes please, that would be helpful!',
              sender: 'user'
            },
            {
              text: '✓ Use phone reminders/notifications\n✓ Link medication time to daily habits (breakfast, lunch, dinner)\n✓ Use a pill organizer for the week\n✓ Set recurring calendar events\n✓ Ask family/friends to remind you\n\nI\'ll track your adherence and send you personalized recommendations!',
              sender: 'ai'
            }
          ],
          status: 'active'
        });
      })
    );

    console.log(`✅ Created ${chatSessions.length} chat sessions`);

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n📊 Seed Summary:');
    console.log(`   - Users: 2`);
    console.log(`   - Medicines per user: 8`);
    console.log(`   - Reminders: ${reminderCount}`);
    console.log(`   - Adherence logs (60-day history): ${adherenceLogsCount}`);
    console.log(`   - Chat sessions: ${chatSessions.length}`);

    console.log('\n🚀 AI is now ready to predict dose adherence with real data!');
    console.log('\n📧 Login Credentials:');
    console.log(`   1. Email: vishnu1@gmail.com, Password: Vishnu@123`);
    console.log(`   2. Email: prag@gmail.com, Password: Prag@123`);

    await mongoose.connection.close();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

// Run the seed function
seedData();
