const mongoose = require('mongoose');

// Define the attendance schema
const attendanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['present', 'absent'], default: 'absent' },
    enteredAt: { type: String, default: '-' },
    exitedAt: { type: String, default: '-' },
    date: { type: Date, default: Date.now }
});

// Function to get the daily attendance model based on the current date
function getDailyAttendanceModel(date = new Date()) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error('Invalid Date object');
    }
    
    const dateString = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    const collectionName = `attendance_${dateString}`;

    // Check if model already exists to avoid overwriting
    if (mongoose.models[collectionName]) {
        return mongoose.model(collectionName);
    }

    // Define and create the model if it does not exist
    return mongoose.model(collectionName, attendanceSchema, collectionName);
}

module.exports = getDailyAttendanceModel;
