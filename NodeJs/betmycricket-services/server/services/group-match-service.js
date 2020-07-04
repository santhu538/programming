import { User } from "../models/User";
import { GroupMatch } from "../models/GroupMatch";
import { Group } from "../models/Group";
import { Match } from "../models/Match";
import { Credits } from "../models/Credits";

const mongoose = require("mongoose");

module.exports.isUserBelongsToGroup = function(groupId, userId) {
  return new Promise(async function(resolve, reject) {
    let groupDB = await Group.findById(groupId);
    console.log("log ", groupDB);
    let userDB = groupDB.users.find(user => {
      return user.user.toString() == userId;
    });
    if (userDB) {
      resolve("success");
    } else {
      reject("User does not belong to the group");
    }
  });
};

module.exports.updateGroupMatch = function(groupMatch, userId, selectedTeamId) {
  return new Promise(async function(resolve, reject) {
    let error = {
      success: false,
      code: 500,
      message: "Unable to update groupMatch."
    };

    try {
      if (
        (groupMatch.team1Users.includes(mongoose.Types.ObjectId(userId)) &&
          groupMatch.team1.toString() == selectedTeamId) ||
        (groupMatch.team2Users.includes(mongoose.Types.ObjectId(userId)) &&
          groupMatch.team2.toString() == selectedTeamId)
      ) {
        error.code = 409;
        error.message = "User already selected this team";
        reject(error);
        return;
      }

      let userDB = await User.findById(userId);
      console.log("team1 ", groupMatch.team1.toString());
      console.log("team2 ", groupMatch.team2.toString());
      console.log("selectedTeamId ", selectedTeamId);

      if (groupMatch.team1.toString() == selectedTeamId) {
        groupMatch.team1Users.push(userDB);
        if (groupMatch.team2Users.includes(mongoose.Types.ObjectId(userId))) {
          console.log("removing user from team2");
          console.log(
            "index 2 ",
            groupMatch.team2Users.indexOf(mongoose.Types.ObjectId(userId))
          );
          console.log("2 length before ", groupMatch.team2Users.length);
          groupMatch.team2Users.splice(
            groupMatch.team2Users.indexOf(mongoose.Types.ObjectId(userId)),
            1
          );
          console.log("2 length after ", groupMatch.team2Users.length);
        }
      } else if (groupMatch.team2.toString() == selectedTeamId) {
        groupMatch.team2Users.push(userDB);
        if (groupMatch.team1Users.includes(mongoose.Types.ObjectId(userId))) {
          console.log("removing user from team1");
          console.log(
            "index 1 ",
            groupMatch.team1Users.indexOf(mongoose.Types.ObjectId(userId))
          );
          console.log("1 length before ", groupMatch.team1Users.length);
          groupMatch.team1Users.splice(
            groupMatch.team1Users.indexOf(mongoose.Types.ObjectId(userId)),
            1
          );
          console.log("1 length before ", groupMatch.team1Users.length);
        }
      } else {
        console.log("rejecting response");
        reject(error);
        return;
      }
      await groupMatch
        .save()
        .then(groupMatchDB =>
          resolve(parseResponse(groupMatchDB, selectedTeamId, userId))
        )
        .catch(error => reject(error));
    } catch (err) {
      console.log("error in catch", err.message);
      reject(error);
    }
  });
};

function parseResponse(groupMatchDB, selectedTeamId, userId) {
  return {
    matchId: groupMatchDB.matchId,
    groupId: groupMatchDB.groupId,
    userId: userId,
    selectedTeamId: selectedTeamId,
    team1Ratio: groupMatchDB.team1Users.length,
    team2Ratio: groupMatchDB.team2Users.length
  };
}

module.exports.insertGroupMatch = function(
  groupId,
  matchId,
  userId,
  selectedTeamId
) {
  return new Promise(async function(resolve, reject) {
    try {
      let groupDB = await Group.findById(groupId);
      let matchDB = await Match.findById(matchId);
      let userDB = await User.findById(userId);
      let groupMatch = new GroupMatch({
        groupId: groupDB._id,
        matchId: matchDB._id,
        team1: matchDB.team1,
        team2: matchDB.team2
      });

      let teamUsers = [];
      teamUsers.push(userDB);
      if (matchDB.team1.toString() == selectedTeamId) {
        groupMatch.team1Users = teamUsers;
      } else if (matchDB.team2.toString() == selectedTeamId) {
        groupMatch.team2Users = teamUsers;
      }

      let credits = new Credits({
        matchId: matchDB,
        groupId: groupDB,
        credits: groupDB.defaultCredits
      });

      groupMatch.credits = await credits.save();

      groupMatch
        .save()
        .then(groupMatchDB =>
          resolve(parseResponse(groupMatchDB, selectedTeamId, userId))
        )
        .catch(err => {
          console.log("DB Err", err.message);
          reject({
            success: false,
            message: "Unable to update GroupMatch record in DB.",
            code: 500
          });
        });
    } catch (err) {
      console.log("error in insertGroupMatch", err.message);
      reject({
        success: false,
        message: "Invalid request payload.",
        code: 400
      });
    }
  });
};
