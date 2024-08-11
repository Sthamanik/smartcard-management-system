from flask import Flask, request, jsonify
from flask_cors import CORS
import qrcode
from cryptography.fernet import Fernet
import os

app = Flask(__name__, static_folder='static', static_url_path='/static')
CORS(app)

# Static encryption key
key = b'6Ep1L1K3Wkf10xtxuBbDMpsMMxq6OIh2Aap1W6fK34I='
cipher_suite = Fernet(key)

@app.route('/register', methods=['POST'])
def register():
    try:
        # Get JSON data from the request
        data = request.get_json()
        name = data['name']
        email = data['email']
        password = data['password']
        address = data['address']
        dob = data['DOB']
        gender = data['gender']
        contact = data['contact']
        role = data['role']
        faculty = data.get('faculty', '')
        batch = data.get('batch', '')
        uid = data.get('uid', '')
        key = data.get('key', '')

        # Prepare data to be encrypted
        data_list = [name, email, password, address, dob, gender, contact, role, faculty, batch, uid, key]
        data_list_str = "\n".join(data_list)

        # Encrypt the data
        encrypted_message = cipher_suite.encrypt(data_list_str.encode())

        # Generate the QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4
        )
        qr.add_data(encrypted_message)
        qr.make(fit=True)

        # Create an image from the QR Code instance
        img = qr.make_image(fill='black', back_color='white')

        # Ensure the 'static' directory exists
        static_dir = os.path.join('E:\\project\\frontend\\public\\assets\\qrs')
        if not os.path.exists(static_dir):
            os.makedirs(static_dir)

        # Save the image
        img_path = os.path.join(static_dir, contact)+".jpg"
        img.save(img_path)

        return jsonify({"success": True, "message": "QR code generated and saved successfully.", "qr_url": contact + ".jpg"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
