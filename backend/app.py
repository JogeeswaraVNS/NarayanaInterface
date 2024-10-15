from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image
import os
import numpy as np
import io
from keras.models import load_model
from keras.layers import PReLU
from tensorflow.keras.preprocessing.image import img_to_array

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load the model (uncomment when model is available)
# model = load_model('C:/Users/jogee/Desktop/Narayana 1.0/frontend/backend/filter model/FilterModel.h5', 
#                    custom_objects={'PReLU': PReLU})

def preprocess_image(file, target_size):
    # Convert the file to a PIL image
    image = Image.open(io.BytesIO(file.read()))  # Use io.BytesIO to handle the file stream
    image = image.convert("RGB")  # Convert to RGB
    image = image.resize(target_size)  # Resize the image to the target size
    image = img_to_array(image)  # Convert to numpy array
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    # image /= 255.0  # Normalize to [0, 1] range
    return image

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    preclass = {0: "Positive", 1: "Negative"}
    response = preclass[1]  # Default response

    if file:
        processed_image = preprocess_image(file, target_size=(64, 64))

        # Uncomment the following lines once the model is available
        # results = model.predict(processed_image)
        # response = preclass[np.argmax(results)]

        # Save the original file
        original_filename = file.filename
        save_path = os.path.join(UPLOAD_FOLDER, original_filename)
        file.seek(0)  # Move the file pointer to the beginning for saving
        file.save(save_path)

        # Delete the saved file after processing
        try:
            os.remove(save_path)
            print(f"Deleted file: {save_path}")
        except Exception as e:
            print(f"Error deleting file {save_path}: {e}")

    print(response)
    return jsonify({'result': response})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
