import Application from '../models/application.model.js';
import Listing from '../models/listing.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import { calculateJobMatch } from '../services/groq.service.js';

// ── Submit an application ──────────────────────────────────────────────────
export const applyToJob = async (req, res, next) => {
  try {
    const { listingId, coverNote, resumeText, atsScore } = req.body;
    const applicantId = req.user.id;

    if (!listingId) {
      return next(errorHandler(400, 'Listing ID is required'));
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(errorHandler(404, 'Job listing not found'));
    }

    if (listing.userRef === applicantId) {
      return next(errorHandler(400, 'You cannot apply to your own job posting'));
    }

    const existingApp = await Application.findOne({ listingId, applicantId });
    if (existingApp) {
      return next(errorHandler(400, 'You have already applied to this position'));
    }

    const applicant = await User.findById(applicantId);
    if (!applicant) {
      return next(errorHandler(404, 'Applicant user record not found'));
    }

    let matchScore = 0;
    let matchingSkills = [];
    let missingSkills = [];

    // Auto-calculate role match if resume and skills are present
    if (resumeText && listing.skillsRequired) {
      try {
        const matchData = await calculateJobMatch(resumeText, listing.skillsRequired, listing.jobTitle);
        matchScore = Number(matchData.matchScore) || 0;
        matchingSkills = matchData.matchingSkills || [];
        missingSkills = matchData.missingSkills || [];
      } catch (matchErr) {
        console.warn('AI matching score calculation skipped:', matchErr.message);
      }
    }

    const newApplication = new Application({
      listingId,
      applicantId,
      recruiterId: listing.userRef,
      jobTitle: listing.jobTitle,
      companyName: listing.companyName,
      applicantName: applicant.username,
      applicantEmail: applicant.email,
      resumeText: resumeText || '',
      atsScore: Number(atsScore) || 0,
      matchScore,
      coverNote: coverNote || '',
      matchingSkills,
      missingSkills,
    });

    const savedApp = await newApplication.save();
    res.status(201).json({ success: true, application: savedApp });
  } catch (error) {
    if (error.code === 11000) {
      return next(errorHandler(400, 'You have already applied to this position'));
    }
    next(error);
  }
};

// ── Check if logged-in user applied to a specific listing ──────────────────
export const checkApplicationStatus = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const applicantId = req.user.id;

    const application = await Application.findOne({ listingId, applicantId });
    if (!application) {
      return res.status(200).json({ applied: false, application: null });
    }

    res.status(200).json({ applied: true, application });
  } catch (error) {
    next(error);
  }
};

// ── Get applications submitted by logged-in applicant ─────────────────────
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicantId: req.user.id })
      .populate('listingId', 'jobTitle companyName city salary jobType imageUrls')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};

// ── Get all applicants for recruiter ──────────────────────────────────────
export const getRecruiterApplications = async (req, res, next) => {
  try {
    const query = { recruiterId: req.user.id };
    if (req.query.listingId) {
      query.listingId = req.query.listingId;
    }
    if (req.query.status) {
      query.status = req.query.status;
    }

    const applications = await Application.find(query)
      .populate('listingId', 'jobTitle companyName skillsRequired')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};

// ── Update applicant status ───────────────────────────────────────────────
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Applied', 'In Review', 'Shortlisted', 'Interviewing', 'Accepted', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return next(errorHandler(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`));
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return next(errorHandler(404, 'Application not found'));
    }

    if (application.recruiterId.toString() !== req.user.id) {
      return next(errorHandler(403, 'You are not authorized to update this application'));
    }

    application.status = status;
    await application.save();

    res.status(200).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};
