import os
from flask import Flask, request, jsonify
import qrcode
from cryptography.fernet import Fernet

app = Flask(__name__, static_folder='static', static_url_path='')

# Static encryption key
key = b'6Ep1L1K3Wkf10xtxuBbDMpsMMxq6OIh2Aap1W6fK34I='
cipher_suite = Fernet(key)

@app.route('/register', methods=['POST'])
def register():
    try:
        # Get form data
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        address = request.form['address']
        dob = request.form['DOB']
        gender = request.form['gender']
        contact = request.form['contact']
        role = request.form['role']
        faculty = request.form.get('faculty', '')
        batch = request.form.get('batch', '')
        uid = request.form.get('uid', '')
        key = request.form.get('key', '')

        # Prepare data to be encrypted
        data_list = [name, email, password, address, dob, gender, contact, role, faculty, batch, uid, key]
        data_list_str = "\n".join(data_list)

        # Encrypt the data
        encrypted_message = cipher_suite.encrypt(data_list_str.encode())

        # Generate the QR
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
        static_dir = os.path.join(os.getcwd(), 'static')
        if not os.path.exists(static_dir):
            os.makedirs(static_dir)

        # Save the image
        img_path = os.path.join(static_dir, "encrypted_qr_code.png")
        img.save(img_path)

        return jsonify({"success": True, "message": "QR code generated and saved successfully."}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
