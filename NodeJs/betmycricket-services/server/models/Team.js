import mongoose from "mongoose";
import { playerSchema } from "./Player";

let teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  homeplace: {
    type: String,
    required: true
  },
  logoUrl: {
    type: String,
    required: true
  },
  players: [
    {
      type: playerSchema
    }
  ]
});

let team = mongoose.model("Team", teamSchema);

exports.Team = team;
exports.teamSchema = teamSchema;
