const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  camp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Camp',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  payment: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    method: String,
    transactionId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: Date,
    discountApplied: {
      type: Number,
      default: 0
    }
  },
  progress: {
    sessionsAttended: {
      type: Number,
      default: 0
    },
    totalSessions: Number,
    assignmentsCompleted: {
      type: Number,
      default: 0
    },
    totalAssignments: Number,
    grade: {
      type: String,
      enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F', 'Incomplete'],
      default: 'Incomplete'
    },
    certificateIssued: {
      type: Boolean,
      default: false
    },
    certificateUrl: String
  },
  attendance: [{
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session'
    },
    date: Date,
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused'],
      default: 'absent'
    },
    duration: Number, // minutes attended
    notes: String
  }],
  assignments: [{
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment'
    },
    title: String,
    submittedAt: Date,
    dueDate: Date,
    score: Number,
    maxScore: Number,
    feedback: String,
    status: {
      type: String,
      enum: ['pending', 'submitted', 'graded', 'late'],
      default: 'pending'
    }
  }],
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date
  },
  notes: [{
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  cancelledAt: Date,
  refundedAt: Date
});

// Indexes for better query performance
enrollmentSchema.index({ student: 1, camp: 1 }, { unique: true });
enrollmentSchema.index({ status: 1 });
enrollmentSchema.index({ 'payment.status': 1 });

// Virtual for progress percentage
enrollmentSchema.virtual('progressPercentage').get(function() {
  if (!this.progress.totalSessions) return 0;
  return Math.round((this.progress.sessionsAttended / this.progress.totalSessions) * 100);
});

// Virtual for assignment completion percentage
enrollmentSchema.virtual('assignmentCompletionPercentage').get(function() {
  if (!this.progress.totalAssignments) return 0;
  return Math.round((this.progress.assignmentsCompleted / this.progress.totalAssignments) * 100);
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);