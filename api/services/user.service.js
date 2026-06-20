import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';

export const updateUserService = async (id, body) => {
  let updatedData = {
    username: body.username,
    email: body.email,
    avatar: body.avatar,
  };

  if (body.password) {
    updatedData.password = bcryptjs.hashSync(body.password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true }
  );

  const { password, ...rest } = updatedUser._doc;
  return rest;
};

export const deleteUserService = async (id) => {
  await User.findByIdAndDelete(id);
};

export const getUserListingsService = async (id) => {
  const listings = await Listing.find({ userRef: id });
  return listings;
};
