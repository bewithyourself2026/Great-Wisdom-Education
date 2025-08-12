const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', [
  auth,
  body('recipientId').isMongoId().withMessage('Valid recipient ID is required'),
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),
  body('type').optional().isIn(['text', 'file', 'image']).withMessage('Invalid message type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Mock message creation
    const message = {
      id: Date.now().toString(),
      senderId: req.user.id,
      recipientId: req.body.recipientId,
      content: req.body.content,
      type: req.body.type || 'text',
      timestamp: new Date(),
      read: false
    };

    res.status(201).json(message);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/messages/conversation/:userId
// @desc    Get conversation with a user
// @access  Private
router.get('/conversation/:userId', auth, async (req, res) => {
  try {
    // Mock conversation data
    const messages = [
      {
        id: '1',
        senderId: req.user.id,
        recipientId: req.params.userId,
        content: 'Hello! How are you doing?',
        type: 'text',
        timestamp: new Date(Date.now() - 3600000),
        read: true
      },
      {
        id: '2',
        senderId: req.params.userId,
        recipientId: req.user.id,
        content: 'I\'m doing great! Thanks for asking.',
        type: 'text',
        timestamp: new Date(Date.now() - 1800000),
        read: true
      }
    ];

    res.json(messages);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    // Mock response for marking message as read
    res.json({ 
      message: 'Message marked as read',
      messageId: req.params.id
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;