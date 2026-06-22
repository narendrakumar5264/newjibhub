import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../services/email.service.js';

// ── signup ────────────────────────────────────────────────────────────────────
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    try {
      await sendWelcomeEmail(email, username);
    } catch (emailErr) {
      console.warn('Welcome email failed to send:', emailErr.message);
    }

    res.status(201).json({ message: 'User created and welcome email sent.' });
  } catch (err) {
    next(err);
  }
};

// ── signin ────────────────────────────────────────────────────────────────────
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const validUser = await User.findOne({ email });
    if (!validUser) return next({ statusCode: 404, message: 'User not found!' });

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next({ statusCode: 401, message: 'Wrong credentials!' });

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: _pass, ...rest } = validUser._doc;

    res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
  } catch (error) {
    next(error);
  }
};



// ── sign-out ──────────────────────────────────────────────────────────────────
export const signOut = (req, res) => {
  res.clearCookie('access_token').status(200).json('User has been logged out!');
};