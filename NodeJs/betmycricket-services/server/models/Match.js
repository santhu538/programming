import mongoose from "mongoose";

let matchSchema = new mongoose.Schema({
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
  venue: {
    type: String,
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  }
});

let Match = mongoose.model("Match", matchSchema);

exports.Match = Match;
exports.matchSchema = matchSchema;
