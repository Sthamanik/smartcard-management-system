const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');
const initializeFeeData = require('../middlewares/initializeFee');

router.use(initializeFeeData);

// Route to get all fee records
router.get('/', async (req, res) => {
    try {
        const fees = await Fee.find().sort({ date: -1 }); // Sort by date, descending
        res.status(200).json(fees);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching fee records' });
    }
})

router.get('/user', async (req, res) => {
    const userId  = req.userId;

    try {
        const fees = await Fee.find({ userId }).sort({ date: -1 }); // Sort by date, descending
        res.status(200).json(fees);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching fee records' });
    }
});

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const fees = await Fee.find({ userId }).sort({ date: -1 }); // Sort by date, descending
        res.status(200).json(fees);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching fee records' });
    }
});

router.put('/updateFee/:userId', async (req, res) => {
    const { userId } = req.params;
    const { amountPaid, amountDue, totalFee } = req.body;

    try {
        // Find the fee record by userId
        const fee = await Fee.findOne({ userId });

        if (!fee) {
            return res.status(404).json({ error: 'Fee record not found for this user' });
        }

        // Check if amountPaid is provided in the request body
        if (amountPaid !== undefined) {
            if (typeof amountPaid !== 'number') {
                return res.status(400).json({ error: 'amountPaid must be a number' });
            }
            fee.amountDue -= amountPaid; // Deduct the paid amount from the due amount

            // Ensure amountDue does not go below 0
            if (fee.amountDue < 0) {
                fee.amountDue = 0;
            }

            // Update payment history
            fee.paymentHistory.push({
                amountPaid,
                paidOn: new Date(),
            });
        }

        if (totalFee !== undefined) {
            if (typeof totalFee !== 'number') {
                return res.status(400).json({ error: 'Total fee must be a number' });
            }
            fee.totalFee += totalFee;
            fee.amountDue += totalFee;
        }

        // Check if amountDue is provided in the request body
        if (amountDue !== undefined) {
            if (typeof amountDue !== 'number') {
                return res.status(400).json({ error: 'amountDue must be a number' });
            }
            fee.amountDue = amountDue;
        }

        // Save the updated fee record
        const updatedFee = await fee.save();

        res.status(200).json(updatedFee);
    } catch (error) {
        console.error('Error updating fee record:', error);
        res.status(500).json({ error: 'Error updating fee record' });
    }
});


module.exports = router;
