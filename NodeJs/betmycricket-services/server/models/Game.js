import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

let gameSchema = new mongoose.Schema({
  groupId: {
    type: ObjectId,
    ref: "Group",
    required: true
  },
  userId: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  matchId: {
    type: ObjectId,
    ref: "Match",
    required: true
  },
  selectedTeamId: {
    type: ObjectId,
    ref: "Team",
    required: true
  },
  gameOver: {
    type: Boolean,
    default: false
  },
  credits: {
    type: Number
  }
});

exports.gameSchema = gameSchema;
exports.Game = mongoose.model("Game", gameSchema);
