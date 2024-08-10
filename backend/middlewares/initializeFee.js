const User = require('../models/Users');
const Fee = require('../models/Fee');

async function initializeFeeData(req, res, next) {
    try {
        const users = await User.find({ role: 'user' });
        for (const user of users) {
            const feeExists = await Fee.findOne({ userId: user._id });
            if (!feeExists) {
                await Fee.create({
                    userId: user._id,
                    amountDue: 1000,
                    amountPaid: 0,
                    dueDate: new Date(),
                    paymentHistory: []
                });
            }
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'Error initializing fee data' });
    }
}

module.exports = initializeFeeData;
