import mongoose from "mongoose";

let tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team"
    }
  ],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  matches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match"
    }
  ]
});

let Tournament = mongoose.model("Tournament", tournamentSchema);

exports.Tournament = Tournament;
exports.tournamentSchema = tournamentSchema;
