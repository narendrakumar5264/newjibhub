import { errorHandler } from "../utils/error.js";
import { signupService, signinService, googleSignInService } from "../services/auth.service.js";

export const signup = async (req, res, next) => {
  try {
    const result = await signupService(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { token, user } = await signinService(req.body);
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(user);
  } catch (error) {
    if (error.statusCode) {
      next(errorHandler(error.statusCode, error.message));
    } else {
      next(error);
    }
  }
};

export const google = async (req, res, next) => {
  try {
    const { token, user } = await googleSignInService(req.body);
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(user);
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};