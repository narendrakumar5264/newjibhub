import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    applicantName: {
      type: String,
      required: true,
    },
    applicantEmail: {
      type: String,
      required: true,
    },
    resumeText: {
      type: String,
      default: '',
    },
    atsScore: {
      type: Number,
      default: 0,
    },
    matchScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Applied', 'In Review', 'Shortlisted', 'Interviewing', 'Accepted', 'Rejected'],
      default: 'Applied',
    },
    coverNote: {
      type: String,
      default: '',
    },
    matchingSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications by the same user to the same listing
applicationSchema.index({ listingId: 1, applicantId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
