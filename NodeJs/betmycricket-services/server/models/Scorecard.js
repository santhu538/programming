import mongoose from "mongoose";
import { groupSchema } from "./Group";
import { userSchema } from "./User";

let scorecardSchema = new mongoose.Schema({
  group: {
    type: groupSchema,
    required: true
  },
  user: {
    type: userSchema,
    required: true
  },
  credits: {
    type: mongoose.Schema.Types.Long,
    required: true
  },
  winCount: {
    type: Number,
    required: true
  },
  lossCount: Number,
  npCount: Number,
  nrCount: Number
});

exports.scorecard = mongoose.model("Scorecard", scorecardSchema);
