from flask import Flask, jsonify, request
from flask_cors import CORS
import cv2
import numpy as np
from cryptography.fernet import Fernet
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains

# Global variable to store the decrypted message
decrypted_message_global = ""

@app.route('/scan_qr', methods=['POST'])
def scan_qr():
    global decrypted_message_global

    if 'frame' not in request.files:
        return jsonify(decrypted_message="No frame received"), 400

    frame = request.files['frame'].read()
    nparr = np.frombuffer(frame, np.uint8)
    img_np = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    _, _, decrypted_message, _ = decode_qr_code(img_np)

    if decrypted_message:
        register_response = register_user(decrypted_message)
        if register_response and register_response.status_code == 200:
            return jsonify(decrypted_message=decrypted_message, registration_status="Success")
        else:
            return jsonify(decrypted_message=decrypted_message, registration_status="Failed"), 500
    else:
        return jsonify(decrypted_message=decrypted_message, registration_status="No valid data"), 400

def decode_qr_code(frame):
    global decrypted_message_global

    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    qr_detector = cv2.QRCodeDetector()
    retval, decoded_info, points, _ = qr_detector.detectAndDecodeMulti(gray_frame)

    key = b'6Ep1L1K3Wkf10xtxuBbDMpsMMxq6OIh2Aap1W6fK34I='  # Static encryption key
    cipher_suite = Fernet(key)
    decrypted_message = ""
    qr_detected = False

    if retval:
        for info, point in zip(decoded_info, points):
            if len(point) == 4:
                for i in range(4):
                    pt1 = tuple(map(int, point[i]))
                    pt2 = tuple(map(int, point[(i + 1) % 4]))
                    cv2.line(frame, pt1, pt2, (0, 255, 0), 2)

            try:
                decrypted_message = cipher_suite.decrypt(info.encode()).decode()
                decrypted_message_global = decrypted_message
                qr_detected = True
            except Exception as e:
                print(f"Decryption failed: {e}")

    return frame, "", decrypted_message, qr_detected

def register_user(decrypted_message):
    registration_url = 'http://localhost:5000/register'  # Update to your registration endpoint
    registration_data = {
        'data': decrypted_message
    }

    try:
        response = requests.post(registration_url, json=registration_data)
        return response
    except requests.RequestException as e:
        print(f"Registration request failed: {e}")
        return None

if __name__ == "__main__":
    app.run(port=5001, debug=True, use_reloader=False)
