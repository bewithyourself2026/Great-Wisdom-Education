const express = require('express');
const { body, validationResult } = require('express-validator');
const Enrollment = require('../models/Enrollment');
const Camp = require('../models/Camp');
const User = require('../models/User');
const auth = require('../middleware/auth');
const sendEmail = require('../utils/email');

const router = express.Router();

// @route   POST /api/enrollments
// @desc    Enroll in a camp
// @access  Private
router.post('/', [
  auth,
  body('campId').isMongoId().withMessage('Valid camp ID is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be non-negative')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { campId, amount, paymentMethod } = req.body;

    // Check if camp exists and is active
    const camp = await Camp.findById(campId);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }

    if (camp.status !== 'active') {
      return res.status(400).json({ message: 'Camp is not available for enrollment' });
    }

    // Check if camp is full
    if (camp.capacity.current >= camp.capacity.max) {
      return res.status(400).json({ message: 'Camp is full' });
    }

    // Check if enrollment deadline has passed
    if (camp.enrollmentDeadline && new Date() > camp.enrollmentDeadline) {
      return res.status(400).json({ message: 'Enrollment deadline has passed' });
    }

    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      camp: campId
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'You are already enrolled in this camp' });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      student: req.user.id,
      camp: campId,
      payment: {
        amount,
        method: paymentMethod || 'stripe',
        status: 'pending'
      },
      progress: {
        totalSessions: camp.schedule.sessions ? camp.schedule.sessions.length : 0,
        totalAssignments: camp.content.curriculum ? camp.content.curriculum.length : 0
      }
    });

    await enrollment.save();

    // Update camp capacity
    camp.capacity.current += 1;
    await camp.save();

    // Send confirmation email
    try {
      const instructor = await User.findById(camp.instructor);
      await sendEmail({
        to: req.user.email,
        template: 'campEnrollment',
        data: {
          studentName: req.user.firstName,
          campTitle: camp.title,
          instructorName: instructor.fullName,
          startDate: camp.schedule.startDate.toLocaleDateString(),
          endDate: camp.schedule.endDate.toLocaleDateString(),
          schedule: camp.schedule.sessions ? camp.schedule.sessions.map(s => `${s.day} ${s.startTime}-${s.endTime}`).join(', ') : 'TBD'
        }
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate('camp', 'title instructor schedule')
      .populate('student', 'firstName lastName email');

    res.status(201).json(populatedEnrollment);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/enrollments/my
// @desc    Get user's enrollments
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate('camp', 'title instructor schedule status media.coverImage')
      .populate('camp.instructor', 'firstName lastName profile.avatar')
      .sort({ enrolledAt: -1 });

    res.json(enrollments);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/enrollments/camp/:campId
// @desc    Get enrollments for a specific camp (instructor only)
// @access  Private
router.get('/camp/:campId', auth, async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.campId);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }

    // Check if user is the instructor or admin
    const user = await User.findById(req.user.id);
    if (camp.instructor.toString() !== req.user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view enrollments' });
    }

    const enrollments = await Enrollment.find({ camp: req.params.campId })
      .populate('student', 'firstName lastName email profile.avatar')
      .sort({ enrolledAt: -1 });

    res.json(enrollments);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Camp not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/enrollments/:id/status
// @desc    Update enrollment status
// @access  Private (Instructor or admin)
router.put('/:id/status', [
  auth,
  body('status').isIn(['pending', 'confirmed', 'active', 'completed', 'cancelled', 'refunded']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const enrollment = await Enrollment.findById(req.params.id)
      .populate('camp', 'instructor title');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check if user is authorized
    const user = await User.findById(req.user.id);
    if (enrollment.camp.instructor.toString() !== req.user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this enrollment' });
    }

    const { status } = req.body;
    enrollment.status = status;

    // Set completion date if status is completed
    if (status === 'completed') {
      enrollment.completedAt = new Date();
    }

    // Set cancellation date if status is cancelled
    if (status === 'cancelled') {
      enrollment.cancelledAt = new Date();
    }

    await enrollment.save();

    const updatedEnrollment = await Enrollment.findById(req.params.id)
      .populate('camp', 'title instructor')
      .populate('student', 'firstName lastName email');

    res.json(updatedEnrollment);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/enrollments/:id/attendance
// @desc    Update attendance for a session
// @access  Private (Instructor only)
router.put('/:id/attendance', [
  auth,
  body('sessionId').isMongoId().withMessage('Valid session ID is required'),
  body('status').isIn(['present', 'absent', 'late', 'excused']).withMessage('Invalid attendance status'),
  body('duration').optional().isInt({ min: 0 }).withMessage('Duration must be non-negative'),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const enrollment = await Enrollment.findById(req.params.id)
      .populate('camp', 'instructor');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check if user is the instructor
    if (enrollment.camp.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update attendance' });
    }

    const { sessionId, status, duration, notes } = req.body;

    // Find existing attendance record or create new one
    const attendanceIndex = enrollment.attendance.findIndex(
      a => a.sessionId.toString() === sessionId
    );

    if (attendanceIndex > -1) {
      enrollment.attendance[attendanceIndex] = {
        sessionId,
        date: new Date(),
        status,
        duration,
        notes
      };
    } else {
      enrollment.attendance.push({
        sessionId,
        date: new Date(),
        status,
        duration,
        notes
      });
    }

    // Update progress if present
    if (status === 'present' || status === 'late') {
      enrollment.progress.sessionsAttended += 1;
    }

    await enrollment.save();

    res.json(enrollment);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/enrollments/:id
// @desc    Cancel enrollment
// @access  Private (Student or instructor)
router.delete('/:id', auth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('camp', 'instructor capacity');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check if user is the student or instructor
    const user = await User.findById(req.user.id);
    if (enrollment.student.toString() !== req.user.id && 
        enrollment.camp.instructor.toString() !== req.user.id && 
        user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this enrollment' });
    }

    // Update camp capacity
    enrollment.camp.capacity.current -= 1;
    await enrollment.camp.save();

    // Delete enrollment
    await Enrollment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Enrollment cancelled successfully' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;