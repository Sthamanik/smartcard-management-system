const express = require('express');
const router = express.Router();
const User = require('../models/Users'); // Ensure this path is correct
const getDailyAttendanceModel = require('../models/Attendance');
const mongoose = require('mongoose')

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
            date: date
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

// Route to fetch attendance records from all collections
router.get('/attendance/all', async (req, res) => {
    try {
        // Retrieve the list of all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        
        // Filter out attendance collections
        const attendanceCollections = collections
            .filter(coll => coll.name.startsWith('attendance_'))
            .map(coll => {
                // Create a dynamic model for each attendance collection
                return mongoose.model(coll.name, getDailyAttendanceModel().schema);
            });
        
        // Fetch records from each attendance collection
        const recordsPromises = attendanceCollections.map(model => model.find().exec());
        const recordsArrays = await Promise.all(recordsPromises);
        
        // Aggregate all records
        const allRecords = recordsArrays.flat();
        res.status(200).json(allRecords);
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        res.status(500).json({ error: 'Error fetching attendance records' });
    }
});

router.get('/attendance/:date', async (req, res) => {
    const { date } = req.params;
    const Attendance = getDailyAttendanceModel(new Date(date));

    try {
        const records = await Attendance.find();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching attendance records' });
    }
});

// Route to fetch attendance records for a specific user
router.get('/attendance/:date/:userId/', async (req, res) => {
    const { userId, date } = req.params;
    const Attendance = getDailyAttendanceModel(new Date(date));

    try {
        const record = await Attendance.findOne({ userId });
        if (!record) return res.status(404).json({ error: 'No attendance record found for this user' });
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching attendance record' });
    }
});

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
