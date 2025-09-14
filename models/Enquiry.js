import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [
      /^[+]?[\d\s\-()]{10,15}$/,
      'Please provide a valid phone number'
    ]
  },
  service: {
    type: String,
    required: [true, 'Service is required'],
    enum: {
      values: ['Software Development', 'Digital Marketing', 'Video Editing'],
      message: 'Service must be one of: Software Development, Digital Marketing, Video Editing'
    }
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Completed', 'Closed'],
    default: 'New'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  notes: [{
    content: {
      type: String,
      required: true,
      trim: true
    },
    addedBy: {
      type: String,
      default: 'Admin'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    ipAddress: String,
    userAgent: String,
    source: {
      type: String,
      default: 'Website'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


enquirySchema.index({ service: 1 });
enquirySchema.index({ status: 1 });
enquirySchema.index({ createdAt: -1 });

enquirySchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

enquirySchema.pre('save', function(next) {
  if (!this.subject && this.service) {
    this.subject = `Enquiry for ${this.service} Services`;
  }
  next();
});

export default mongoose.model('Enquiry', enquirySchema);