const mongoose = require("mongoose");
import { User } from "../models/User";
import { Group } from "../models/Group";
import { ADMIN } from "../utils/constants";

module.exports.authoriseAdmin = function(adminUserId, groupId) {
  return new Promise(async function(resolve, reject) {
    try {
      let group = await Group.findById(groupId);
      console.log("adminUserId ", adminUserId);
      console.log("group ", group);
      let userObj = group.users.find(
        userObj => userObj.user.toString() == adminUserId
      );
      console.log("userObj", userObj);
      if (userObj.isAdmin) {
        resolve();
      } else {
        reject();
      }
    } catch (err) {
      console.log("exception in authoriseAdmin ", err.message);
      reject();
    }
  });
};

module.exports.updateAdmin = function(playerUserId, groupId) {
  return new Promise(async function(resolve, reject) {
    try {
      let group = await Group.findById(groupId);

      for (let userObj of group.users) {
        if (userObj.user.toString() == playerUserId) {
          userObj.isAdmin = true;
        }
      }

      group
        .save()
        .then(groupDB => {
          resolve(groupDB);
        })
        .catch(() => {
          reject();
        });
    } catch (err) {
      console.log("exception in updateAdmin ", err.message);
      reject();
    }
  });
};

module.exports.removeAdmin = function(playerUserId, groupId) {
  return new Promise(async function(resolve, reject) {
    try {
      let group = await Group.findById(groupId);
      let adminUserObj = group.users.find(user => {
        return user.user.toString() == playerUserId;
      });
      if (!adminUserObj.isAdmin) {
        reject();
      } else {
        for (let i = 0; i < group.users.length; i++) {
          if (group.users[i].user.toString() == playerUserId) {
            if (!group.users[i].isAdmin) {
              reject();
            } else {
              group.users[i].isAdmin = false;
              break;
            }
          }
        }
        console.log("PlayerUserId ", playerUserId);
        console.log("after removing", group);
        group
          .save()
          .then(groupDB => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      }
    } catch (err) {
      console.log("exception in updateAdmin ", err.message);
      reject();
    }
  });
};

module.exports.removeUserFromGroup = function(groupId, playerUserId) {
  return new Promise(async function(resolve, reject) {
    try {
      let playerUser = await User.findById(playerUserId);
      if (playerUser.capabilities.includes(ADMIN)) {
        reject();
      } else {
        playerUser.capabilities.remove(ADMIN);
        console.log("after removing", playerUser.capabilities.remove(ADMIN));
        playerUser
          .save()
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      }
    } catch (err) {
      console.log("exception in updateAdmin ", err.message);
      reject();
    }
  });
};
