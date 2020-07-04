const express = require("express");
const router = express.Router();
const winston = require("winston");
const mongoose = require("mongoose");
const { PLAYER } = require("../utils/constants");
import { Group } from "../models/Group";

import { User } from "../models/User";
const userService = require("../services/UserService");

router.get("/", async (req, res) => {
  let users = await User.find().sort("firstName");
  res.status(200).send(users);
});

/*Story.distinct('elements', {'isPrivate':false}, function(error, results) { 
 
}*/

router.get("/socialmedia/:socialMediaId", async (req, res) => {
  let users = await User.find({
    "socialMediaProfiles.socialMediaId": req.params.socialMediaId
  });
  if (users.length > 0) {
    res.status(200).send(users[0]);
  } else {
    res.status(404).json({
      message: "User not found."
    });
  }
});

router.get("/:id", async (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      res.status(200).send(user);
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: "User not found",
        error: err
      });
    });
});

router.put("/admin", async (req, res) => {
  let { adminUserId, playerUserId, groupId } = req.body;
  userService
    .authoriseAdmin(adminUserId, groupId)
    .then(() => {
      userService
        .updateAdmin(playerUserId, groupId)
        .then(userObj => {
          res.status(200).send(userObj);
        })
        .catch(() => {
          return res.status(500).send({
            success: false,
            message: "unable to update user role"
          });
        });
    })
    .catch(() => {
      res.status(401).send({
        message: "Unauthorised to make this operation."
      });
    });
});

router.delete("/admin", async (req, res) => {
  let { adminUserId, playerUserId, groupId } = req.body;
  userService
    .authoriseAdmin(adminUserId, groupId)
    .then(() => {
      userService
        .removeAdmin(playerUserId, groupId)
        .then(groupDB => {
          res.status(200).send(groupDB);
        })
        .catch(() => {
          return res.status(500).send({
            success: false,
            message: "unable to update user role"
          });
        });
    })
    .catch(() => {
      res.status(401).send({
        message: "Unauthorised to make this operation."
      });
    });
});

router.post("/", async (req, res) => {
  let user = new User(req.body);
  //  user.capabilities.push(PLAYER);

  user
    .save()
    .then(userrecord => {
      res.status(200).json({
        success: true,
        message: "User submitted successfully",
        User: userrecord
      });
    })
    .catch(error => {
      res.status(500).send(error.message);
    });
});

router.delete("/:id", async (req, res) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return res.status(200).json({
      success: true,
      message: "No records found"
    });
  }
  let groups = await Group.find({ createdBy: user._id });

  for (let group of groups) {
    await group.delete();
  }

  user
    .delete()
    .then(() => {
      console.log("Deleted successfully");
      return res.status(200).json({
        success: true,
        message: "User submitted successfully"
      });
    })
    .catch(() => {
      return res.status(200).json({
        success: true,
        message: "No records found"
      });
    });
});

module.exports = router;
