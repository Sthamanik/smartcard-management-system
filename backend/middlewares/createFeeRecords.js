const User = require('../models/Users');
const Fee = require('../models/Fee');
async function createFeeRecords(req, res, next) {
    try {
        const users = await User.find({ role: 'user' });
        
        const today = new Date();
        const feeRecords = users.map(user => ({
            userId: user._id,
            amount: 0, 
            status: 'paid', 
            date: today
        }));

        // Upsert fee records: update if exists, create if not
        await Promise.all(feeRecords.map(async record => {
            await Fee.findOneAndUpdate(
                { userId: record.userId, date: record.date },
                { $setOnInsert: record },
                { upsert: true, new: true }
            );
        }));

        next(); 
    } catch (error) {
        res.status(500).json({ error: 'Error creating or updating fee records' });
    }
}

module.exports = createFeeRecords;
