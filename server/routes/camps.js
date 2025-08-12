const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Camp = require('../models/Camp');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/camps
// @desc    Get all camps with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('category').optional().isIn(['academic', 'language', 'technology', 'business', 'arts', 'sports', 'science', 'leadership']),
  query('level').optional().isIn(['beginner', 'intermediate', 'advanced', 'all_levels']),
  query('location').optional().isIn(['online', 'hybrid', 'in_person']),
  query('instructorType').optional().isIn(['professor', 'industry_leader', 'english_teacher']),
  query('search').optional().trim(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 12,
      category,
      level,
      location,
      instructorType,
      search,
      minPrice,
      maxPrice,
      startDate,
      endDate,
      featured,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { status: 'active' };

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (location) filter['location.type'] = location;
    if (featured === 'true') filter.isFeatured = true;
    if (minPrice || maxPrice) {
      filter['pricing.amount'] = {};
      if (minPrice) filter['pricing.amount'].$gte = parseFloat(minPrice);
      if (maxPrice) filter['pricing.amount'].$lte = parseFloat(maxPrice);
    }
    if (startDate) filter['schedule.startDate'] = { $gte: new Date(startDate) };
    if (endDate) filter['schedule.endDate'] = { $lte: new Date(endDate) };

    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Instructor type filter
    if (instructorType) {
      const instructors = await User.find({ 
        role: 'instructor', 
        instructorType: instructorType 
      }).select('_id');
      filter.instructor = { $in: instructors.map(u => u._id) };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const camps = await Camp.find(filter)
      .populate('instructor', 'firstName lastName profile.avatar instructorType')
      .populate('coInstructors', 'firstName lastName profile.avatar instructorType')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Camp.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      camps,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        total,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/camps/:id
// @desc    Get camp by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id)
      .populate('instructor', 'firstName lastName profile instructorType')
      .populate('coInstructors', 'firstName lastName profile instructorType')
      .populate('reviews.user', 'firstName lastName profile.avatar');

    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }

    res.json(camp);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Camp not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/camps
// @desc    Create a new camp
// @access  Private (Instructors only)
router.post('/', [
  auth,
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description').trim().isLength({ min: 50 }).withMessage('Description must be at least 50 characters'),
  body('category').isIn(['academic', 'language', 'technology', 'business', 'arts', 'sports', 'science', 'leadership']).withMessage('Invalid category'),
  body('level').isIn(['beginner', 'intermediate', 'advanced', 'all_levels']).withMessage('Invalid level'),
  body('schedule.startDate').isISO8601().withMessage('Invalid start date'),
  body('schedule.endDate').isISO8601().withMessage('Invalid end date'),
  body('capacity.max').isInt({ min: 1 }).withMessage('Maximum capacity must be at least 1'),
  body('pricing.amount').isFloat({ min: 0 }).withMessage('Price must be non-negative')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user is instructor
    const user = await User.findById(req.user.id);
    if (user.role !== 'instructor' && user.role !== 'admin') {
      return res.status(403).json({ message: 'Only instructors can create camps' });
    }

    const campData = {
      ...req.body,
      instructor: req.user.id
    };

    const camp = new Camp(campData);
    await camp.save();

    const populatedCamp = await Camp.findById(camp._id)
      .populate('instructor', 'firstName lastName profile.avatar instructorType');

    res.status(201).json(populatedCamp);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/camps/:id
// @desc    Update a camp
// @access  Private (Camp instructor or admin)
router.put('/:id', [
  auth,
  body('title').optional().trim().isLength({ min: 5, max: 100 }),
  body('description').optional().trim().isLength({ min: 50 }),
  body('category').optional().isIn(['academic', 'language', 'technology', 'business', 'arts', 'sports', 'science', 'leadership']),
  body('level').optional().isIn(['beginner', 'intermediate', 'advanced', 'all_levels']),
  body('schedule.startDate').optional().isISO8601(),
  body('schedule.endDate').optional().isISO8601(),
  body('capacity.max').optional().isInt({ min: 1 }),
  body('pricing.amount').optional().isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const camp = await Camp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }

    // Check if user is the instructor or admin
    const user = await User.findById(req.user.id);
    if (camp.instructor.toString() !== req.user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this camp' });
    }

    const updatedCamp = await Camp.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('instructor', 'firstName lastName profile.avatar instructorType');

    res.json(updatedCamp);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Camp not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/camps/:id
// @desc    Delete a camp
// @access  Private (Camp instructor or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }

    // Check if user is the instructor or admin
    const user = await User.findById(req.user.id);
    if (camp.instructor.toString() !== req.user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this camp' });
    }

    await Camp.findByIdAndDelete(req.params.id);
    res.json({ message: 'Camp deleted successfully' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Camp not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/camps/:id/reviews
// @desc    Add a review to a camp
// @access  Private (Enrolled students only)
router.post('/:id/reviews', [
  auth,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ min: 10, max: 500 }).withMessage('Comment must be between 10 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const camp = await Camp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }

    // Check if user is enrolled in the camp
    const Enrollment = require('../models/Enrollment');
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      camp: req.params.id,
      status: { $in: ['active', 'completed'] }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'You must be enrolled in this camp to leave a review' });
    }

    // Check if user already reviewed
    const existingReview = camp.reviews.find(review => 
      review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this camp' });
    }

    const { rating, comment } = req.body;
    camp.reviews.push({
      user: req.user.id,
      rating,
      comment
    });

    // Update average rating
    const totalRating = camp.reviews.reduce((sum, review) => sum + review.rating, 0);
    camp.ratings.average = totalRating / camp.reviews.length;
    camp.ratings.count = camp.reviews.length;

    await camp.save();

    const updatedCamp = await Camp.findById(req.params.id)
      .populate('reviews.user', 'firstName lastName profile.avatar');

    res.json(updatedCamp);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Camp not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/camps/instructor/:instructorId
// @desc    Get camps by instructor
// @access  Public
router.get('/instructor/:instructorId', async (req, res) => {
  try {
    const camps = await Camp.find({ 
      instructor: req.params.instructorId,
      status: 'active'
    })
    .populate('instructor', 'firstName lastName profile.avatar instructorType')
    .sort({ createdAt: -1 });

    res.json(camps);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/camps/featured
// @desc    Get featured camps
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const camps = await Camp.find({ 
      isFeatured: true,
      status: 'active'
    })
    .populate('instructor', 'firstName lastName profile.avatar instructorType')
    .sort({ createdAt: -1 })
    .limit(6);

    res.json(camps);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;