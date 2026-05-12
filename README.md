# 🧠 MediMind.ai - AI-Powered Medication Reminder & Health Assistant

![MediMind Banner](https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

> A production-level, intelligent healthcare SaaS platform built to solve medication non-adherence using advanced Machine Learning, real-time reminders, and an interactive AI Chatbot.

---

## 🌟 Overview

**MediMind.ai** is not just another alarm app. It is a comprehensive **AI-driven healthcare ecosystem** designed to learn user habits, predict missed medication doses before they happen, and actively assist users via a smart virtual assistant. 

Built with a premium **glassmorphism UI**, the platform matches the aesthetic quality of top-tier SaaS products like Stripe and Notion AI, making it perfect for an advanced **B.Tech AI/ML Major Project** or portfolio showcase.

---

## 🚀 Key Features

*   **🤖 AI/ML Prediction Engine**: Python-based microservice that predicts the probability of missed doses based on behavioral trends.
*   **💬 Real-Time Virtual Assistant**: WebSocket-powered interactive chatbot that understands complex medical queries and provides schedule insights.
*   **⏰ Smart Notification System**: Intelligent reminder engine powered by `node-cron` with adaptive snooze and dynamic notification methods.
*   **📊 Advanced Analytics Dashboard**: Real-time adherence tracking, missed dose heatmaps, and weekly behavioral trends powered by Recharts.
*   **🎨 Premium SaaS UI/UX**: State-of-the-art Glassmorphism design, soft shadows, Framer Motion animations, and adaptive layouts.
*   **🛡️ Role-Based Admin Panel**: Comprehensive monitoring of system health, active users, and platform logs.

---

## 🛠️ Technology Stack

### Frontend (User Interface)
*   **React.js (Vite)**: Lightning-fast rendering and component management.
*   **Tailwind CSS (v3)**: Highly customizable utility-first styling for the premium UI.
*   **Framer Motion**: Complex physics-based animations and route transitions.
*   **Recharts**: Responsive data visualization.
*   **React Hook Form**: Performant form validation.
*   **Lucide React**: Modern iconography.
*   **Socket.io-client**: Real-time bidirectional event-based communication.

### Backend (Node.js API & Automation)
*   **Express.js**: Robust routing and middleware management.
*   **MongoDB & Mongoose**: Flexible NoSQL database for users, medicines, and logs.
*   **JSON Web Tokens (JWT)**: Secure, stateless authentication.
*   **Bcrypt.js**: Cryptographic password hashing.
*   **Node-Cron**: Automated server-side task scheduling.
*   **Socket.io**: Real-time WebSocket server for the chatbot.

### AI/ML Microservice (Python)
*   **Flask / FastAPI**: Lightweight Python web framework for exposing the model.
*   **Scikit-Learn**: Machine learning library for Logistic Regression / Random Forest models.
*   **NumPy & Pandas**: Data manipulation and feature engineering.

---

## 🏗️ Architecture & Workflow

The system is divided into three main pillars:

1.  **The Client Layer (React)**: Handles all user interactions, UI rendering, and state management. Communicates with the Node.js backend via Axios REST calls and Socket.io.
2.  **The Core Engine (Node.js)**: Manages business logic, database CRUD operations, authentication, and the active Cron scheduler. It acts as an API Gateway for the ML microservice.
3.  **The Intelligence Layer (Python)**: A standalone microservice that ingests behavioral data (time of day, past adherence, drug type) and outputs a "Risk Probability Score" and optimal schedule recommendations.

---

## 💻 Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   Python (3.9+)
*   MongoDB Instance (Local or Atlas)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/medimind-ai.git
cd medimind-ai
```

### Step 2: Setup the Frontend
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Step 3: Setup the Node.js Backend
```bash
cd server

# Install dependencies
npm install

# Create a .env file
echo "PORT=5000" > .env
echo "MONGO_URI=mongodb://localhost:27017/medireminder" >> .env
echo "JWT_SECRET=your_super_secret_key" >> .env

# Start the server
node index.js
```

### Step 4: Setup the Python AI Microservice
```bash
cd ai_service

# Install Python requirements
pip install -r requirements.txt

# Start the Flask service
python app.py
```

---

## 🌐 Deployment Guide

### Frontend Deployment (Vercel)
The project includes a pre-configured `vercel.json`.
1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Ensure the Build Command is `npm run build` and Output Directory is `dist`.
4. Deploy!

### Backend Deployment (Render / Railway)
1. Connect your GitHub repository to Render/Railway.
2. Set the root directory to `server/`.
3. Add Environment Variables (`MONGO_URI`, `JWT_SECRET`).
4. Start command: `node index.js`.

### AI Service Deployment (Render / Heroku)
1. Deploy the `ai_service` folder as a Web Service.
2. Ensure Python environment is selected.
3. Start command: `gunicorn app:app`.

### Deploying Backend & AI on Render (recommended)
1. Create two services on Render (or use `render.yaml` provided):
	 - **Service 1**: `medimind-server` (type: Web Service, environment: Node)
		 - Root directory: `server`
		 - Build command: `npm install`
		 - Start command: `node index.js`
		 - Set environment variables: `MONGO_URI`, `JWT_SECRET`, `PYTHON_AI_URL`, `CLIENT_URL`
	 - **Service 2**: `medimind-ai` (type: Web Service, environment: Python)
		 - Root directory: `ai_service`
		 - Build command: `pip install -r requirements.txt`
		 - Start command: `gunicorn app:app --bind 0.0.0.0:$PORT`
		 - (Optional) Set `PORT` to `5001` or leave default and set `PYTHON_AI_URL` in server accordingly.
2. Use the included `render.yaml` to deploy both services declaratively (adjust placeholders before pushing).
3. In Render dashboard, add secrets for `MONGO_URI` and `JWT_SECRET` (mark as secure).
4. Update `server` service `PYTHON_AI_URL` to point to the deployed `medimind-ai` URL.

### Vercel (Frontend) + Render (Backend) Quick Checklist
- Push repository to GitHub.
- Create a Vercel project and point it at the repo for frontend deployment.
- Create two Render services (server + ai) or import `render.yaml`.
- Add required environment variables in Render; do NOT commit secrets to the repo.
- Verify CORS `CLIENT_URL` on the `server` matches Vercel URL.


---

## 📄 API Documentation Overview

### Authentication
*   `POST /api/auth/register`: Register a new user.
*   `POST /api/auth/login`: Authenticate and receive JWT.
*   `GET /api/auth/me`: Get current user profile.

### Medicines
*   `GET /api/medicines`: Fetch all medicines.
*   `POST /api/medicines`: Add a new medicine.
*   `PUT /api/medicines/:id`: Update medicine details.

### Reminders
*   `GET /api/reminders`: Fetch active reminders.
*   `POST /api/reminders`: Create a scheduled reminder.

### Analytics & AI
*   `GET /api/analytics`: Fetch weekly adherence trends.
*   `POST /api/analytics/predict`: Send user data to Python service and receive risk probability.

---

## 🔒 Security & Privacy

*   **Passwords**: Salted and hashed using `bcrypt` (Cost Factor: 10).
*   **Routes**: Protected via custom JWT Middleware checking token validity on every secure request.
*   **Data Isolation**: All database queries strictly scope to `req.user.id` to prevent cross-account data leakage.

---

> Built with ❤️ for the future of healthcare.
