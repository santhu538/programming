import mongoose from "mongoose";

let ratioSchema = new mongoose.Schema({
  groupId: {
    type: String,
    required: true
  },
  matchId: {
    type: String,
    required: true
  },
  team1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  },
  team2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  },
  team1Ratio: {
    type: Number,
    required: true
  },
  team2Ratio: {
    type: Number,
    required: true
  }
});

let Ratio = mongoose.model("Ratio", ratioSchema);
exports.Ratio = Ratio;
