from flask import Flask, render_template, jsonify, request
import cv2
import numpy as np
from cryptography.fernet import Fernet

app = Flask(__name__)

# Global variable to store the decrypted message
decrypted_message_global = ""

@app.route('/')
def index():
    return render_template('main.html')

@app.route('/decrypted_message')
def get_decrypted_message():
    return jsonify(decrypted_message=decrypted_message_global)

@app.route('/scan_qr', methods=['POST'])
def scan_qr():
    global decrypted_message_global

    if 'frame' not in request.files:
        return jsonify(decrypted_message="No frame received"), 400

    frame = request.files['frame'].read()
    nparr = np.frombuffer(frame, np.uint8)
    img_np = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    frame, qr_data, decrypted_message, qr_detected = decode_qr_code(img_np)

    return jsonify(decrypted_message=decrypted_message)

def decode_qr_code(frame):
    global decrypted_message_global

    # Convert the frame to grayscale
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Create a QRCode detector object
    qr_detector = cv2.QRCodeDetector()

    # Detect and decode the QR codes
    retval, decoded_info, points, _ = qr_detector.detectAndDecodeMulti(gray_frame)
    qr_data = ""
    key = b'6Ep1L1K3Wkf10xtxuBbDMpsMMxq6OIh2Aap1W6fK34I='  # Static encryption key used
    cipher_suite = Fernet(key)
    decrypted_message = ""
    qr_detected = False

    if retval:
        for info, point in zip(decoded_info, points):
            # Draw rectangle around the QR code (optional for debugging)
            if len(point) == 4:
                for i in range(4):
                    pt1 = tuple(map(int, point[i]))
                    pt2 = tuple(map(int, point[(i + 1) % 4]))
                    cv2.line(frame, pt1, pt2, (0, 255, 0), 2)

            try:
                # Decrypt the message
                decrypted_message = cipher_suite.decrypt(info.encode()).decode()
                print(f"Decrypted message: {decrypted_message}")  # Decrypted message

                # Update the global decrypted message
                decrypted_message_global = decrypted_message
                qr_detected = True
            except Exception as e:
                print(f"Decryption failed: {e}")

    return frame, qr_data, decrypted_message, qr_detected

if __name__ == "__main__":
    app.run(debug=False, use_reloader=False)
