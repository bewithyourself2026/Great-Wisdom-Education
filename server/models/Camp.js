const mongoose = require('mongoose');

const campSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  category: {
    type: String,
    enum: ['academic', 'language', 'technology', 'business', 'arts', 'sports', 'science', 'leadership'],
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all_levels'],
    default: 'all_levels'
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coInstructors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  location: {
    type: {
      type: String,
      enum: ['online', 'hybrid', 'in_person'],
      default: 'online'
    },
    address: String,
    city: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    timezone: String
  },
  schedule: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    sessions: [{
      day: String,
      startTime: String,
      endTime: String,
      timezone: String
    }],
    totalHours: Number,
    sessionsPerWeek: Number
  },
  capacity: {
    min: {
      type: Number,
      default: 5
    },
    max: {
      type: Number,
      required: true
    },
    current: {
      type: Number,
      default: 0
    }
  },
  pricing: {
    currency: {
      type: String,
      default: 'USD'
    },
    amount: {
      type: Number,
      required: true
    },
    earlyBirdDiscount: {
      percentage: Number,
      validUntil: Date
    },
    groupDiscount: {
      percentage: Number,
      minParticipants: Number
    }
  },
  content: {
    objectives: [String],
    curriculum: [{
      week: Number,
      title: String,
      description: String,
      topics: [String],
      materials: [String]
    }],
    materials: [{
      title: String,
      type: String, // pdf, video, link, etc.
      url: String,
      description: String
    }],
    prerequisites: [String],
    outcomes: [String]
  },
  media: {
    coverImage: String,
    gallery: [String],
    video: String
  },
  languages: [{
    type: String,
    default: ['en']
  }],
  tags: [String],
  status: {
    type: String,
    enum: ['draft', 'published', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  enrollmentDeadline: Date,
  isFeatured: {
    type: Boolean,
    default: false
  },
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp
campSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for availability
campSchema.virtual('isAvailable').get(function() {
  return this.capacity.current < this.capacity.max && 
         this.status === 'active' && 
         new Date() < this.enrollmentDeadline;
});

// Virtual for enrollment percentage
campSchema.virtual('enrollmentPercentage').get(function() {
  return Math.round((this.capacity.current / this.capacity.max) * 100);
});

module.exports = mongoose.model('Camp', campSchema);