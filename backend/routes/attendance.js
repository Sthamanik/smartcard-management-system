const express = require('express');
const router = express.Router();
const getDailyAttendanceModel = require('../models/automatedAttendanced'); // Adjust the path as needed
const User = require('../models/Users'); // Adjust the path as needed

// Helper function to create or update attendance records for all users
async function ensureDailyAttendance(date) {
    const AttendanceModel = getDailyAttendanceModel(date);
    const users = await User.find({}); // Get all users

    // Create attendance record for each user if it doesn't exist
    const attendancePromises = users.map(user => 
        AttendanceModel.findOneAndUpdate(
            { userId: user._id, date: date },
            {
                status: 'absent', // Default status
                enteredAt: null,
                exitedAt: null
            },
            { upsert: true, new: true }
        )
    );

    await Promise.all(attendancePromises);
}

// Route to ensure attendance records are created/updated
router.post('/attendance', async (req, res) => {
    const { date } = req.body;
    const attendanceDate = new Date(date);

    try {
        await ensureDailyAttendance(attendanceDate);
        res.status(200).json({ message: 'Attendance records ensured for today' });
    } catch (err) {
        res.status(500).json({ message: 'Error ensuring attendance records', error: err });
    }
});

// Get attendance record for a specific date and user
router.get('/attendance/:userId/:date', async (req, res) => {
    const { userId, date } = req.params;
    const attendanceDate = new Date(date);

    try {
        const AttendanceModel = getDailyAttendanceModel(attendanceDate);
        const record = await AttendanceModel.findOne({ userId: userId, date: attendanceDate });

        if (record) {
            res.status(200).json(record);
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving attendance', error: err });
    }
});

module.exports = router;
