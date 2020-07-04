var HashMap = require("hashmap");
const mongoose = require("mongoose");
const _ = require("lodash");
const { GroupMatch } = require("../models/GroupMatch");
const { Credits } = require("../models/Credits");
const { Result } = require("../models/Result");

module.exports.fetchUsersOrderByCredits = function(results) {
  return new Promise(function(resolve, reject) {
    try {
      let userResultsMap = new HashMap();

      for (let result of results) {
        let userId = result.userId._id.toString();
        if (userResultsMap.has(userId)) {
          let userResult = populateResults(userResultsMap.get(userId), result);
          userResultsMap.set(userId, userResult);
        } else {
          let userResult = {
            userId: userId,
            photo: result.userId.photo,
            fullName: result.userId.fullName,
            matchesPlayed: 0,
            matchesWon: 0,
            matchesLost: 0,
            matchesNP: 0,
            matchesNR: 0,
            credits: 0,
            indicator: ""
          };
          userResult = populateResults(userResult, result);
          userResultsMap.set(userId, userResult);
        }
      }
      let userStats = userResultsMap.values();
      if (userStats.length == 0) {
        resolve({ userStatus: userStats });
      }
      console.log("userStats", userStats);
      userStats = _.orderBy(userStats, ["credits"], ["desc"]);
      let topScore = userStats[0].credits;
      // rounding credits to 2 decimal places
      userStats = userStats.map(userStat => {
        userStat.credits = userStat.credits.toFixed(2);
        if (userStat.credits == topScore) {
          userStat.indicator = "topper";
        } else if (userStat.credits >= 0) {
          userStat.indicator = "positive";
        } else if (userStat.credits < 0) {
          userStat.indicator = "negative";
        }
        return userStat;
      });
      resolve({ userStatus: userStats });
    } catch (err) {
      console.log("error ", err.message);
      reject(err.message);
    }
  });
};

function populateResults(userResult, result) {
  if (result.np) {
    userResult.matchesNP++;
  } else if (result.won) {
    userResult.matchesWon++;
  } else if (result.nr) {
    userResult.matchesNR++;
  } else if (!result.won) {
    userResult.matchesLost++;
  }
  userResult.matchesPlayed++;
  userResult.credits = userResult.credits + result.credits;
  return userResult;
}

module.exports.fetchResultsHistory = function(results) {
  return new Promise(function(resolve, reject) {
    try {
      console.log("results", results);
      let matchesObj = {
        matches: []
      };
      let matchSet = new Set();
      for (let result of results) {
        let team1Flag = false;
        let team2Flag = false;

        if (
          result.winningTeamId.toString() == result.matchId.team1._id.toString()
        ) {
          team1Flag = true;
        } else if (
          result.winningTeamId.toString() == result.matchId.team2._id.toString()
        ) {
          team2Flag = true;
        }

        let resultObj = result.toObject();
        resultObj.matchId.team1.won = team1Flag;
        resultObj.matchId.team2.won = team2Flag;
        delete resultObj.winningTeamId;
        if (!matchSet.has(resultObj.matchId._id.toString())) {
          let matchObj = {
            matchId: resultObj.matchId._id,
            team1: resultObj.matchId.team1.code,
            team1Id: resultObj.matchId.team1._id,
            team1Logo: resultObj.matchId.team1.logoUrl,
            team1Won: team1Flag,
            team2: resultObj.matchId.team2.code,
            team2Id: resultObj.matchId.team2._id,
            team2Logo: resultObj.matchId.team2.logoUrl,
            team2Won: team2Flag,
            team1Ratio: 0,
            team2Ratio: 0,
            venue: resultObj.matchId.venue,
            scheduledDate: resultObj.matchId.scheduledDate,
            userWon: false,
            credits: 0
          };
          matchesObj.matches.push(matchObj);
        }
        matchSet.add(resultObj.matchId._id.toString());
      }
      console.log("matchSet", matchSet);
      resolve(matchesObj);
    } catch (err) {
      console.log("error", error.message);
      reject({});
    }
  });
};

module.exports.insertResults = function(matchId, groupId, winningTeamId) {
  return new Promise(async function(resolve, reject) {
    let error = {
      success: false,
      code: 500,
      message: "Unable to insert results."
    };

    var groupMatch = await GroupMatch.findOne({
      groupId: mongoose.Types.ObjectId(groupId),
      matchId: mongoose.Types.ObjectId(matchId)
    });

    /* if (groupMatch.matchCompleted) {
            error.code = 400;
            error.message = "Match has already been completed";
            reject(error);
        }*/

    let winningTeamRatio = 0;
    let losingTeamRatio = 0;
    let winningUsers = [];
    let losingUsers = [];

    if (groupMatch.team1.toString() == winningTeamId) {
      winningTeamRatio = groupMatch.team1Users.length;
      losingTeamRatio = groupMatch.team2Users.length;
      winningUsers = groupMatch.team1Users;
      losingUsers = groupMatch.team2Users;
    } else if (groupMatch.team2.toString() == winningTeamId) {
      winningTeamRatio = groupMatch.team2Users.length;
      losingTeamRatio = groupMatch.team1Users.length;
      winningUsers = groupMatch.team2Users;
      losingUsers = groupMatch.team1Users;
    }

    let credits = await Credits.findOne({ matchId: matchId, groupId: groupId });

    let winningCredits = (credits.credits * losingTeamRatio) / winningTeamRatio;
    let losingCredits = -credits.credits;

    let results = [];

    winningUsers.forEach(winningUser => {
      let result = new Result();
      result.userId = winningUser;
      result.groupId = mongoose.Types.ObjectId(groupId);
      result.matchId = mongoose.Types.ObjectId(matchId);
      result.won = true;
      result.credits = winningCredits;
      result.winningTeamId = mongoose.Types.ObjectId(winningTeamId);
      results.push(result);
    });

    losingUsers.forEach(losingUser => {
      let result = new Result();
      result.userId = losingUser;
      result.groupId = mongoose.Types.ObjectId(groupId);
      result.matchId = mongoose.Types.ObjectId(matchId);
      result.won = false;
      result.credits = losingCredits;
      result.winningTeamId = mongoose.Types.ObjectId(winningTeamId);
      // result.losingTeamId = mongoose.Types.ObjectId(losingTeamId);
      results.push(result);
    });

    console.log("winningTeamRatio", winningTeamRatio);
    console.log("losingTeamRatio", losingTeamRatio);
    console.log("winningCredits", winningCredits);
    console.log("losingCredits", losingCredits);
    console.log("winningUsers", winningUsers);
    console.log("losingUsers", losingUsers);

    await Result.insertMany(results, async (err, resultsDB) => {
      if (err) {
        console.log("error in updateing results", err.message);
        reject(error);
      } else {
        groupMatch.matchCompleted = true;
        await groupMatch
          .save()
          .then(groupMatchDB => {
            resolve(resultsDB);
          })
          .catch(err => {
            Result.deleteMany(resultsDB, err => {
              console.log("unable to delete results object");
            });
            console.log(":: error in updateing results :: ", err.message);
            reject(error);
          });
      }
    });
  });
};
