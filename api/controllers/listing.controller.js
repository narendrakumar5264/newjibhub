import { errorHandler } from '../utils/error.js';
import {
  createListingService,
  deleteListingService,
  updateListingService,
  getListingService,
  getListingsService
} from '../services/listing.service.js';

export const createListing = async (req, res, next) => {
  try {
    const listing = await createListingService(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    await deleteListingService(req.params.id, req.user.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    if (error.statusCode) {
      next(errorHandler(error.statusCode, error.message));
    } else {
      next(error);
    }
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const updatedListing = await updateListingService(req.params.id, req.user.id, req.body);
    res.status(200).json(updatedListing);
  } catch (error) {
    if (error.statusCode) {
      next(errorHandler(error.statusCode, error.message));
    } else {
      next(error);
    }
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await getListingService(req.params.id);
    res.status(200).json(listing);
  } catch (error) {
    if (error.statusCode) {
      next(errorHandler(error.statusCode, error.message));
    } else {
      next(error);
    }
  }
};

export const getListings = async (req, res, next) => {
  try {
    const listings = await getListingsService(req.query);
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
