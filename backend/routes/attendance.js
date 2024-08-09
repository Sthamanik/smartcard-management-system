const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const getDailyAttendanceModel = require('../models/Attendance');

// Middleware to create attendance records for all users
async function createDailyAttendanceRecords(req, res, next) {
    const date = new Date();
    const Attendance = getDailyAttendanceModel(date);

    try {
        const users = await User.find();
        const attendanceRecords = users.map(user => ({
            userId: user._id,
            status: 'absent', // Default status
            enteredAt: '-',
            exitedAt: '-',
        }));

        await Attendance.insertMany(attendanceRecords);
        next();
    } catch (error) {
        res.status(500).json({ error: 'Error creating daily attendance records' });
    }
}

// Route to mark attendance for a user
router.post('/mark-attendance/:userId', createDailyAttendanceRecords, async (req, res) => {
    const { userId } = req.params;
    const date = new Date();
    const Attendance = getDailyAttendanceModel(date);

    try {
        const attendance = await Attendance.findOneAndUpdate(
            { userId },
            { status: 'present', enteredAt: new Date().toLocaleTimeString() },
            { new: true }
        );
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ error: 'Error marking attendance' });
    }
});

module.exports = router;
