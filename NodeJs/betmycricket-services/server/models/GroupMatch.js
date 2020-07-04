const mongoose = require("mongoose");

exports.GroupMatch = mongoose.model(
  "GroupMatch",
  new mongoose.Schema({
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true
    },
    team1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true
    },
    team2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true
    },
    team1Users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],
    team2Users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],
    credits: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Credits",
      required: true
    },
    matchCompleted: {
      type: Boolean,
      default: false
    }
  })
);
