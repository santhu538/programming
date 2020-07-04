import mongoose from "mongoose";
import { matchSchema } from "./Match";

let creditsSchema = new mongoose.Schema({
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Match",
    required: true
  },
  credits: {
    type: Number,
    min: 10,
    max: 999999999,
    required: true
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true
  }
});

let credits = mongoose.model("Credits", creditsSchema);

exports.Credits = credits;
exports.creditsSchema = creditsSchema;
