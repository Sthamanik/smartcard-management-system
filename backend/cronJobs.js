const cron = require('node-cron');
const mongoose = require('mongoose');
const User = require('./models/Users');
const getDailyAttendanceModel = require('./models/Attendance');

async function createDailyAttendanceRecords() {
    const date = new Date();
    const Attendance = getDailyAttendanceModel(date);

    try {
        const users = await User.find();
        const userIds = users.map(user => user._id);

        // Define the start and end of the day for accurate checking
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        // Check for existing attendance records for today
        const existingRecords = await Attendance.find({
            userId: { $in: userIds },
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        // Create a set of existing user IDs with records for today
        const existingUserIds = new Set(existingRecords.map(record => record.userId.toString()));

        // Create attendance records for users who do not have an entry for today
        const attendanceRecords = users
            .filter(user => !existingUserIds.has(user._id.toString()))
            .map(user => ({
                userId: user._id,
                status: 'absent',
                enteredAt: '-',
                exitedAt: '-',
                date: new Date() // Use current date
            }));

        if (attendanceRecords.length > 0) {
            await Attendance.insertMany(attendanceRecords);
            console.log('Daily attendance records created');
        } else {
            console.log('No new attendance records created');
        }
    } catch (error) {
        console.error('Error creating daily attendance records:', error);
    }
}

function startCronJobs() {
    cron.schedule('0 0 * * *', async () => {
        await createDailyAttendanceRecords();
    });
}

module.exports = startCronJobs;
