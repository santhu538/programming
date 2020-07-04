const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

import { Credits } from "../models/Credits";
import { Result } from "../models/Result";
import { GroupMatch } from "../models/GroupMatch";
const resultsService = require("../services/results-service");

router.get("/", async (req, res) => {
  let results = await Result.find();
  res.status(200).send(results);
});

router.delete("/", async (req, res) => {
  await Result.find()
    .remove()
    .exec();
  res
    .status(200)
    .send({ success: true, message: "records deleted successfully." });
});

router.get("/leaderboard/:groupId", async (req, res) => {
  let results = await Result.find({
    groupId: mongoose.Types.ObjectId(req.params.groupId)
  }).populate("userId");
  resultsService
    .fetchUsersOrderByCredits(results)
    .then(userStats => {
      res.status(200).send(userStats);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

router.get("/history/:groupId", async (req, res) => {
  let results = await Result.find({
    groupId: mongoose.Types.ObjectId(req.params.groupId)
  })
    .select("matchId winningTeamId")
    .populate({
      path: "matchId",
      select: {
        venue: 1
      },
      populate: {
        path: "team1",
        select: {
          name: 1,
          code: 1,
          logoUrl: 1
        },
        model: "Team"
      }
    })
    .populate({
      path: "matchId",
      select: {
        venue: 1,
        scheduledDate: 1
      },
      populate: {
        path: "team2",
        select: {
          name: 1,
          code: 1,
          logoUrl: 1
        },
        model: "Team"
      }
    });
  // .populate("winningTeamId", "name code logoUrl");
  resultsService
    .fetchResultsHistory(results)
    .then(resultsHistory => {
      res.status(200).send(resultsHistory);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

router.put("/", async (req, res) => {
  let matchId = req.body.matchId;
  let groupId = req.body.groupId;
  let winningTeamId = req.body.winningTeamId;

  // let results = Result.find({groupId: groupId, matchId: matchId});

  Result.deleteMany(
    {
      groupId: groupId,
      matchId: matchId
    },
    async function(err, _) {
      if (err) {
        return console.log("Error in deleting results ", err.message);
      } else {
        console.log("Records deleted..");
        let groupMatch = await GroupMatch.findOne({
          matchId: matchId,
          groupId: groupId
        });
        groupMatch.matchCompleted = false;
        await groupMatch.save().then(groupMatchDB => {
          console.log("groupMatch updated..");
        });
      }
    }
  );

  resultsService
    .insertResults(matchId, groupId, winningTeamId)
    .then(resultsDB => {
      return res.status(200).send(resultsDB);
    })
    .catch(err => {
      res.status(err.code).send(err);
    });
});

router.put("update/result", async (req, res) => {});

module.exports = router;
