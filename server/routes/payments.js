const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payments/create-intent
// @desc    Create payment intent
// @access  Private
router.post('/create-intent', [
  auth,
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be non-negative'),
  body('currency').optional().isIn(['USD', 'EUR', 'GBP', 'CAD']).withMessage('Invalid currency'),
  body('campId').isMongoId().withMessage('Valid camp ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Mock payment intent creation
    const paymentIntent = {
      id: 'pi_' + Date.now().toString(),
      amount: req.body.amount * 100, // Convert to cents
      currency: req.body.currency || 'USD',
      status: 'requires_payment_method',
      client_secret: 'pi_' + Date.now().toString() + '_secret_' + Math.random().toString(36).substr(2, 9)
    };

    res.json(paymentIntent);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/payments/confirm
// @desc    Confirm payment
// @access  Private
router.post('/confirm', [
  auth,
  body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required'),
  body('enrollmentId').isMongoId().withMessage('Valid enrollment ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Mock payment confirmation
    const payment = {
      id: 'pay_' + Date.now().toString(),
      paymentIntentId: req.body.paymentIntentId,
      enrollmentId: req.body.enrollmentId,
      status: 'succeeded',
      amount: 10000, // $100.00
      currency: 'USD',
      createdAt: new Date()
    };

    res.json(payment);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/payments/history
// @desc    Get payment history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    // Mock payment history
    const payments = [
      {
        id: 'pay_1',
        amount: 15000, // $150.00
        currency: 'USD',
        status: 'succeeded',
        campTitle: 'Advanced JavaScript Programming',
        createdAt: new Date(Date.now() - 86400000)
      },
      {
        id: 'pay_2',
        amount: 8000, // $80.00
        currency: 'USD',
        status: 'succeeded',
        campTitle: 'English Conversation Skills',
        createdAt: new Date(Date.now() - 172800000)
      }
    ];

    res.json(payments);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;