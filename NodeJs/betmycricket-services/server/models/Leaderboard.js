const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

let leaderBoardSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: "User"
  },
  matchesWon: [
    {
      type: ObjectId,
      ref: "Match"
    }
  ],
  matchesLost: [
    {
      type: ObjectId,
      ref: "Match"
    }
  ],
  matchesNP: [
    {
      type: ObjectId,
      ref: "Match"
    }
  ],
  matchesNR: [
    {
      type: ObjectId,
      ref: "Match"
    }
  ],
  totalCredits: [
    {
      type: Number
    }
  ]
});

module.exports.Leaderboard = mongoose.model("Leaderboard", leaderBoardSchema);
