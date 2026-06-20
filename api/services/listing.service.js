import Listing from '../models/listing.model.js';

export const createListingService = async (body) => {
  const listing = await Listing.create(body);
  return listing;
};

export const deleteListingService = async (id, userId) => {
  const listing = await Listing.findById(id);

  if (!listing) {
    throw { statusCode: 404, message: 'Listing not found!' };
  }

  if (userId !== listing.userRef) {
    throw { statusCode: 401, message: 'You can only delete your own listings!' };
  }

  await Listing.findByIdAndDelete(id);
};

export const updateListingService = async (id, userId, body) => {
  const listing = await Listing.findById(id);
  
  if (!listing) {
    throw { statusCode: 404, message: 'Listing not found!' };
  }
  if (userId !== listing.userRef) {
    throw { statusCode: 401, message: 'You can only update your own listings!' };
  }

  const updatedListing = await Listing.findByIdAndUpdate(
    id,
    body,
    { new: true }
  );
  return updatedListing;
};

export const getListingService = async (id) => {
  const listing = await Listing.findById(id);
  if (!listing) {
    throw { statusCode: 404, message: 'Listing not found!' };
  }
  return listing;
};

export const getListingsService = async (query) => {
  const limit = parseInt(query.limit) || 9;
  const startIndex = parseInt(query.startIndex) || 0;
  const sort = query.sort || 'createdAt';
  const order = query.order || 'desc';

  // Build filter from query params
  const filter = {};

  if (query.searchTerm) {
    filter.$or = [
      { jobTitle: { $regex: query.searchTerm, $options: 'i' } },
      { description: { $regex: query.searchTerm, $options: 'i' } },
      { companyName: { $regex: query.searchTerm, $options: 'i' } },
      { skillsRequired: { $regex: query.searchTerm, $options: 'i' } },
    ];
  }

  if (query.city) {
    filter.city = { $regex: query.city, $options: 'i' };
  }

  if (query.type && query.type !== 'all') {
    filter.jobType = { $regex: query.type, $options: 'i' };
  }

  const listings = await Listing.find(filter)
    .sort({ [sort]: order })
    .limit(limit)
    .skip(startIndex);

  return listings;
};
