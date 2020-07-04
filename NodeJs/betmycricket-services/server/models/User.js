import mongoose from "mongoose";
const { socialMediaProfileSchema } = require("./SocialMediaProfile");
import { gameSchema } from "./Game";

let userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String
  },
  fullName: {
    type: String,
    required: true
  },
  photo: {
    type: String
  },
  dob: {
    type: Date
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  socialMediaProfiles: [
    {
      type: socialMediaProfileSchema
    }
  ] /*,
  capabilities: [
    {
      type: String,
      required: true,
      enum: ["Player", "Admin"]
    }
  ]*/
});

let user = mongoose.model("User", userSchema);

exports.userSchema = userSchema;
exports.User = user;
