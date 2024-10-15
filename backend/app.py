from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from PIL import Image
import os
import numpy as np
import io
from keras.models import load_model
from keras.layers import PReLU
import tensorflow as tf
import keras
import matplotlib.pyplot as plt
from tensorflow.keras.preprocessing.image import load_img, img_to_array

# Setting Keras backend to TensorFlow
os.environ["KERAS_BACKEND"] = "tensorflow"

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Define the upload folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Custom loss function and squash function for the model
def squash(x, axis=-1):
    s_squared_norm = tf.reduce_sum(tf.square(x), axis=axis, keepdims=True)
    scale = s_squared_norm / (1 + s_squared_norm) / tf.sqrt(s_squared_norm + tf.keras.backend.epsilon())
    return scale * x

def loss_fn(y_true, y_pred):
    L = y_true * tf.square(tf.maximum(0., 0.9 - y_pred)) + \
        0.45 * (1 - y_true) * tf.square(tf.maximum(0., y_pred - 0.1))
    return tf.reduce_mean(tf.reduce_sum(L, axis=1))

# Load model with custom layers and loss function
custom_objects = {
    'loss_fn': loss_fn,
    'squash': squash,
    'PReLU': PReLU
}
model = load_model('C:/Users/PVR SUDHAKAR/Desktop/NarayanaInterface/backend/filter model/FilterModelTestingOutput2.h5', custom_objects=custom_objects)

# Print model summary
print(model.summary())

def preprocess_image(file, target_size):
    # Convert the file to a PIL image
    image = Image.open(io.BytesIO(file.read()))  # Use io.BytesIO to handle the file stream
    image = image.convert("RGB")  # Convert to RGB
    image = image.resize(target_size)  # Resize the image to the target size
    image = img_to_array(image)  # Convert to numpy array
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    image /= 255.0  # Normalize to [0, 1] range
    return image

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    preclass = {0: "Xray", 1: "CT-Scan", 2: "Ultra Sound", 3: "Cannot Identify"}

    if file:
        # Preprocess the uploaded image
        processed_image = preprocess_image(file, target_size=(128, 128))

        # Predict using the model
        results = model.predict(processed_image)
        response = preclass[np.argmax(results)]

        # Save original image to disk
        original_filename = file.filename
        save_path = os.path.join(UPLOAD_FOLDER, original_filename)
        file.seek(0)
        file.save(save_path)

        # Generate Grad-CAM heatmap
        last_conv_layer_name = "conv2d_2"
        img_array = preprocess_image(file, target_size=(128, 128))
        heatmap = make_gradcam_heatmap(img_array, model, last_conv_layer_name)

        # Generate Grad-CAM output image
        gradcam_img_io = save_gradcam_image(save_path, heatmap)

        # Clean up by deleting the saved image
        try:
            os.remove(save_path)
        except Exception as e:
            print(f"Error deleting file {save_path}: {e}")

        # Return the Grad-CAM image to the frontend
        return send_file(gradcam_img_io, mimetype='image/png')

# Health check route
@app.route('/', methods=['GET'])
def check():
    return '<h1>Server is running</h1>'

if __name__ == '__main__':
    app.run(debug=True, port=5000)
