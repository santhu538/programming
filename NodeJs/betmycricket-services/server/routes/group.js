const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const _ = require("lodash");
const validateToken = require("../middleware/validateToken");
const {ADMIN} = require("../utils/constants");

import {Group, validateGroupId} from "../models/Group";
import {User} from "../models/User";

router.get("/", async (req, res) => {
    let groups = await Group.find();

    res.status(200).send(groups);
});

router.get("/:id", async (req, res) => {
    let groups = await Group.findById(req.params.id).populate("users.user", "id fullName photo capabilities");

    res.status(200).send(groups);
});

router.post("/", async (req, res) => {
    let group = new Group(req.body);

    // generating unique 6 digit code
    group.groupCode = _.times(6, () => _.random(35).toString(36)).join("").toUpperCase();

    if (req.body.createdBy == null || req.body.createdBy == "") {
        return res.status(400).json({success: false, message: "createdBy is required."});
    }

    try {
        var userDB = await User.findById(req.body.createdBy);
        if (! userDB) {
            return res.status(400).json({success: false, message: "Invalid admin user."});
        }
    } catch (err) {
        return res.status(400).json({success: false, message: "Invalid admin user."});
    }

    console.log("userDB ", userDB);
    group.createdBy = userDB;
    let userObj = {
        isAdmin: true,
        user: userDB
    };
    group.users.push(userObj);

    group.save().then(groupDB => {
        // saveCredits(groupId,matchId,groupDB.defaultCredits);
        /* let credits = new Credits();
      credits.groupId = groupId;
      credits.matchId = matchId;
      credits.credits = groupDB.defaultCredits;
      credits.save().then(console.log("credits saved successfully"));*/
        res.status(200).json({success: true, message: "Group created successfully", group: groupDB});
    }).catch(error => {
        res.status(500).json({success: false, message: "Failed to create group.", error: error.message});
    });
});

/*async function saveCredits(groupId, matchId, credits) {
  let credits = new Credits();
  credits.groupId = groupId;
  credits.matchId = matchId;
  credits.credits = credits;
  credits.save().then(console.log("credits saved successfully"));
}
*/
router.get("/user/:userId", async (req, res) => {
    let userId = req.params.userId;
    console.log("userid", userId);
    let groups = await Group.find({"users.user": mongoose.Types.ObjectId(userId)});

    res.status(200).send(groups);
});

router.put("/add/users", async (req, res) => {
    let group = await Group.findOne({groupCode: req.body.groupCode});
    let user = await User.findById(req.body.userId);
    if (! group) {
        res.status(400).json({success: false, message: "Invalid Group"});
    } else if (! user) {
        res.status(400).json({success: false, message: "Invalid User"});
    } else if (findUser(group, user)) {
        res.status(400).json({success: false, message: "User already exists"});
    } else {
        let userObj = {
            user: user
        };
        group.users.push(userObj);
        group.save().then(groupDB => {
            res.status(200).json({success: true, message: "Users added successfully", group: groupDB});
        }).catch(error => {
            res.status(500).json({success: false, message: "Failed to add users to the group", error: error.message});
        });
    }
    /*let { error } = validateGroupId(group);
  if (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }*/
});

function findUser(group, user) {
    let userFound = group.users.find(userDB => userDB._id.toString() === user._id.toString());
    return userFound != null;
}

module.exports = router;
