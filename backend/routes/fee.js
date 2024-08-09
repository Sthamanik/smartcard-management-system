const express = require('express');
const router = express.Router();
const createFeeRecords = require('../middleware/createFeeRecords');
const Fee = require('../models/Fee');

router.get('/fees/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const fees = await Fee.find({ userId }).sort({ date: -1 }); // Sort by date, descending
        res.status(200).json(fees);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching fee records' });
    }
});

// Route to update fee record for a user
router.post('/updateFee/:userId', createFeeRecords, async (req, res) => {
    const { userId } = req.params;
    const { amount, status } = req.body;
    const today = new Date();

    try {
        const fee = await Fee.findOneAndUpdate(
            { userId, date: today },
            { $set: { amount, status } },
            { new: true, upsert: true } // Upsert if record does not exist
        );

        res.status(200).json(fee);
    } catch (error) {
        res.status(500).json({ error: 'Error updating fee record' });
    }
});

module.exports = router;
