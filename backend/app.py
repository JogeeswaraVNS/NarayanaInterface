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

os.environ["KERAS_BACKEND"] = "tensorflow"

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def squash(x, axis=-1):
    s_squared_norm = tf.reduce_sum(tf.square(x), axis=axis, keepdims=True)
    scale = s_squared_norm / (1 + s_squared_norm) / tf.sqrt(s_squared_norm + tf.keras.backend.epsilon())
    return scale * x

def loss_fn(y_true, y_pred):
    L = y_true * tf.square(tf.maximum(0., 0.9 - y_pred)) + \
        0.45 * (1 - y_true) * tf.square(tf.maximum(0., y_pred - 0.1))
    return tf.reduce_mean(tf.reduce_sum(L, axis=1))

custom_objects = {
    'loss_fn': loss_fn,
    'squash': squash,
    'PReLU': PReLU
}
model = load_model('C:/Users/PVR SUDHAKAR/Desktop/NarayanaInterface/backend/filter model/FilterModelTestingOutput2.h5', custom_objects=custom_objects)

xray_model=load_model('C:/Users/PVR SUDHAKAR/Desktop/NarayanaInterface/Narayana Imp Files/XrayModel.h5', custom_objects=custom_objects)

ctscan_model=load_model('C:/Users/PVR SUDHAKAR/Desktop/NarayanaInterface/Narayana Imp Files/CtscanModel.h5', custom_objects=custom_objects)

ultrasound_model=load_model('C:/Users/PVR SUDHAKAR/Desktop/NarayanaInterface/Narayana Imp Files/UltraSoundModel.h5', custom_objects=custom_objects)



def preprocess_image(file, target_size):
    try:
        file.seek(0)
        image = Image.open(io.BytesIO(file.read()))
        image = image.convert('RGB')
        image = image.resize(target_size)
        image = img_to_array(image)
        image = np.expand_dims(image, axis=0)
        return image
    except Exception as e:
        print(f"Error processing image: {e}")
        raise e


# Helper function to generate Grad-CAM heatmap
def make_gradcam_heatmap(img_array, model, last_conv_layer_name, pred_index=None):
    grad_model = keras.models.Model(model.inputs, [model.get_layer(last_conv_layer_name).output, model.output])
    
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

# Function to save Grad-CAM image and return it as an in-memory file
def save_gradcam_image(img_path, heatmap, alpha=0.4):
    img = load_img(img_path)
    img = img_to_array(img)

    heatmap = np.uint8(255 * heatmap)
    jet = plt.get_cmap("jet")
    jet_colors = jet(np.arange(256))[:, :3]
    jet_heatmap = jet_colors[heatmap]

    jet_heatmap = tf.keras.preprocessing.image.array_to_img(jet_heatmap)
    jet_heatmap = jet_heatmap.resize((img.shape[1], img.shape[0]))

    jet_heatmap = img_to_array(jet_heatmap)
    superimposed_img = jet_heatmap * alpha + img
    superimposed_img = np.clip(superimposed_img, 0, 255).astype(np.uint8)

    img_io = io.BytesIO()
    Image.fromarray(superimposed_img).save(img_io, 'PNG')
    img_io.seek(0)
    
    return img_io

# Route to give filter results
@app.route('/Prediction', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    preclass = {0: "Xray", 1: "CT-Scan", 2: "Ultra Sound", 3: "Cannot Identify"}

    if file:
        processed_image = preprocess_image(file, target_size=(128, 128))
        results = model.predict(processed_image)
        for i in results:
            print(i)
        response = preclass[np.argmax(results)]
        print(response)
        return jsonify(response)
    
    
# Route to give results
@app.route('/PredictionResult/<FilterResult>', methods=['POST'])
def get_result(FilterResult):
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    preclass = {0: "Positive", 1: "Negative"}

    if file:
        results=''
        processed_image = preprocess_image(file, target_size=(128, 128))
        if FilterResult=='Xray':
            results = xray_model.predict(processed_image)
        elif FilterResult=='CT-Scan':
            results = ctscan_model.predict(processed_image)
        elif FilterResult=='Ultra Sound':
            results = ultrasound_model.predict(processed_image)
        response = preclass[np.argmax(results)]
        print(response)
        return jsonify(response)  
    
    
# Route to handle file uploads and Grad-CAM generation Layer 1
@app.route('/GradCamLayer1/<FilterResult>', methods=['POST'])
def gradcam_layer_1(FilterResult):
    print(FilterResult,'FilterResult')
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    preclass = {0: "Positive", 1: "Negative"}
    last_conv_layer_name = "conv2d_1"
    if file:
        if FilterResult=='Xray':
            processed_image = preprocess_image(file, target_size=(128, 128))
            results = xray_model.predict(processed_image)
            response = preclass[np.argmax(results)]
            
            original_filename = file.filename
            save_path = os.path.join(UPLOAD_FOLDER, original_filename)
            file.seek(0)
            file.save(save_path)

            img_array = preprocess_image(file, target_size=(128, 128))
            heatmap = make_gradcam_heatmap(img_array, xray_model, last_conv_layer_name)

            gradcam_img_io = save_gradcam_image(save_path, heatmap)

            try:
                os.remove(save_path)
            except Exception as e:
                print(f"Error deleting file {save_path}: {e}")

            return send_file(gradcam_img_io, mimetype='image/png')
        elif FilterResult=='CT-Scan':
            processed_image = preprocess_image(file, target_size=(128, 128))
            results = ctscan_model.predict(processed_image)
            response = preclass[np.argmax(results)]
            
            original_filename = file.filename
            save_path = os.path.join(UPLOAD_FOLDER, original_filename)
            file.seek(0)
            file.save(save_path)

            img_array = preprocess_image(file, target_size=(128, 128))
            heatmap = make_gradcam_heatmap(img_array, ctscan_model, last_conv_layer_name)

            gradcam_img_io = save_gradcam_image(save_path, heatmap)

            try:
                os.remove(save_path)
            except Exception as e:
                print(f"Error deleting file {save_path}: {e}")

            return send_file(gradcam_img_io, mimetype='image/png')
        elif FilterResult=='Ultra Sound':
            processed_image = preprocess_image(file, target_size=(128, 128))
            results = ultrasound_model.predict(processed_image)
            response = preclass[np.argmax(results)]
            
            original_filename = file.filename
            save_path = os.path.join(UPLOAD_FOLDER, original_filename)
            file.seek(0)
            file.save(save_path)

           
            img_array = preprocess_image(file, target_size=(128, 128))
            heatmap = make_gradcam_heatmap(img_array, ultrasound_model, last_conv_layer_name)

            gradcam_img_io = save_gradcam_image(save_path, heatmap)

            try:
                os.remove(save_path)
            except Exception as e:
                print(f"Error deleting file {save_path}: {e}")

            return send_file(gradcam_img_io, mimetype='image/png')
    else:
        return jsonify("Error")
    
    
# Route to handle file uploads and Grad-CAM generation Layer 2
@app.route('/GradCamLayer2/<FilterResult>', methods=['POST'])
def gradcam_layer_2(FilterResult):
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    preclass = {0: "Positive", 1: "Negative"}
    last_conv_layer_name = "conv2d_2"
    if file:
        if FilterResult=='Xray':
            processed_image = preprocess_image(file, target_size=(128, 128))
            results = xray_model.predict(processed_image)
            response = preclass[np.argmax(results)]
            
            original_filename = file.filename
            save_path = os.path.join(UPLOAD_FOLDER, original_filename)
            file.seek(0)
            file.save(save_path)

            img_array = preprocess_image(file, target_size=(128, 128))
            heatmap = make_gradcam_heatmap(img_array, xray_model, last_conv_layer_name)

            gradcam_img_io = save_gradcam_image(save_path, heatmap)

            try:
                os.remove(save_path)
            except Exception as e:
                print(f"Error deleting file {save_path}: {e}")

            return send_file(gradcam_img_io, mimetype='image/png')
        elif FilterResult=='CT-Scan':
            processed_image = preprocess_image(file, target_size=(128, 128))
            results = ctscan_model.predict(processed_image)
            response = preclass[np.argmax(results)]
            
            original_filename = file.filename
            save_path = os.path.join(UPLOAD_FOLDER, original_filename)
            file.seek(0)
            file.save(save_path)

            img_array = preprocess_image(file, target_size=(128, 128))
            heatmap = make_gradcam_heatmap(img_array, ctscan_model, last_conv_layer_name)

            gradcam_img_io = save_gradcam_image(save_path, heatmap)

            try:
                os.remove(save_path)
            except Exception as e:
                print(f"Error deleting file {save_path}: {e}")

            return send_file(gradcam_img_io, mimetype='image/png')
        elif FilterResult=='Ultra Sound':
            processed_image = preprocess_image(file, target_size=(128, 128))
            results = ultrasound_model.predict(processed_image)
            response = preclass[np.argmax(results)]
            
            original_filename = file.filename
            save_path = os.path.join(UPLOAD_FOLDER, original_filename)
            file.seek(0)
            file.save(save_path)

           
            img_array = preprocess_image(file, target_size=(128, 128))
            heatmap = make_gradcam_heatmap(img_array, ultrasound_model, last_conv_layer_name)

            gradcam_img_io = save_gradcam_image(save_path, heatmap)

            try:
                os.remove(save_path)
            except Exception as e:
                print(f"Error deleting file {save_path}: {e}")

            return send_file(gradcam_img_io, mimetype='image/png')
    

@app.route('/', methods=['GET'])
def check():
    return '<h1>Server is running</h1>'

if __name__ == '__main__':
    app.run(debug=True, port=5000)