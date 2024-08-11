const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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
        console.error('Error creating daily attendance records:', error);
        res.status(500).json({ error: 'Error creating daily attendance records' });
    }
}

// Helper function to get all attendance records
async function getAllAttendanceRecords() {
    // Retrieve the list of all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    // Filter out attendance collections and create dynamic models
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
    return recordsArrays.flat();
}

// Route to get all attendance records
router.get('/attendance/all', async (req, res) => {
    try {
        const allRecords = await getAllAttendanceRecords();
        res.status(200).json(allRecords);
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        res.status(500).json({ error: 'Error fetching attendance records' });
    }
});

// Route to get attendance records for a specific user
router.get('/attendance/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Get all attendance records
        const allRecords = await getAllAttendanceRecords();
        
        // Filter records by userId
        const userRecords = allRecords.filter(record => record.userId.toString() === userId);
        
        res.status(200).json(userRecords);
    } catch (error) {
        console.error('Error fetching attendance records for user:', error);
        res.status(500).json({ error: 'Error fetching attendance records for user' });
    }
});

// Route to fetch attendance records for a specific user on a specific date
router.get('/attendance/:date/:userId', async (req, res) => {
    const { userId, date } = req.params;
    const Attendance = getDailyAttendanceModel(new Date(date));

    try {
        const record = await Attendance.findOne({ userId });
        if (!record) return res.status(404).json({ error: 'No attendance record found for this user on this date' });
        res.status(200).json(record);
    } catch (error) {
        console.error('Error fetching attendance record:', error);
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
        let attendance = await Attendance.findOne({ userId }); 
        if (attendance.enteredAt !== "-" && attendance.enteredAt <= enteredAt) return res.status(400).json({ error: "Can't enter again" });
        attendance = await Attendance.findOneAndUpdate({ userId }, { $set: { enteredAt, status: 'present' } }, { new: true });
        res.status(200).json(attendance);
    } catch (error) {
        console.error('Error marking entry:', error);
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
        let attendance = await Attendance.findOne({ userId }); 
        if (attendance.exitedAt !== "-" && attendance.exitedAt <= exitedAt) return res.status(400).json({ error: "Can't exit again" });
        if (attendance.enteredAt === "-") return res.status(400).json({ error: "Can't exit without doing the entry" });
        attendance = await Attendance.findOneAndUpdate({ userId }, { $set: { exitedAt } }, { new: true });
        res.status(200).json(attendance);
    } catch (error) {
        console.error('Error marking exit:', error);
        res.status(500).json({ error: 'Error marking attendance' });
    }
});

module.exports = router;
