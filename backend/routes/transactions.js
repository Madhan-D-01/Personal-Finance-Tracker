const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const router = express.Router();

// Create transaction
router.post('/', auth, async (req, res) => {
  const { amount, type, category, date } = req.body;
  try {
    const transaction = new Transaction({
      amount,
      type,
      category,
      date,
      userId: req.user.id,
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ message: 'Error creating transaction', error: err.message });
  }
});

// Get all transactions for user
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update transaction
router.put('/:id', auth, async (req, res) => {
  const { amount, type, category, date } = req.body;
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    transaction.amount = amount;
    transaction.type = type;
    transaction.category = category;
    transaction.date = date;
    await transaction.save();
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ message: 'Error updating transaction', error: err.message });
  }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;