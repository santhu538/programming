import mongoose from "mongoose";
import { matchSchema } from "./Match";
import { userSchema } from "./User";
import { creditsSchema } from "./Credits";

const ObjectId = mongoose.Schema.Types.ObjectId;

let resultSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  groupId: {
    type: ObjectId,
    ref: "Group",
    required: true
  },
  matchId: {
    type: ObjectId,
    ref: "Match",
    required: true
  },
  winningTeamId: {
    type: ObjectId,
    ref: "Team",
    required: true
  },
  /*losingTeamId: {
    type: ObjectId,
    ref: "Team",
    required: true
  },*/
  won: {
    type: Boolean,
    required: true
  },
  np: {
    type: Boolean,
    default: false
  },
  nr: {
    type: Boolean,
    default: false
  },
  credits: {
    type: Number,
    required: true
  }
});

resultSchema.index({ userId: 1, groupId: 1, matchId: 1 }, { unique: true });

exports.Result = mongoose.model("Result", resultSchema);
