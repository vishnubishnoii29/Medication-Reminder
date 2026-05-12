import numpy as np
from sklearn.ensemble import RandomForestClassifier
import pickle
import os
from datetime import datetime

def train_and_save_model():
    print("Generating synthetic data for training...")
    
    # Generate 1000 samples
    np.random.seed(42)
    n_samples = 1000
    
    # Feature 1: Average past adherence rate (0.5 to 1.0)
    past_rates = np.random.uniform(0.5, 1.0, n_samples)
    
    # Feature 2: Hour of the day (0 to 23)
    hours = np.random.randint(0, 24, n_samples)
    
    # Feature 3: Day of the week (0 to 6)
    days = np.random.randint(0, 7, n_samples)
    
    # Target: Missed dose (0 = No, 1 = Yes)
    missed_dose = []
    for i in range(n_samples):
        # Base probability depends on past rate
        prob = 1 - past_rates[i]
        
        # Increase probability if it's late night (22:00 to 04:00)
        if hours[i] >= 22 or hours[i] <= 4:
            prob += 0.2
            
        # Increase probability slightly on weekends (5 = Sat, 6 = Sun)
        if days[i] >= 5:
            prob += 0.1
            
        # Clip probability between 0 and 1
        prob = np.clip(prob, 0, 1)
        
        # Generate label
        missed_dose.append(np.random.choice([0, 1], p=[1-prob, prob]))
        
    missed_dose = np.array(missed_dose)
    
    # Stack features into X
    X = np.column_stack((past_rates, hours, days))
    y = missed_dose
    
    print("Training RandomForestClassifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Save the model
    model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
        
    print(f"Model saved successfully to {model_path}")
    print("Model accuracy on training data:", model.score(X, y))

if __name__ == '__main__':
    train_and_save_model()
