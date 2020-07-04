import mongoose from "mongoose";

let playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  playerRole: {
    type: String,
    required: true,
    enum: ["All Rounder", "Batsman", "Bowler"]
  },
  wicketKeeper: {
    type: Boolean,
    required: true
  },
  captain: {
    type: Boolean,
    required: true
  }
});

let player = mongoose.model("Player", playerSchema);

exports.player = player;
exports.playerSchema = playerSchema;
