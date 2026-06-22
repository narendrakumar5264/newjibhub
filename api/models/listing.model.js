import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    recruiterName:      { type: String, required: true },
    companyName:        { type: String, required: true },
    jobTitle:           { type: String, required: true },
    imageUrls:          { type: Array,  required: true },
    salary:             { type: String, required: true },
    jobType:            { type: String, required: true },
    description:        { type: String, required: true },
    experienceRequired: { type: String, required: true },
    skillsRequired:     { type: String, required: true },
    city:               { type: String, required: true },
    address:            { type: String, required: true },
    userRef:            { type: String, required: true },
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;