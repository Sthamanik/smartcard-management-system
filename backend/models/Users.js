const mongoose = require('mongoose')
const {Schema} = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    DOB: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    }, 
    contact: {
        type: Number,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'staff', 'user'],
        default: 'user'
    },
    faculty: {
        type: String,
        enum: ['BIM', 'CSIT', 'BBM', 'BCA'],
    },
    batch: {
        type: Number,
    },
    uid: {
        type: Number,
    }
});

UserSchema.pre('save', function (next) {
    if (this.role === 'user') {
        if (!this.faculty || !this.batch || !this.uid) {
            throw new Error('Faculty, batch and uid are required when role is user');
        }
    }
    next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;