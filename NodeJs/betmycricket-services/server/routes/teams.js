const express = require("express");
const router = express.Router();
import { Team } from "../models/Team";

router.get("/", async (req, res) => {
  let teams = Team.find().sort("name");
  res.status(200).send(teams);
});

router.post("/", async (req, res) => {
  console.log("Teams ", req.body.teams);

  for (let team of req.body.teams) {
    let teamDB = new Team(team);
    teamDB.save();
  }

  res.status(200).send("Records inserted");
});

module.exports = router;
