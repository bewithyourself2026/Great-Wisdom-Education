const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/sessions
// @desc    Create a new session
// @access  Private (Instructor only)
router.post('/', [
  auth,
  body('campId').isMongoId().withMessage('Valid camp ID is required'),
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').optional().trim(),
  body('startTime').isISO8601().withMessage('Valid start time is required'),
  body('duration').isInt({ min: 15, max: 480 }).withMessage('Duration must be between 15 and 480 minutes'),
  body('meetingLink').optional().isURL().withMessage('Valid meeting link is required'),
  body('materials').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // This would typically use a Session model
    // For now, we'll return a mock response
    const session = {
      id: Date.now().toString(),
      ...req.body,
      instructor: req.user.id,
      status: 'scheduled',
      participants: [],
      createdAt: new Date()
    };

    res.status(201).json(session);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/sessions/camp/:campId
// @desc    Get sessions for a camp
// @access  Private
router.get('/camp/:campId', auth, async (req, res) => {
  try {
    // Mock sessions data
    const sessions = [
      {
        id: '1',
        campId: req.params.campId,
        title: 'Introduction to the Course',
        description: 'Overview of the course structure and objectives',
        startTime: new Date(Date.now() + 86400000), // Tomorrow
        duration: 60,
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        status: 'scheduled',
        materials: [
          { title: 'Course Syllabus', type: 'pdf', url: '/materials/syllabus.pdf' },
          { title: 'Pre-session Reading', type: 'link', url: 'https://example.com/reading' }
        ]
      }
    ];

    res.json(sessions);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/sessions/:id/join
// @desc    Join a session
// @access  Private
router.put('/:id/join', auth, async (req, res) => {
  try {
    // Mock response for joining a session
    res.json({ 
      message: 'Successfully joined session',
      sessionId: req.params.id,
      meetingLink: 'https://meet.google.com/abc-defg-hij'
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;