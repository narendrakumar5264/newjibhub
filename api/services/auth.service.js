import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "./email.service.js";

export const signupService = async ({ username, email, password }) => {
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();
  try {
    await sendWelcomeEmail(email, username);
  } catch (emailErr) {
    console.warn('Welcome email failed to send:', emailErr.message);
  }
  return { message: 'User created and welcome email sent.' };
};

export const signinService = async ({ email, password }) => {
  const validUser = await User.findOne({ email });
  if (!validUser) throw { statusCode: 404, message: 'User not found!' };

  const validPassword = bcryptjs.compareSync(password, validUser.password);
  if (!validPassword) throw { statusCode: 401, message: 'Wrong credentials!' };

  const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
  const { password: pass, ...rest } = validUser._doc;
  return { token, user: rest };
};

export const googleSignInService = async ({ email, name, photo }) => {
  const user = await User.findOne({ email });

  if (user) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = user._doc;
    return { token, user: rest };
  } else {
    // New user created via Google
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

    const newUser = new User({
      username: name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
      email: email,
      password: hashedPassword,
      avatar: photo,
    });

    await newUser.save();
    try {
      await sendWelcomeEmail(newUser.email, newUser.username);
    } catch (emailErr) {
      console.warn('Welcome email failed to send:', emailErr.message);
    }

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = newUser._doc;
    return { token, user: rest };
  }
};
