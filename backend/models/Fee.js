const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Fee schema
const FeeSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        default: 0 // Default amount
    },
    status: {
        type: String,
        enum: ['paid', 'unpaid'], // Fee status
        default: 'unpaid' // Default status
    },
    date: {
        type: Date,
        default: () => new Date() // Default to current date
    }
}, {
    timestamps: true // Optional: Adds createdAt and updatedAt fields
});

// Create and export the model
module.exports = mongoose.model('Fee', FeeSchema);
