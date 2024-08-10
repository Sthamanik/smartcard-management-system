const cron = require('node-cron');
const mongoose = require('mongoose');
const User = require('./models/Users'); 
const getDailyAttendanceModel = require('./models/Attendance'); 
async function createDailyAttendanceRecords() {
    const date = new Date();
    const Attendance = getDailyAttendanceModel(date);

    try {
        const users = await User.find();
        const attendanceRecords = users.map(user => ({
            userId: user._id,
            status: 'absent', 
            enteredAt: '-',
            exitedAt: '-',
        }));

        await Attendance.insertMany(attendanceRecords);
        console.log('Daily attendance records created');
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
