const mongoose = require('mongoose');

// Define the attendance schema
const attendanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['present', 'absent'], default: 'absent' },
    enteredAt: { type: String, default: '-' },
    exitedAt: { type: String, default: '-' },
});

// Function to get the daily attendance model based on the current date
function getDailyAttendanceModel(date = new Date()) {
    const dateString = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    const collectionName = `attendance_${dateString}`;

    if (mongoose.models[collectionName]) {
        return mongoose.model(collectionName);
    }

    const DailyAttendanceSchema = new mongoose.Schema(attendanceSchema.obj);
    return mongoose.model(collectionName, DailyAttendanceSchema);
}

module.exports = getDailyAttendanceModel;
