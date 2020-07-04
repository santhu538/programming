const express = require("express");
const router = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");

import { GroupMatch } from "../models/GroupMatch";
const { Credits } = require("../models/Credits");
const groupMatchService = require("../services/group-match-service");

router.get("/", async (req, res) => {
  let groupMatches = await GroupMatch.find();
  res.status(200).send(groupMatches);
});

router.get("/group/:groupId", async (req, res) => {
  let groupMatches = await GroupMatch.find({
    groupId: mongoose.Types.ObjectId(req.params.groupId)
  });
  res.status(200).send(groupMatches);
});

router.put("/", async (req, res) => {
  let groupMatch = await GroupMatch.findOne({
    matchId: mongoose.Types.ObjectId(req.body.matchId),
    groupId: mongoose.Types.ObjectId(req.body.groupId)
  }).populate("matchId");

  if (groupMatch) {
    let scheduledDate = groupMatch.matchId.scheduledDate;
    let currentDate = new Date();

    let timeInMinutes =
      (scheduledDate.getTime() - currentDate.getTime()) / (60 * 1000);
    console.log("timeInMinutes", timeInMinutes);

    if (timeInMinutes <= 30) {
      res
        .status(412)
        .send({ success: false, message: "Sorry, The deadline has passed!" });
    }
  }

  //Checking if user belongs to the group to play game.
  try {
    await groupMatchService.isUserBelongsToGroup(
      req.body.groupId,
      req.body.userId
    );
  } catch (err) {
    console.log("message ", err);
    return res.status(400).send({ success: false, message: err });
  }

  console.log("after isUserBelongsToGroup");
  if (!groupMatch) {
    groupMatchService
      .insertGroupMatch(
        req.body.groupId,
        req.body.matchId,
        req.body.userId,
        req.body.selectedTeamId
      )
      .then(groupMatch => {
        return res.status(200).send(groupMatch);
      })
      .catch(err => {
        return res.status(err.code).send(err);
      });
  } else {
    if (groupMatch.matchCompleted) {
      return res
        .status(400)
        .send({ success: false, message: "Match has already been completed" });
    }
    groupMatchService
      .updateGroupMatch(groupMatch, req.body.userId, req.body.selectedTeamId)
      .then(groupMatch => {
        return res.status(200).send(groupMatch);
      })
      .catch(err => {
        return res.status(err.code).send(err);
      });
  }
});

router.put("/credits", async (req, res) => {
  let { groupId, matchId, credits } = req.body;

  let creditsDB = await Credits.findOne({
    groupId: mongoose.Types.ObjectId(groupId),
    matchId: mongoose.Types.ObjectId(matchId)
  });

  creditsDB.credits = credits;
  creditsDB
    .save()
    .then(creditsObj => {
      return res.status(200).send(creditsObj);
    })
    .catch(error => {
      return res.status(500).send({
        success: false,
        message: "Failed to update credits",
        error: error.message
      });
    });
});

module.exports = router;
