const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('firstName').optional().trim().isLength({ min: 2 }),
  body('lastName').optional().trim().isLength({ min: 2 }),
  body('profile.bio').optional().trim().isLength({ max: 500 }),
  body('profile.location.country').optional().trim(),
  body('profile.location.city').optional().trim(),
  body('profile.location.timezone').optional().trim(),
  body('preferences.language').optional().isIn(['en', 'es', 'fr', 'de', 'zh', 'ja']),
  body('preferences.timezone').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update allowed fields
    const allowedFields = [
      'firstName', 'lastName', 'profile', 'preferences'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/instructors
// @desc    Get all instructors
// @access  Public
router.get('/instructors', async (req, res) => {
  try {
    const { instructorType, search, page = 1, limit = 12 } = req.query;

    const filter = { role: 'instructor', isActive: true };
    
    if (instructorType) {
      filter.instructorType = instructorType;
    }

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { 'profile.expertise': { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const instructors = await User.find(filter)
      .select('firstName lastName profile instructorType')
      .sort({ firstName: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      instructors,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/instructors/:id
// @desc    Get instructor profile
// @access  Public
router.get('/instructors/:id', async (req, res) => {
  try {
    const instructor = await User.findOne({
      _id: req.params.id,
      role: 'instructor',
      isActive: true
    }).select('-password');

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    res.json(instructor);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;