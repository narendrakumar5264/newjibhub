import * as groqService from '../services/groq.service.js';

export const getInterviewQuestion = async (req, res, next) => {
  try {
    const { topic, difficulty } = req.body;
    if (!topic) return res.status(400).json({ success: false, message: 'Topic is required' });
    const question = await groqService.generateInterviewQuestion(topic, difficulty || 'Medium');
    res.status(200).json({ success: true, question });
  } catch (error) {
    next(error);
  }
};

export const analyzeInterviewAnswer = async (req, res, next) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Question and answer are required' });
    }
    const result = await groqService.analyzeInterviewAnswer(question, answer);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const analyzeResume = async (req, res, next) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ success: false, message: 'Resume text is required' });
    }
    const result = await groqService.analyzeResume(resumeText);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const calculateMatchScore = async (req, res, next) => {
  try {
    const { resumeText, skillsRequired, jobTitle } = req.body;
    if (!resumeText || !skillsRequired) {
      return res.status(400).json({ success: false, message: 'Resume text and skillsRequired are required' });
    }
    const result = await groqService.calculateJobMatch(resumeText, skillsRequired, jobTitle || 'Job Role');
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const expandDescription = async (req, res, next) => {
  try {
    const { jobTitle, companyName, rawPoints } = req.body;
    if (!jobTitle || !rawPoints) {
      return res.status(400).json({ success: false, message: 'Job title and raw notes are required' });
    }
    const result = await groqService.expandJobDescription(jobTitle, companyName || 'Company', rawPoints);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
