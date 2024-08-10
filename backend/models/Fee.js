const mongoose = require('mongoose');
const { Schema } = mongoose;

const FeeSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amountDue: { type: Number, default: 0 },
    totalFee: { type: Number, default: 0 },
    paymentHistory: [{
        amountPaid: { type: Number, required: true },
        paidOn: { type: Date, required: true, default: Date.now }
    }]
});

const Fee = mongoose.model('Fee', FeeSchema);
module.exports = Fee;
