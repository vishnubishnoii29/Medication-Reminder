# 📊 Database Seeding Guide

This guide explains how to populate the MediMind.ai database with realistic test data for development and demonstration purposes.

## Overview

The seed script creates:
- **5 realistic users** with different health profiles (diabetes, asthma, arthritis, etc.)
- **10+ medicines** with dosages, frequencies, and instructions
- **15+ reminders** scheduled at various times
- **30 days of adherence history** per reminder (showing 88% average adherence)
- **Chat sessions** for each user

This data is perfect for testing the AI prediction engine and dashboard analytics.

## Prerequisites

- MongoDB running locally or Atlas connection string ready
- Node.js v18+ installed
- Dependencies installed: `npm install` in the `server` folder

## Quick Start

### Option 1: Add to Existing Data (Recommended for first run)
```bash
cd server
npm run seed
```

This will add the seed data to your existing MongoDB database without deleting anything.

### Option 2: Clear and Reseed
To completely replace the database with fresh seed data:
```bash
cd server
npm run seed:clear
```

⚠️ **Warning**: This will delete all existing data. Use with caution in production.

## Environment Setup

Ensure your `.env` file in the `server` folder is properly configured:

```env
MONGO_URI=mongodb://localhost:27017/medimind
# or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/medimind?retryWrites=true&w=majority
```

## What Gets Seeded?

### Users (5 profiles)
| Name | Age | Email | Health Profile |
|------|-----|-------|-----------------|
| Rajesh Kumar | 52 | rajesh.kumar@example.com | Diabetes, Hypertension |
| Priya Singh | 38 | priya.singh@example.com | Hypothyroidism, Anxiety |
| Amit Patel | 45 | amit.patel@example.com | Arthritis, Acid Reflux |
| Neha Sharma | 28 | neha.sharma@example.com | Asthma, Allergies |
| Vikram Desai | 60 | vikram.desai@example.com | Heart Disease, Diabetes |

**Default Password** for all: `password123`

### Sample Medicines & Reminders

Each user has 2-3 medicines with daily reminders scheduled at:
- 08:00 AM
- 01:00 PM
- 06:30 PM

Medicines include:
- Metformin (diabetes)
- Amlodipine (blood pressure)
- Salbutamol (asthma)
- Levothyroxine (thyroid)
- Aspirin (heart health)
- And more...

### Adherence Data

The script generates 30 days of adherence history (from 30 days ago to today) with:
- **88% adherence rate** (realistic usage pattern)
- Random missed doses distributed naturally
- Data per reminder to feed into AI predictions

This historical data is crucial for the AI service to calculate:
- Risk of missing a dose
- Past adherence trends
- Personalized recommendations

## Testing the AI Predictions

After seeding, test the AI service:

```bash
# 1. Start the Flask AI service (in another terminal)
cd ai_service
python app.py

# 2. In another terminal, start the Node server
cd server
npm run dev

# 3. Test the predict endpoint with sample adherence data
curl -X POST http://localhost:5000/api/v1/analytics/predict \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "REPLACE_WITH_USER_ID",
    "past_adherence_rates": [0.88, 0.85, 0.90]
  }'
```

### Expected AI Response
```json
{
  "success": true,
  "prediction": {
    "missed_dose_probability": 0.12,
    "risk_level": "Low",
    "confidence": 0.85,
    "recommendation": "Great job! Maintain your current schedule."
  }
}
```

## Manual Testing in the App

1. **Login** with one of the seed user credentials (e.g., `rajesh.kumar@example.com` / `password123`)
2. **View Dashboard**: See your assigned medicines and reminders
3. **Check Analytics**: View 30-day adherence trends
4. **Test Predictions**: Go to Analytics → Predict Dose Miss to see AI recommendations
5. **Chat**: Talk to the AI chatbot about your medication schedule

## Customizing Seed Data

To modify the seed data, edit `server/scripts/seed.js`:

- **Change user count**: Modify the `usersData` array
- **Change medicines**: Update `medicinesDataPerUser`
- **Change adherence rate**: Modify the line `Math.random() < 0.88` (adjust 0.88 to your desired rate)
- **Change adherence history**: Change `for (let dayOffset = 29; ...)` to adjust the number of days

## Troubleshooting

### "MongoDB connection failed"
- Ensure MongoDB is running: `mongod` (for local) or check Atlas connection string
- Verify `MONGO_URI` in `.env`

### "Cannot find module 'mongoose'"
- Run `npm install` in the `server` folder first

### "Port 5000 already in use"
- Change the `PORT` in `.env` or kill the process using the port

### Seed data not appearing
- Check that `CLEAR_DB` is not set to `true` unless you want to clear data
- Verify the script completed without errors

## Notes

- Seed data includes **realistic health conditions** based on real-world medication adherence patterns
- Adherence logs are generated for the **past 30 days** to provide sufficient history for AI analysis
- All timestamps are automatically set to appropriate dates
- Passwords are **hashed** using bcrypt before storage (never plain text)

---

**Ready to deploy?** Once seeded locally, your app is ready for testing in production. The AI predictions will be much more accurate with historical adherence data.
