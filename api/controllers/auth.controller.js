import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../services/email.service.js';
import { errorHandler } from '../utils/error.js';

// ── User Registration ────────────────────────────────────────────────────────
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(errorHandler(400, 'All fields (username, email, password) are required.'));
    }

    if (password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters long.'));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(errorHandler(400, 'Please enter a valid email address.'));
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(errorHandler(409, 'An account with this email already exists. Please sign in.'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    await newUser.save();

    // Trigger welcome email asynchronously (fails gracefully if credentials not provided)
    sendWelcomeEmail(email, username).catch((err) => {
      console.warn('Welcome email background send error:', err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome email sent.',
    });
  } catch (err) {
    next(err);
  }
};

// ── User Sign-in ─────────────────────────────────────────────────────────────
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(errorHandler(400, 'Email and password are required.'));
    }

    const validUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (!validUser) {
      return next(errorHandler(404, 'No account found with this email.'));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, 'Invalid password. Please check your credentials.'));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const { password: _pass, ...rest } = validUser._doc;

    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days persistent
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    };

    res.cookie('access_token', token, cookieOptions).status(200).json({
      success: true,
      ...rest,
    });
  } catch (error) {
    next(error);
  }
};

// ── Current Session Check ───────────────────────────────────────────────────
export const getMe = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(200).json({ authenticated: false, user: null });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(200).json({ authenticated: false, user: null });
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return res.status(200).json({ authenticated: false, user: null });
      res.status(200).json({ authenticated: true, user });
    });
  } catch (error) {
    next(error);
  }
};

// ── Forgot Password Request ─────────────────────────────────────────────────
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(errorHandler(400, 'Email is required.'));

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Don't leak user existence for security, return positive message
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    await sendPasswordResetEmail(user.email, user.username, resetToken);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email. Check your inbox.',
    });
  } catch (error) {
    next(error);
  }
};

// ── Reset Password ──────────────────────────────────────────────────────────
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return next(errorHandler(400, 'Reset token and new password are required.'));
    }

    if (newPassword.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters long.'));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtErr) {
      return next(errorHandler(400, 'Password reset link is invalid or has expired.'));
    }

    const user = await User.findById(decoded.id);
    if (!user) return next(errorHandler(404, 'User not found.'));

    user.password = bcryptjs.hashSync(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully! You can now sign in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

// ── Sign-out ─────────────────────────────────────────────────────────────────
export const signOut = (req, res) => {
  res.clearCookie('access_token').status(200).json({
    success: true,
    message: 'User has been signed out.',
  });
};