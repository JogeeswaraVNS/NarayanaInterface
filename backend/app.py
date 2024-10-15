from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import os
import numpy as np
import io
from keras.models import load_model
from keras.layers import PReLU
import tensorflow as tf
import base64
import matplotlib.pyplot as plt
from tensorflow.keras.preprocessing.image import img_to_array

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

def preprocess_image(file, target_size):
    """Preprocess the uploaded image file for model prediction."""
    file.seek(0)
    image = Image.open(io.BytesIO(file.read()))
    image = image.convert('RGB')
    image = image.resize(target_size)
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    return image

def make_gradcam_heatmap(img_array, model, last_conv_layer_name, pred_index=None):
    """Generate a Grad-CAM heatmap for the specified convolutional layer."""
    grad_model = tf.keras.models.Model([model.inputs], [model.get_layer(last_conv_layer_name).output, model.output])
    
    with tf.GradientTape() as tape:
        last_conv_layer_output, preds = grad_model(img_array)
        if pred_index is None:
            pred_index = tf.argmax(preds[0])
        class_channel = preds[:, pred_index]

    grads = tape.gradient(class_channel, last_conv_layer_output)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    last_conv_layer_output = last_conv_layer_output[0]
    heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)
    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    return heatmap.numpy()

def save_gradcam_image(img_array, heatmap, alpha=0.4):
    """Overlay the Grad-CAM heatmap on the original image."""
    img = img_array[0]
    heatmap = np.uint8(255 * heatmap)
    jet = plt.get_cmap("jet")
    jet_colors = jet(np.arange(256))[:, :3]
    jet_heatmap = jet_colors[heatmap]

    jet_heatmap = Image.fromarray((jet_heatmap * 255).astype(np.uint8))
    jet_heatmap = jet_heatmap.resize((img.shape[1], img.shape[0]))

    jet_heatmap = img_to_array(jet_heatmap)
    superimposed_img = jet_heatmap * alpha + img
    superimposed_img = np.clip(superimposed_img, 0, 255).astype(np.uint8)

    img_io = io.BytesIO()
    Image.fromarray(superimposed_img).save(img_io, 'PNG')
    img_io.seek(0)

    return img_io

def encode_image_to_base64(image):
    """Convert an image to a Base64 string."""
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle file upload and generate Grad-CAM images."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if file:
        processed_image = preprocess_image(file, target_size=(128, 128))
        results = model.predict(processed_image)

        # Save original image to buffer and encode in Base64
        original_image = Image.open(io.BytesIO(file.read()))
        original_image_base64 = encode_image_to_base64(original_image)

        # Grad-CAM processing
        conv_layers = ["conv2d_1", "conv2d_2", "conv2d_3", "conv2d_4"]
        gradcam_images = []

        for layer in conv_layers:
            heatmap = make_gradcam_heatmap(processed_image, model, layer)
            gradcam_img_io = save_gradcam_image(processed_image, heatmap)
            
            # Encode Grad-CAM image in Base64
            encoded_image = base64.b64encode(gradcam_img_io.getvalue()).decode('utf-8')
            gradcam_images.append(encoded_image)

        # Send original image and Grad-CAM images as Base64 strings
        return jsonify({
            'original_image': original_image_base64,
            'gradcams': gradcam_images
        })

# Health check route
@app.route('/', methods=['GET'])
def check():
    """Health check for the server."""
    return '<h1>Server is running</h1>'

if __name__ == '__main__':
    app.run(debug=True, port=5000)
