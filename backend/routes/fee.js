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

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const fees = await Fee.find({ userId }).sort({ date: -1 }); // Sort by date, descending
        res.status(200).json(fees);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching fee records' });
    }
});

// Route to update fee information
router.put('/updateFee/:userId', async (req, res) => {
    const { userId } = req.params;
    const { amountPaid, amountDue, dueDate } = req.body;

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
            fee.amountPaid += amountPaid;
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

        // Check if amountDue is provided in the request body
        if (amountDue !== undefined) {
            if (typeof amountDue !== 'number') {
                return res.status(400).json({ error: 'amountDue must be a number' });
            }
            fee.amountDue = amountDue;
            fee.amountPaid = 0; // Reset amountPaid to 0 when updating amountDue

            // Update dueDate if provided
            if (dueDate) {
                const parsedDueDate = new Date(dueDate);
                if (isNaN(parsedDueDate.getTime())) {
                    return res.status(400).json({ error: 'Invalid dueDate format' });
                }
                fee.dueDate = parsedDueDate;
            } else if (fee.amountDue <= 0) {
                fee.dueDate = null; // Clear due date if amountDue is 0 or less
            }
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
