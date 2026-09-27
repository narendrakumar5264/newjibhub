import mongoose from 'mongoose';

const resumeHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      default: 'Resume.pdf',
    },
    targetJobTitle: {
      type: String,
      default: 'General Software Engineering',
    },
    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    sectionScores: {
      education: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      skills: { type: Number, default: 0 },
      formatting: { type: Number, default: 0 },
    },
    summary: {
      type: String,
      default: '',
    },
    strengths: {
      type: [String],
      default: [],
    },
    improvements: {
      type: [String],
      default: [],
    },
    missingKeywords: {
      type: [String],
      default: [],
    },
    roadmap: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

const ResumeHistory = mongoose.model('ResumeHistory', resumeHistorySchema);

export default ResumeHistory;
