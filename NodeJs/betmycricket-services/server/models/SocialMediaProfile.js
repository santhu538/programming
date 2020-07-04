import mongoose from "mongoose";

let socialMediaProfileSchema = new mongoose.Schema({
  socialMediaId: {
    type: String,
    required: true
  },
  socialMediaType: {
    type: String,
    required: true
  }
});

let socialMediaProfile = mongoose.model(
  "SocialMediaProfile",
  socialMediaProfileSchema
);

exports.socialMediaProfileSchema = socialMediaProfileSchema;
exports.SocialMediaProfile = socialMediaProfile;
