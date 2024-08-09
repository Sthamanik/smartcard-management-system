const express = require('express');
const router = express.Router();
const User = require('../models/Users'); // Ensure this path is correct
const getDailyAttendanceModel = require('../models/Attendance');

// Middleware to create attendance records for all users if not already present
async function createDailyAttendanceRecords(req, res, next) {
    const date = new Date();
    const Attendance = getDailyAttendanceModel(date);

    try {
        // Fetch all users from the database
        const users = await User.find();
        
        // Prepare attendance records for each user
        const attendanceRecords = users.map(user => ({
            userId: user._id,
            status: 'absent', // Default status
            enteredAt: '-',
            exitedAt: '-',
        }));

        // Insert attendance records into the database only if they do not already exist
        await Promise.all(attendanceRecords.map(async record => {
            const existingRecord = await Attendance.findOne({ userId: record.userId });
            if (!existingRecord) {
                await Attendance.create(record);
            }
        }));
        
        next(); // Proceed to the next route handler
    } catch (error) {
        res.status(500).json({ error: 'Error creating daily attendance records' });
    }
}

// Route to mark entry for a user
router.put('/markEntry/:userId', createDailyAttendanceRecords, async (req, res) => {
    const { userId } = req.params;
    const date = new Date();
    const Attendance = getDailyAttendanceModel(date);
    const enteredAt = new Date().toLocaleTimeString();

    try {
        let attendance = await Attendance.findOne({userId}) 
        if (attendance.enteredAt <= enteredAt && attendance.enteredAt !== "-") return res.status(400).json({error: "Cant enter again"})
        attendance = await Attendance.findOneAndUpdate({ userId }, { $set: { enteredAt, status: 'present' } }, { new: true });
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ error: 'Error marking attendance' });
    }
});

// Route to mark exit for a user
router.put('/markExit/:userId', createDailyAttendanceRecords, async (req, res) => {
    const { userId } = req.params;
    const date = new Date();
    const Attendance = getDailyAttendanceModel(date);
    const exitedAt = new Date().toLocaleTimeString();

    try {
        let attendance = await Attendance.findOne({userId}) 
        if (attendance.exitedAt <= exitedAt && attendance.exitedAt !== "-") return res.status(400).json({error: "Cant exit again"})
        if (attendance.enteredAt === "-") return res.status(400).json({error: "Cant exit without doing the entry"})
        attendance = await Attendance.findOneAndUpdate({ userId }, { $set: { exitedAt } }, { new: true });
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ error: 'Error marking attendance' });
    }
});

module.exports = router;
