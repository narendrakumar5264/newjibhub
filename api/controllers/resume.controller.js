import ResumeHistory from '../models/resumeHistory.model.js';
import { errorHandler } from '../utils/error.js';

// ── Save an ATS resume analysis ───────────────────────────────────────────
export const saveResumeAnalysis = async (req, res, next) => {
  try {
    const {
      fileName,
      targetJobTitle,
      atsScore,
      sectionScores,
      summary,
      strengths,
      improvements,
      missingKeywords,
      roadmap,
    } = req.body;
    const userId = req.user.id;

    if (atsScore === undefined) {
      return next(errorHandler(400, 'ATS Score is required'));
    }

    const newRecord = new ResumeHistory({
      userId,
      fileName: fileName || 'Resume.pdf',
      targetJobTitle: targetJobTitle || 'Software Engineer',
      atsScore: Number(atsScore) || 0,
      sectionScores: sectionScores || {},
      summary: summary || '',
      strengths: strengths || [],
      improvements: improvements || [],
      missingKeywords: missingKeywords || [],
      roadmap: (roadmap || []).map((r) => ({
        title: r.title,
        content: r.content,
        completed: Boolean(r.completed),
      })),
    });

    const saved = await newRecord.save();
    res.status(201).json({ success: true, record: saved });
  } catch (error) {
    next(error);
  }
};

// ── Get resume score progression history for charting ─────────────────────
export const getResumeHistory = async (req, res, next) => {
  try {
    const history = await ResumeHistory.find({ userId: req.user.id })
      .sort({ createdAt: 1 }) // Chronological order for Recharts progression!
      .limit(30);

    res.status(200).json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

// ── Toggle roadmap milestone completion ───────────────────────────────────
export const toggleRoadmapStep = async (req, res, next) => {
  try {
    const { resumeId, stepIndex } = req.params;
    const record = await ResumeHistory.findById(resumeId);

    if (!record) {
      return next(errorHandler(404, 'Resume analysis record not found'));
    }

    if (record.userId.toString() !== req.user.id) {
      return next(errorHandler(403, 'Unauthorized to update this roadmap'));
    }

    const idx = parseInt(stepIndex, 10);
    if (isNaN(idx) || idx < 0 || idx >= record.roadmap.length) {
      return next(errorHandler(400, 'Invalid roadmap step index'));
    }

    record.roadmap[idx].completed = !record.roadmap[idx].completed;
    await record.save();

    res.status(200).json({ success: true, roadmap: record.roadmap });
  } catch (error) {
    next(error);
  }
};

// ── Get latest resume analysis ────────────────────────────────────────────
export const getLatestResume = async (req, res, next) => {
  try {
    const latest = await ResumeHistory.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, latest });
  } catch (error) {
    next(error);
  }
};
