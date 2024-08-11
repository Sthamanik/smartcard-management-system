import React, { useState, useRef } from 'react';
import axios from 'axios';

// AttendancePortal Component
const AttendancePortal = () => {
  const videoRef = useRef(null);
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [error, setError] = useState(null);

  const handleStartCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch(err => {
        setError("Error accessing camera: " + err.message);
      });
  };

  const handleCaptureQRCode = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (videoRef.current && context) {
      const { videoWidth, videoHeight } = videoRef.current;
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

      canvas.toBlob(blob => handleScanQRCode(blob), 'image/jpeg');
    }
  };

  const handleScanQRCode = async (blob) => {
    try {
      const formData = new FormData();
      formData.append('frame', blob);

      const response = await axios.post('http://localhost:5001/scan_qr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.decrypted_message) {
        setDecryptedMessage(response.data.decrypted_message);
        await markAttendance(response.data.decrypted_message);
      } else {
        setError("Failed to decode QR code.");
      }
    } catch (err) {
      setError("Error scanning QR code: " + (err.response?.data?.message || err.message));
    }
  };

  const markAttendance = async (message) => {
    try {
      const response = await axios.post('http://localhost:5001/mark_attendance', { message });
      if (response.data.success) {
        alert("Attendance marked successfully.");
      } else {
        setError("Failed to mark attendance.");
      }
    } catch (err) {
      setError("Error marking attendance: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-6 text-center text-gray-800">QR Code Scanner</h2>
      <div className="flex justify-center mb-4">
        <video ref={videoRef} width="100%" height="auto" />
      </div>
      <div className="flex justify-center mb-4">
        <button
          onClick={handleStartCamera}
          className="py-2 px-4 bg-indigo-600 text-white font-bold rounded-md shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Start Camera
        </button>
      </div>
      <div className="flex justify-center mb-4">
        <button
          onClick={handleCaptureQRCode}
          className="py-2 px-4 bg-green-600 text-white font-bold rounded-md shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Scan QR Code
        </button>
      </div>
      {decryptedMessage && (
        <p className="text-center text-green-600">Decrypted Message: {decryptedMessage}</p>
      )}
      {error && (
        <p className="text-center text-red-600">Error: {error}</p>
      )}
    </div>
  );
};

export default AttendancePortal;
