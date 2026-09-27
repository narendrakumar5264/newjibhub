import InterviewSession from '../models/interviewSession.model.js';
import { errorHandler } from '../utils/error.js';

// ── Save an interview practice session ─────────────────────────────────────
export const saveInterviewSession = async (req, res, next) => {
  try {
    const { topic, difficulty, question, answer, score, feedback, strengths, improvements, durationSeconds } = req.body;
    const userId = req.user.id;

    if (!topic || !question || !answer || score === undefined) {
      return next(errorHandler(400, 'Topic, question, answer, and score are required'));
    }

    const newSession = new InterviewSession({
      userId,
      topic,
      difficulty: difficulty || 'Medium',
      question,
      answer,
      score: Math.min(10, Math.max(1, Number(score))),
      feedback: feedback || '',
      strengths: strengths || [],
      improvements: improvements || [],
      durationSeconds: durationSeconds || 0,
    });

    const saved = await newSession.save();
    res.status(201).json({ success: true, session: saved });
  } catch (error) {
    next(error);
  }
};

// ── Get all interview sessions for logged-in user ─────────────────────────
export const getInterviewHistory = async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ success: true, sessions });
  } catch (error) {
    next(error);
  }
};

// ── Get aggregated analytics & weak areas insight ──────────────────────────
export const getInterviewAnalytics = async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user.id });

    if (!sessions || sessions.length === 0) {
      return res.status(200).json({
        success: true,
        totalSessions: 0,
        averageScore: 0,
        topicBreakdown: {},
        weakestTopic: null,
        strongestTopic: null,
        recommendation: 'Start your first AI Mock Interview session to unlock performance insights!',
      });
    }

    const totalSessions = sessions.length;
    const totalScoreSum = sessions.reduce((acc, s) => acc + s.score, 0);
    const overallAverage = Number((totalScoreSum / totalSessions).toFixed(1));

    // Group by topic
    const topicStats = {};
    for (const session of sessions) {
      if (!topicStats[session.topic]) {
        topicStats[session.topic] = { count: 0, totalScore: 0 };
      }
      topicStats[session.topic].count += 1;
      topicStats[session.topic].totalScore += session.score;
    }

    const topicBreakdown = {};
    let lowestAvg = Infinity;
    let highestAvg = -Infinity;
    let weakestTopic = null;
    let strongestTopic = null;

    for (const [topic, stats] of Object.entries(topicStats)) {
      const avg = Number((stats.totalScore / stats.count).toFixed(1));
      topicBreakdown[topic] = {
        count: stats.count,
        averageScore: avg,
      };

      if (avg < lowestAvg) {
        lowestAvg = avg;
        weakestTopic = { topic, average: avg, count: stats.count };
      }
      if (avg > highestAvg) {
        highestAvg = avg;
        strongestTopic = { topic, average: avg, count: stats.count };
      }
    }

    let recommendation = `You are performing consistently well across your sessions with a ${overallAverage}/10 overall score!`;
    if (weakestTopic && strongestTopic && weakestTopic.topic !== strongestTopic.topic && weakestTopic.average < 7) {
      recommendation = `You consistently score lower on ${weakestTopic.topic} (avg ${weakestTopic.average}/10) compared to ${strongestTopic.topic} (avg ${strongestTopic.average}/10). We recommend targeting more ${weakestTopic.topic} sessions.`;
    }

    res.status(200).json({
      success: true,
      totalSessions,
      averageScore: overallAverage,
      topicBreakdown,
      weakestTopic,
      strongestTopic,
      recommendation,
    });
  } catch (error) {
    next(error);
  }
};
