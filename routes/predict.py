import pickle
import sys

# Load the model
with open('dctmodel.pkl', 'rb') as f:
    loaded_model = pickle.load(f)

# Define a function to perform predictions
def predict(features):
    try:
        features = [float(x) for x in features]
        pred_value = loaded_model.predict([features])
        return pred_value[0]
    except Exception as e:
        return str(e)

# Parse the input features from command-line arguments
features = sys.argv[2:]  # Start from index 2 to exclude script name and command
prediction = predict(features)
print(prediction)
