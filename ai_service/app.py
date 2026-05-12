from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import os

app = Flask(__name__)
CORS(app)

import pickle
from datetime import datetime

# Load the trained ML model
model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
model = None
if os.path.exists(model_path):
    try:
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        print("✅ ML Model loaded successfully.")
    except Exception as e:
        print(f"❌ Failed to load model: {e}")

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json() or {}
    
    # Extract features
    past_rates = data.get('past_adherence_rates', [0.9, 0.85, 0.95])
    avg_rate = sum(past_rates) / len(past_rates) if past_rates else 0.85
    
    # Get current time features
    now = datetime.now()
    hour = now.hour
    day = now.weekday() # 0 = Monday, 6 = Sunday
    
    # Predict using the model if available
    if model:
        try:
            # Features: past_rate, hour, day_of_week
            features = [[avg_rate, hour, day]]
            # predict_proba returns [prob_class_0, prob_class_1]
            risk_prob = float(model.predict_proba(features)[0][1])
            risk_prob = round(risk_prob, 2)
            is_real_ai = True
        except Exception as e:
            print(f"Prediction error: {e}")
            risk_prob = round(1 - avg_rate, 2)
            is_real_ai = False
    else:
        # Fallback to simple calculation
        risk_prob = round(1 - avg_rate, 2)
        is_real_ai = False
    
    # Determine risk level and recommendation
    if risk_prob < 0.2:
        risk_level = "Low"
        recommendation = "Great job! Maintain your current schedule."
    elif risk_prob < 0.5:
        risk_level = "Medium"
        recommendation = "You missed a few doses. Try setting a secondary reminder."
    else:
        risk_level = "High"
        recommendation = "High risk of missing doses! Consider using a pill organizer."
        
    return jsonify({
        "success": True,
        "prediction": {
            "missed_dose_probability": risk_prob,
            "risk_level": risk_level,
            "confidence": 0.85 if is_real_ai else 0.5,
            "recommendation": recommendation,
            "using_real_ai": is_real_ai,
            "features_used": {
                "avg_rate": round(avg_rate, 2),
                "hour": hour,
                "day_of_week": day
            }
        }
    })


@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    # Simulate fetching analytics data
    return jsonify({
        "success": True,
        "adherence_rate": 92.5,
        "weekly_trends": [
            {"name": "Mon", "percentage": 100},
            {"name": "Tue", "percentage": 85},
            {"name": "Wed", "percentage": 100},
            {"name": "Thu", "percentage": 70},
            {"name": "Fri", "percentage": 95},
            {"name": "Sat", "percentage": 100},
            {"name": "Sun", "percentage": 90}
        ],
        "best_time": "08:30 AM",
        "worst_time": "10:00 PM"
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    
    responses = [
        "I understand you are asking about your medication. It's important to take it on time.",
        "Based on your history, you are doing well with adherence.",
        "If you missed a dose, consult your doctor or check the instruction on the medicine.",
        "I can help you schedule a reminder for that."
    ]
    
    return jsonify({
        "success": True,
        "response": random.choice(responses)
    })

if __name__ == '__main__':
    debug_mode = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    port = int(os.environ.get('PORT', 5001))
    app.run(port=port, debug=debug_mode)
