const mongoose = require('mongoose');
const { Schema } = mongoose;

const AttendanceSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'late'],
        default: 'absent'
    },
    enteredAt: {
        type: Date,
        default: null
    },
    exitedAt: {
        type: Date,
        default: null
    }
});

module.exports = AttendanceSchema;
