const mongoose = require('mongoose')
const {Schema} = mongoose;
const Fee = require('./Fee');

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

UserSchema.post('save', async function (doc) {
    if (doc.role === 'user') {
        const feeExists = await Fee.findOne({ userId: doc._id });
        if (!feeExists) {
            await Fee.create({
                userId: doc._id,
                amountDue: 0, // Ensure this is 0, not 1000
                totalFee: 0,
                dueDate: null,
                paymentHistory: []
            });
        }
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;