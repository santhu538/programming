const Joi = require("joi");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
import { Tournament } from "../models/Tournament";
import { Team } from "../models/Team";
import { Match } from "../models/Match";
import { GroupMatch } from "../models/GroupMatch";
import { Credits } from "../models/Credits";
const _ = require("lodash");

var HashMap = require("hashmap");

router.get("/", async (req, res) => {
  const tournament = await Tournament.find().sort("name");
  let currentDate = new Date();
  let matches = await Match.find({
    scheduledDate: {
      $gte: currentDate
    }
  })
    .populate("team1", "name code logoUrl")
    .populate("team2", "name code logoUrl")
    .sort("scheduledDate");
  tournament.matches = matches;
  let schedule = {
    schedule: tournament
  };
  res.send(matches);
});

router.get("/upcoming/matches", async (req, res) => {
  let currentDate = new Date();
  let matches = await Match.find({
    scheduledDate: {
      $gte: currentDate
    }
  })
    .populate("team1")
    .populate("team2")
    .sort("scheduledDate");

  let matchesObj = {
    matches: [],
    upcomingMatchIndex: 0
  };

  let groupId = req.query["groupId"];

  let groupMatches = await GroupMatch.find({
    groupId: mongoose.Types.ObjectId(groupId),
    matchId: {
      $in: matches
    }
  });
  let upcomingMatchCount = 0;
  for (let match of matches) {
    let team1Ratio = 0;
    let team2Ratio = 0;
    let matchCompleted = false;

    if (groupMatches.length > 0) {
      let groupMatch = groupMatches.find(groupMatchDB => {
        return (
          groupMatchDB.matchId.toString() == match._id.toString() &&
          groupMatchDB.groupId.toString() == groupId
        );
      });
      if (groupMatch) {
        /* if (groupMatch.matchCompleted) {
                    continue;
                }*/
        matchCompleted = groupMatch.matchCompleted;
        team1Ratio = groupMatch.team1Users.length;
        team2Ratio = groupMatch.team2Users.length;
      }
    }

    if (!matchCompleted) {
      upcomingMatchCount++;
    } else {
      matchesObj.upcomingMatchIndex++;
    }

    let matchObj = {
      matchId: match._id,
      team1: match.team1.code,
      team1Id: match.team1._id,
      team1Logo: match.team1.logoUrl,
      team2: match.team2.code,
      team2Id: match.team2._id,
      team2Logo: match.team2.logoUrl,
      team1Ratio: team1Ratio,
      team2Ratio: team2Ratio,
      venue: match.venue,
      scheduledDate: match.scheduledDate,
      matchCompleted: matchCompleted
    };
    matchesObj.matches.push(matchObj);

    if (upcomingMatchCount == 5) {
      break;
    }
  }
  matchesObj.upcomingMatchIndex = matchesObj.matches.length - 5;
  res.status(200).send(matchesObj);
});

router.get("/:id", async (req, res) => {
  Tournament.findById(req.params.id)
    .sort("name")
    .then(tournament => {
      res.send(tournament);
    })
    .catch(error => {
      res.send("Unable to find tournament record");
    });
});

router.get("/summary/:groupId/:matchId", async (req, res) => {
  let groupId = req.params.groupId;
  let matchId = req.params.matchId;
  let groupMatch = await GroupMatch.findOne({
    matchId: mongoose.Types.ObjectId(matchId),
    groupId: mongoose.Types.ObjectId(groupId)
  })
    .populate("team1", "code logoUrl")
    .populate("team2", "code logoUrl")
    .populate("matchId", "_id venue scheduledDate")
    .populate("team1Users", "_id fullName")
    .populate("team2Users", "_id fullName");

  let credits = await Credits.findOne({ matchId: matchId, groupId: groupId });

  res.status(200).send({
    matchId: groupMatch.matchId._id,
    team1: groupMatch.team1.code,
    team1Logo: groupMatch.team1.logoUrl,
    team2: groupMatch.team2.code,
    team2Logo: groupMatch.team2.logoUrl,
    team1Ratio: groupMatch.team1Users.length,
    team2Ratio: groupMatch.team2Users.length,
    team1Users: groupMatch.team1Users,
    team2Users: groupMatch.team2Users,
    venue: groupMatch.matchId.venue,
    scheduledDate: groupMatch.matchId.scheduledDate,
    credits: credits.credits
  });
});

router.post("/", async (req, res) => {
  // const { error } = validateGenre(req.body);
  // if (error) return res.status(400).send(error.details[0].message);
  console.log("persisting tournament records");
  let tournament = new Tournament(req.body);

  let teamsArr = [];
  let map = new HashMap();
  for (let teamCode of req.body.teams) {
    let teamDB = await Team.findOne({ code: teamCode });
    map.set(teamCode, teamDB);
    teamsArr.push(teamDB);
  }
  let updatedMatches = [];
  for (let match of req.body.matches) {
    match.team1 = map.get(match.team1);
    match.team2 = map.get(match.team2);
    updatedMatches.push(match);
  }

  tournament.teams = teamsArr;

  console.log("teamsArr", tournament.teams);
  console.log("updatedMatches 1 ", updatedMatches);
  var updatedMatchDBs = [];
  Match.insertMany(updatedMatches, (err, match) => {
    if (err) {
      console.log("error in saving matches");
    } else {
      // console.log("saved match", match);
      tournament.matches = match;
      console.log("updatedMatches", tournament.matches);

      tournament
        .save()
        .then(trnmnt => {
          return res.status(201).json({
            success: true,
            message: "Tournament submitted successfully",
            Tournament: trnmnt
          });
        })
        .catch(error => {
          res.status(500).json({
            success: false,
            message: "Server error. Please try again.",
            error: error.message
          });
        });
    }
  });
});

router.put("/:id", async (req, res) => {
  const { error } = validateTournament(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const tournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!tournament)
      return res
        .status(404)
        .send("Tournament record not found for the given id.");

    res.send(tournament);
  } catch (error) {
    res.send(error);
  }
});

router.delete("/tournament", async (req, res) => {
  await Match.find()
    .remove()
    .exec();
  await Tournament.find()
    .remove()
    .exec();
  res.status(200).send({ success: true, message: "deleted successfully." });
});

function validateTournament(tournament) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };

  return Joi.validate(tournament, schema);
}

module.exports = router;
