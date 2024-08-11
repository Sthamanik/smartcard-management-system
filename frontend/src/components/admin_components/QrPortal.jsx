import React from 'react';

const QrPortal = () => {
    // Get the number from localStorage
    const num = localStorage.getItem('number');

    // Construct the image URL
    const imageUrl = `/assets/qrs/${num}.jpg`;

    return (
        <div>
            <img src={imageUrl} alt="QR Code" />
        </div>
    );
};

export default QrPortal;
